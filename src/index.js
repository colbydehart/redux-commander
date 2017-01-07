import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { fetchRecipes, fetchXMore } from './api'
import './index.css'
import 'milligram'

// types
const FETCH = 'fetch'
const SUCCESS = 'success'
const DONE = 'done'

// action creators
export const fetch = () => ({ type: FETCH })
export const success = recipes => ({ type: SUCCESS, recipes })
export const done = recipes => ({ type: DONE, recipes })

// reducer
const reducer = (state = {}, action) => {
  switch (action.type) {
    // returns modified state and a command
    case FETCH:
      return [
        {...state, fetching: true},
        fetchRecipes
      ]
    // returns modified state and a command with arguments
    case SUCCESS:
      return [
        {...state, recipes: action.recipes},
        [ fetchXMore, action.recipes.length ]
      ]
    // just returning the modified state
    case DONE:
      return {
        ...state,
        recipes: [ ...state.recipes, ...action.recipes ],
        fetching: false
      }
    default:
        return state
  }
}

// the command enhancer. An enhancer function takes in the
// createStore function and returns a new createStore function
const cmdEnhancer = createStore => (reducer, preloaded, enhancer) => {
  // just create the store with the default arguments
  const store = createStore(reducer, preloaded, enhancer)
  // here we replace the reducer using the store's built-in
  // method replaceReducer
  store.replaceReducer((state, action) => {
    // we assign `next` to be whatever the reducer regularly
    // returns with the state and the action, at this point
    // it could be the state, an array of the state and a command
    // or an array of the state and an array of the command and its
    // arguments
    const next = reducer(state, action)
    // if it is not an array, it's just the state; return it
    if (!Array.isArray(next)) return next
    // now we destructure the array to get the actual new
    // state and the command to be run.
    const [ newState, command ] = next
    // If it is just a function, run it and dispatch its result.
    // We also pass it into Promise.resolve so that we can use
    // sync or async functions as commands, it doesn't matter
    if (typeof command === 'function') {
      Promise.resolve(command()).then(a => store.dispatch(a))
    // if the command is an array, it will be an array of the
    // function to be run and the arguments to be passed in.
    // We just destructure, run, and dispatch, just like above
    } else if (Array.isArray(command)) {
      const [ cmd, ...args ] = command
      Promise.resolve(cmd(...args)).then(a => store.dispatch(a))
    }
    // Then we return the new state we got from destructuring
    // next before
    return newState
    // end of the replaceReducer function
  })
  // then we just return the store with the hijacked reducer
  return store
}

// store
const store = createStore(reducer, {}, cmdEnhancer)

// render
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
