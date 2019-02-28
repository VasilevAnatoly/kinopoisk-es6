import axios from 'axios';
import _ from 'underscore';
import {
  push
} from 'connected-react-router'


// Middleware для обработки отправки запросов на сервер и получения ответа от сервера
export default function requestMiddleware({
  getState,
  dispatch
}) {
  return next => action => {
    // получаем config axios - request и тип action -  type, success, failure
    const {
      headers,
      request,
      type,
      success,
      failure,
      ...rest
    } = action;

    //если нет объекта request, то это обычный action, пропускаем его дальше, через остальные middleware
    if (!request) return next(action);
    //Расширяем тип action на три типа, когда запрос инициализирован, удачный, пришел с ошибкой
    const SUCCESS = success || type + '_SUCCESS';
    const REQUEST = type + '_REQUEST';
    const FAIL = failure || type + '_FAIL';

    //инициализируем новый action с типом request, чтобы зарегистрировать, что был отправлен запрос
    next({
      ...rest,
      type: REQUEST
    });

    var request_success = false;
    //отправляем запрос к серверу
    axios.request({
        ...request,
      })
      .then((res) => {
        const {
          data
        } = res;
        request_success = true;
        //инициализируем новый action с типом success, что запрос прошел удачно
        next({
          ...rest,
          data: data,
          type: SUCCESS
        });
        return true;
      })
      .catch((error) => {

        if (error.response) {
          const statusText = error.response.data;
          dispatch({
            ...rest,
            ...{
              errors: statusText
            },
            type: FAIL
          });

          if (error.response.status === 401) {}
        } else if (error.request) {
          dispatch({
            ...rest,
            ...{
              errors: new Error(error).message
            },
            type: FAIL
          });
        }
        //вызывается если произошла ошибка в чтении полученных данных
        else if (!request_success) {
          dispatch({
            ...rest,
            ...{
              errors: new Error(error).message
            },
            type: FAIL
          });
        }
        return false;
      });
  };
}