import io from 'socket.io-client';
import {
	socketTypes
} from 'kinopoisk/store/constants';

function isSocket(type, action) {
	return !!action.socket;
}

function execute(action, emit, next, dispatch) {
	const socket = action.socket;
	if (typeof socket.emit !== 'string') {
		console.error('Свойство emit должно быть String!');
	} else {
		emit(socket.emit, socket.data);
	}
	next(action);
}

function evaluate(action, option) {
	if (!action || !action.type) {
		return false;
	}

	const {
		type
	} = action;
	let matched = false;
	if (typeof option === 'function') {
		// Test function
		matched = option(type, action);
	} else if (typeof option === 'string') {
		// String prefix
		matched = type.indexOf(option) === 0;
	} else if (Array.isArray(option)) {
		// Array of types
		matched = option.some(item => type.indexOf(item) === 0);
	}
	return matched;
}

let socket = null;
let connection = false;

export default function socketIoMiddleware({
	getState,
	dispatch
}) {
	return next => action => {
		// Подкдючение к серверу через сокет
		if (action.type === socketTypes.SOCKET_CONNECT) {
			socket = io.connect(socketTypes.SOCKET_URL);
			connection = true;
			return next(action);
		} else if (socket) {

			//При новом подключении подписываем сокет на евенты
			if (connection) {
				for (const eventName in socketTypes.EVENT_TO_TYPE) {
					socket.on(eventName, function (data) {
						const action = {
							type: socketTypes.EVENT_TO_TYPE[eventName],
							data: data
						}
						dispatch(action);
					});
				}
				connection = false;
			}

			//Если action имеет тип "socket" то управление передается сокету
			if (evaluate(action, isSocket)) {
				const emitBound = socket.emit.bind(socket);
				return execute(action, emitBound, next, dispatch);
			}

			return next(action);

		} else {
			// Если подключения еще не было, то action просто прокидывается
			return next(action);
		}
	}
}