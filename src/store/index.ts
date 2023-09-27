import { createStore, applyMiddleware } from 'redux';
import { Reducers } from './reducers';
import thunk from 'redux-thunk';

const middleware = [ thunk ];
export const store = createStore(Reducers, applyMiddleware(...middleware));
