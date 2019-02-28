import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import {
  connectRouter,
  routerMiddleware
} from 'connected-react-router'
import thunk from 'redux-thunk';
import {
  createLogger
} from 'redux-logger';
import makeRootReducer from './reducers';
import {
  requestMiddleware,
  asyncDispatchMiddleware,
  socketIoMiddleware
} from './middlewares';

export default (initialState = {}, history) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, requestMiddleware, socketIoMiddleware, asyncDispatchMiddleware, routerMiddleware(history)]

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  if (process.env.NODE_ENV === 'development') {
    middleware.push(createLogger());
    const devToolsExtension = window.devToolsExtension
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension())
    }
  }

  // ======================================================
  // Store Instantiation
  // ======================================================
  const store = createStore(
    connectRouter(history)(makeRootReducer()),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  )
  store.asyncReducers = {}

  return store
};