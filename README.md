# redux-commander

[![npm package][npm-badge]][npm]

> Simple, declarative side effect bindings for Redux

Redux Commander tries to alleviate the headache of trying to manage side effects
and async actions in Redux by using a simple and declarative syntax. There is
not much to learn after you get it set up and it makes your async actions easy
to test and think about. It is inspired by [the Elm architecture][elm] as well
as the [effectful handlers in re-frame][re-frame].

## Installation

```
yarn add redux-commander
```

## Usage

The package only exposes two functions, `combineCommandReducers` and
`reduceCommandReducers`. You use one of these functions when first setting up
your Redux store. Since we need to have access to each reducer you use in your
app to be able to intercept the side effects (or commands), we can't implement
these as a [Redux middleware][middleware], but instead have to use Redux's
[`replaceReducer`][replaceReducer] function.

```js
import { createStore } from 'redux';
import { reduceCommandReducers, combineCommandReducers } from 'redux-commander'
import reducers from './reducers'

// we create a store with a dummy reducer that just
// returns the state no matter the action.
const store = createStore(state => state, initialState)
// Then we immediately replace the reducer using the
// reduceCommandReducers function, which takes in the store
// and an array of your reducers.
store.replaceReducer(reduceCommandReducers(store, reducers))
// If you are used to Redux's `combineReducers` you can use
// `combineCommandReducers` instead.
store.replaceReducer(combineCommandReducers(store, {
  users: userReducer,
  posts: postReducer
}))
```

That's all the setup you need! Now all of your reducers are magically *command
reducers* (this name stolen from Elm's [Cmd type][Cmd]). Your reducers will work
as normal, where you can just return your state.

```js
case 'increment':
  return {...state, count: state.count + 1}
```

Also now you can return an array of `[newState, ...Commands]` where a `Command`
is just an array where the first item is the function to call for the side
effect and the rest of the items are the arguments to pass.

```js
case 'requestPosts':
  return [
    // this is the new state
    {...state, loading: true}
    // this is the Command array.
    [Api.getPosts, state.userToken]
    //   |         |
    //   |         -> arguments
    //   |-> function to call
  ]
```

If this function returns an action or a Promise that resolves to an action, it
will be dispatched. You can also just pass `null` instead of a Command to
conditionally dispatch an action.

```
return [
  state,
  makeApiCall ? [Api.getThing, 1] : null // if makeApiCall is false, no command
                                         // will be triggered.
]
```


There is no complex api to learn, you just return an array
when you want a side effect.  It's easier to see with the example:

## Example

We're going to implement a pretty normal redux worklow, logging in a user.
Here is what our reducer will look like.

```js
// ./authReducer.js
import * as Api from './Api'

const KEYS = {
  LOGIN: 'LOGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE'
}

// action creators
export const login = ({username, password}) => ({
  username,
  password,
  type: KEYS.LOGIN
})

export const loginSuccess = user =>  ({
  user,
  type: KEYS.LOGIN_SUCCESS
})

export const loginFailure = error => ({
  error,
  type: KEYS.LOGIN_FAILURE
})

// reducer
export const reducer = (state, action) => {
  switch(action.type) {
    case KEYS.LOGIN:
      // here we want to set the `loading` flag on the state as well as send off
      // the request to login the user. We do this by returning an array where
      // the first item is the new state, and the second item is the command.
      return [
        {...state, loading: true},
        [Api.login, action.username, action.password]
      ]
    default:
      return state;
  }
}
```

This will call the `Api` function `login` with the arguments `username` and
`password`. Let's imagine it looks something like this:

```js
// Api.js
import { loginSuccess, loginFailure } from './authReducer'
import axios from 'axios'

// If you don't like importing your action creators in this Api module you could
// just as easily put a side effect function in your redux file that converts
// the api response promise into an action.
export const login = (username, password) =>
  axios
    .post('/api/login', { username, password })
    .then(res => loginSuccess(res.data.user))
    .catch(err => loginFailure(err.response.data))
```

This login function will return a promise that resolves to either a
`LOGIN_SUCCESS` or a `LOGIN_FAILURE` action. Then we can handle these back in
our reducer just as we would normally.

```js
export const reducer = (state, action) => {
  switch(action.type) {
    case KEYS.LOGIN:
      return [
        {...state, loading: true},
        [Api.login, action.username, action.password]
      ]
    case KEYS.LOGIN_SUCCESS:
      return {...state, loading: false, user: action.user}
    case KEYS.LOGIN_FAILURE:
      return {...state, loading: false, error: action.error}
    default:
      return state;
  }
}
```

Let's say we also want to set the user token and username we get back from the
api into `localStorage` after we successfully login so we can re-authenticate on
subsequent refreshes. You can add as many command functions as you want in your
reducer. Also they don't *have* to return an action. If they don't, nothing will
be dispatched.

```js
export const store = (key, value) => localStorage.setItem(key, value)

export const reducer = (state, action) => {
  switch(action.type) {
    /* ... */
    case KEYS.LOGIN_SUCCESS:
    return [
      {...state, loading: false, user: action.user},
      [store, 'token', action.user.token],
      [store, 'user', action.user.username]
    ]
    /* ... */
  }
}
```

The plus side to representing side effects in a declarative manner like this is
that it makes your reducers very easy to test. You just have to make sure that
given a certain action and a state, you will get the correct state and commands
back. They won't be actually called unless you run them through a store with the
`redux-commander` function in place so you won't have to worry about mocking out
`localStorage` or your api. It would look like this using [Jest][jest]

```js
import { reducer, loginSuccess, store } from './authReducer'

describe('Auth reducer', () => {
  test('will handle login success', () => {
    const user = {username: 'username', token: 'token'};
    const res = reducer(
      {loading: true},
      loginSuccess(user)
    );
    expect(res).toEqual([
      {loading: false, user},
      [store, 'token', user.token],
      [store, 'username', user.username]
    ])
  });
});
```

This also makes it easier to test and think about complex actions which will
cause a chain reaction and trigger commands that will fire off other actions.
The caveat is that you should make your command functions be very simple and
strictly limited to the I/O operations you need and leave the more complex
business logic to your reducer.

If any of it sounds confusing, I would just suggest looking at the source code
(it's a little less than half the length of this README, with comments).

[npm-badge]: https://img.shields.io/npm/v/redux-commander.png?style=flat-square
[npm]: https://www.npmjs.org/package/redux-commander
[elm]: https://guide.elm-lang.org/architecture/
[re-frame]: https://github.com/Day8/re-frame/blob/master/docs/EffectfulHandlers.md
[middleware]: https://redux.js.org/advanced/middleware
[replaceReducer]: https://redux.js.org/api-reference/store#replaceReducer
[Cmd]: https://www.elm-tutorial.org/en/03-subs-cmds/02-commands.html
[Jest]: https://facebook.github.io/jest/
