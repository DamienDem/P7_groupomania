import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/style.css';
import {Provider} from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';
import { getUsers } from "./actions/users.action";

//dev tools
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(thunk))
)

store.dispatch(getUsers());

ReactDOM.render(
  <Provider store = {store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

