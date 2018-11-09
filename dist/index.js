"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This function will take in a reducer, state, action, and
 * store and dispatch any async commands (if any) and return
 * the next state. Used as a helper function in the public
 * methods reduceCommandReducers and combineCommandReducers.
 */
function resolveCmdReducer(reducer, state, action, store) {
    var next = reducer(state, action);
    // If we just get back the state, return it. No commands to execute.
    if (!Array.isArray(next)) {
        return next;
    }
    // Otherwise get the newState and the array of commands to execute.
    var newState = next[0], commands = next.slice(1);
    // for each command, if it is a function, call the function with the arguments
    // and then if it is an action (meaning it has a `.type` key on it), dispatch
    // it after the promise resolves.
    new Promise(function () {
        commands.forEach(function (arr) {
            if (!arr) {
                return;
            }
            var cmd = arr[0], args = arr.slice(1);
            if (typeof cmd === "function") {
                var promiseOrAction = cmd.apply(void 0, args);
                !!promiseOrAction &&
                    Promise.resolve(promiseOrAction).then(function (a) { return !!a && a.type && store.dispatch(a); });
            }
        });
    });
    // Finally return the new state.
    return newState;
}
/** This is the command reducers reducer, which let us handle
 * async side effects in Redux. In your reducers, instead
 * of just returning your State, you can return an array
 * of [State, ...Commands] where Commands is as many Command
 * arrays as you want. A Command array consists of
 * [CommandFn, ...args], where CommandFn is a function
 * which will return a promise which will possibly resolve
 * to a redux action, and the args are the arguments you need
 * to pass to the function.
 *
 * for example an example reducer might look something like this:
 *
 * const reducer = (state, action) => {
 *   switch (action) {
 *     case 'standardAction':
 *       return {...state, count: state.count + 1}
 *     case 'asyncAction':
 *       return [
 *         state,
 *         [Api.doSomethingAsync, asyncArg]
 *       ]
 *     case 'asyncActionResult':
 *       return {...state, data: action.data}
 *    }
 * }
 *
 * where the 'asyncAction' will return an array containg the state
 * and the asynchronous functions to be called and then dispatched
 * if they resolve to an action.
 */
function reduceCommandReducers(store, reducers) {
    var first = reducers[0], rest = reducers.slice(1);
    return function (state, action) {
        var init = resolveCmdReducer(first, state, action, store);
        return rest.reduce(function (next, reducer) { return resolveCmdReducer(reducer, next, action, store); }, init);
    };
}
exports.reduceCommandReducers = reduceCommandReducers;
/** This is the command reducers combiner. It works
 * the same way as the reduceCommandReducers function,
 * but it will use the combineReducers behavior
 * where each key in an object is a reducer instead
 * of reducing an array of reducers
 */
function combineCommandReducers(store, reducers) {
    return function (state, action) {
        var reducerKeys = Object.keys(reducers);
        var nextState = {};
        for (var i = 0; i < reducerKeys.length; i++) {
            var key = reducerKeys[i];
            var reducer = reducers[key];
            var prev = state && state[key];
            var next = resolveCmdReducer(reducer, prev, action, store);
            nextState[key] = next;
        }
        return nextState;
    };
}
exports.combineCommandReducers = combineCommandReducers;
