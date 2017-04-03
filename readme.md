# redux-act-fn [![Build Status](https://travis-ci.org/mastilver/redux-act-fn.svg?branch=master)](https://travis-ci.org/mastilver/redux-act-fn)

[![Greenkeeper badge](https://badges.greenkeeper.io/mastilver/redux-act-fn.svg)](https://greenkeeper.io/)

> Reducing the boilerplate of creating thunk actions based on [redux-act](https://github.com/pauldijou/redux-act)


## Install

```
$ npm install --save redux-act-fn
```


## Usage

```js
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux';
import { createReducer } from 'redux-act';
import { createActionFn } from 'redux-act-fn'

export const login = createActionFn('login', ({idToken}) => {
    localStorage.setItem('idToken', idToken);
    return true
});

export const logout = createActionFn('logout', () => {
    localStorage.removeItem('idToken');
});

const reducer = createReducer({
    [login]: (state, {payload: {arg: {idToken}, output}}) => {
        return {
            ...state,
            isLoggedIn: output
            idToken
        };
    },
    [logout.before]: (state) => {
        return {
            ...state,
            isLoggedIn: false,
            idToken: null
        };
    }
}, {
    isLoggedIn: false,
    idToken: null
});

const store = createStore(reducer, applyMiddleware(thunk));

store.dispatch(login('qwerty'));
```


## API

### createActionFn(description, function, [options])

#### description

Type: `string`

describe the action, it will be used as a description for generated actions

#### function

Type: `Function`

The function to be executed when the action is dispatched

#### options

##### options.before

###### options.before.metaReducer

Type: `Function`<br>
Default: `() => 'BEFORE'`

Transform multiple arguments as a unique metadata object. (see [redux-act docs]( https://github.com/pauldijou/redux-act#createactiondescription-payloadreducer-metareducer))

###### options.before.payloadReducer

Type: `Function`<br>
Default: `(arg) => arg`

##### options.after

###### options.after.metaReducer

Type: `Function`<br>
Default: `() => 'BEFORE'`

Transform multiple arguments as a unique metadata object. (see [redux-act docs]( https://github.com/pauldijou/redux-act#createactiondescription-payloadreducer-metareducer))

###### options.after.payloadReducer

Type: `Function`<br>
Default: `(arg) => arg`


## Legacy redux

In a nutshell, the following code:

```js
export const login = createActionFn('login', ({idToken}) => {
    localStorage.setItem('idToken', idToken);
    return true
});
```

is equivalent to:

```js
const loginBefore = (value) => ({
    type: 'LOGIN_BEFORE',
    payload: value
});

const loginAfter = (value) => ({
    type: 'LOGIN_AFTER',
    payload: value
});

export const login = (...args) => (dispatch, getState) => {
    dispatch(loginBefore(...args));
    const output = (({idToken}) => {
        localStorage.setItem('idToken', idToken);
        return true
    })(...args, dispatch, getState);

    const after = {
        args,
        arg: args[0],
        output,
        retuns: output // alias of `output`,
    };

    dispatch(loginAfter(after));
    return output;
};
```


## License

MIT © [Thomas Sileghem](http://mastilver.com)
