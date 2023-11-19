import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import reducer from './reducer';

const store = createStore(reducer, applyMiddleware(thunk,promiseMiddleware));

export default store;