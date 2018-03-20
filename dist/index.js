'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

/**
 * This function will take in a reducer, state, action, and
 * store and dispatch any async commands (if any) and return
 * the next state. Used as a helper function in the public
 * methods reduceCommandReducers and combineCommandReducers.
 */
var resolveCmdReducer = function resolveCmdReducer(reducer, state, action, store) {
  var next = reducer(state, action);
  // If we just get back the state, return it. No commands to execute.
  if (!Array.isArray(next)) {
    return next;
  }
  // Otherwise get the newState and the array of commands to execute.

  var _next = _toArray(next),
      newState = _next[0],
      commands = _next.slice(1);
  // for each command, if it is a function, call the function with the arguments
  // and then if it is an action (meaning it has a `.type` key on it), dispatch
  // it after the promise resolves.


  commands.forEach(function (_ref) {
    var _ref2 = _toArray(_ref),
        cmd = _ref2[0],
        args = _ref2.slice(1);

    if (typeof cmd === 'function') {
      Promise.resolve(cmd.apply(undefined, _toConsumableArray(args))).then(function (a) {
        return a && a.type && store.dispatch(a);
      });
    }
  });
  // Finally return the new state.
  return newState;
};

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


var reduceCommandReducers = exports.reduceCommandReducers = function reduceCommandReducers(store, reducers) {
  return function (state, action) {
    return reducers.reduce(function (next, reducer) {
      return resolveCmdReducer(reducer, next, action, store);
    }, state);
  };
};

/** This is the command reducers combiner. It works
 * the same way as the reduceCommandReducers function,
 * but it will use the combineReducers behavior
 * where each key in an object is a reducer instead
 * of reducing an array of reducers
 */
var combineCommandReducers = exports.combineCommandReducers = function combineCommandReducers(store, reducers) {
  return function (state, action) {
    var reducerKeys = Object.keys(reducers);
    var nextState = {};

    for (var i = 0; i < reducerKeys.length; i++) {
      var _key = reducerKeys[i];
      var reducer = reducers[_key];
      var prev = state[_key];
      var next = resolveCmdReducer(reducer, prev, action, store);
      nextState[_key] = next;
    }
    return nextState;
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZXNvbHZlQ21kUmVkdWNlciIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInN0b3JlIiwibmV4dCIsIkFycmF5IiwiaXNBcnJheSIsIm5ld1N0YXRlIiwiY29tbWFuZHMiLCJmb3JFYWNoIiwiY21kIiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsImEiLCJ0eXBlIiwiZGlzcGF0Y2giLCJyZWR1Y2VDb21tYW5kUmVkdWNlcnMiLCJyZWR1Y2VycyIsInJlZHVjZSIsImNvbWJpbmVDb21tYW5kUmVkdWNlcnMiLCJyZWR1Y2VyS2V5cyIsIk9iamVjdCIsImtleXMiLCJuZXh0U3RhdGUiLCJpIiwibGVuZ3RoIiwia2V5IiwicHJldiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBOzs7Ozs7QUFNQSxJQUFNQSxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUN4QkMsT0FEd0IsRUFFeEJDLEtBRndCLEVBR3hCQyxNQUh3QixFQUl4QkMsS0FKd0IsRUFLckI7QUFDSCxNQUFNQyxPQUFPSixRQUFRQyxLQUFSLEVBQWVDLE1BQWYsQ0FBYjtBQUNBO0FBQ0EsTUFBSSxDQUFDRyxNQUFNQyxPQUFOLENBQWNGLElBQWQsQ0FBTCxFQUEwQjtBQUN4QixXQUFPQSxJQUFQO0FBQ0Q7QUFDRDs7QUFORyx1QkFPNkJBLElBUDdCO0FBQUEsTUFPSUcsUUFQSjtBQUFBLE1BT2lCQyxRQVBqQjtBQVFIO0FBQ0E7QUFDQTs7O0FBQ0FBLFdBQVNDLE9BQVQsQ0FBaUIsZ0JBQW9CO0FBQUE7QUFBQSxRQUFsQkMsR0FBa0I7QUFBQSxRQUFWQyxJQUFVOztBQUNuQyxRQUFJLE9BQU9ELEdBQVAsS0FBZSxVQUFuQixFQUErQjtBQUM3QkUsY0FBUUMsT0FBUixDQUFnQkgsd0NBQU9DLElBQVAsRUFBaEIsRUFBOEJHLElBQTlCLENBQW1DO0FBQUEsZUFBS0MsS0FBS0EsRUFBRUMsSUFBUCxJQUFlYixNQUFNYyxRQUFOLENBQWVGLENBQWYsQ0FBcEI7QUFBQSxPQUFuQztBQUNEO0FBQ0YsR0FKRDtBQUtBO0FBQ0EsU0FBT1IsUUFBUDtBQUNELENBdkJEOztBQXlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Qk8sSUFBTVcsd0RBQXdCLFNBQXhCQSxxQkFBd0IsQ0FDbkNmLEtBRG1DLEVBRW5DZ0IsUUFGbUMsRUFHaEM7QUFDSCxTQUFPLFVBQUNsQixLQUFELEVBQWFDLE1BQWI7QUFBQSxXQUNMaUIsU0FBU0MsTUFBVCxDQUNFLFVBQUNoQixJQUFELEVBQU9KLE9BQVA7QUFBQSxhQUFtQkQsa0JBQWtCQyxPQUFsQixFQUEyQkksSUFBM0IsRUFBaUNGLE1BQWpDLEVBQXlDQyxLQUF6QyxDQUFuQjtBQUFBLEtBREYsRUFFRUYsS0FGRixDQURLO0FBQUEsR0FBUDtBQUtELENBVE07O0FBV1A7Ozs7OztBQU1PLElBQU1vQiwwREFBeUIsU0FBekJBLHNCQUF5QixDQUNwQ2xCLEtBRG9DLEVBRXBDZ0IsUUFGb0MsRUFHakM7QUFDSCxTQUFPLFVBQUNsQixLQUFELEVBQWFDLE1BQWIsRUFBNkI7QUFDbEMsUUFBTW9CLGNBQWNDLE9BQU9DLElBQVAsQ0FBWUwsUUFBWixDQUFwQjtBQUNBLFFBQU1NLFlBQVksRUFBbEI7O0FBRUEsU0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLFlBQVlLLE1BQWhDLEVBQXdDRCxHQUF4QyxFQUE2QztBQUMzQyxVQUFNRSxPQUFNTixZQUFZSSxDQUFaLENBQVo7QUFDQSxVQUFNMUIsVUFBVW1CLFNBQVNTLElBQVQsQ0FBaEI7QUFDQSxVQUFNQyxPQUFPNUIsTUFBTTJCLElBQU4sQ0FBYjtBQUNBLFVBQU14QixPQUFPTCxrQkFBa0JDLE9BQWxCLEVBQTJCNkIsSUFBM0IsRUFBaUMzQixNQUFqQyxFQUF5Q0MsS0FBekMsQ0FBYjtBQUNBc0IsZ0JBQVVHLElBQVYsSUFBaUJ4QixJQUFqQjtBQUNEO0FBQ0QsV0FBT3FCLFNBQVA7QUFDRCxHQVpEO0FBYUQsQ0FqQk0iLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAZmxvd1xuXG5pbXBvcnQgdHlwZSB7IFN0b3JlLCBSZWR1Y2VyIH0gZnJvbSAncmVkdXgnO1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gd2lsbCB0YWtlIGluIGEgcmVkdWNlciwgc3RhdGUsIGFjdGlvbiwgYW5kXG4gKiBzdG9yZSBhbmQgZGlzcGF0Y2ggYW55IGFzeW5jIGNvbW1hbmRzIChpZiBhbnkpIGFuZCByZXR1cm5cbiAqIHRoZSBuZXh0IHN0YXRlLiBVc2VkIGFzIGEgaGVscGVyIGZ1bmN0aW9uIGluIHRoZSBwdWJsaWNcbiAqIG1ldGhvZHMgcmVkdWNlQ29tbWFuZFJlZHVjZXJzIGFuZCBjb21iaW5lQ29tbWFuZFJlZHVjZXJzLlxuICovXG5jb25zdCByZXNvbHZlQ21kUmVkdWNlciA9IChcbiAgcmVkdWNlcjogUmVkdWNlcjwqLCAqPixcbiAgc3RhdGU6IGFueSxcbiAgYWN0aW9uOiBhbnksXG4gIHN0b3JlOiBTdG9yZTwqLCAqPlxuKSA9PiB7XG4gIGNvbnN0IG5leHQgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pO1xuICAvLyBJZiB3ZSBqdXN0IGdldCBiYWNrIHRoZSBzdGF0ZSwgcmV0dXJuIGl0LiBObyBjb21tYW5kcyB0byBleGVjdXRlLlxuICBpZiAoIUFycmF5LmlzQXJyYXkobmV4dCkpIHtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuICAvLyBPdGhlcndpc2UgZ2V0IHRoZSBuZXdTdGF0ZSBhbmQgdGhlIGFycmF5IG9mIGNvbW1hbmRzIHRvIGV4ZWN1dGUuXG4gIGNvbnN0IFtuZXdTdGF0ZSwgLi4uY29tbWFuZHNdID0gbmV4dDtcbiAgLy8gZm9yIGVhY2ggY29tbWFuZCwgaWYgaXQgaXMgYSBmdW5jdGlvbiwgY2FsbCB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgYXJndW1lbnRzXG4gIC8vIGFuZCB0aGVuIGlmIGl0IGlzIGFuIGFjdGlvbiAobWVhbmluZyBpdCBoYXMgYSBgLnR5cGVgIGtleSBvbiBpdCksIGRpc3BhdGNoXG4gIC8vIGl0IGFmdGVyIHRoZSBwcm9taXNlIHJlc29sdmVzLlxuICBjb21tYW5kcy5mb3JFYWNoKChbY21kLCAuLi5hcmdzXSkgPT4ge1xuICAgIGlmICh0eXBlb2YgY21kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoY21kKC4uLmFyZ3MpKS50aGVuKGEgPT4gYSAmJiBhLnR5cGUgJiYgc3RvcmUuZGlzcGF0Y2goYSkpO1xuICAgIH1cbiAgfSk7XG4gIC8vIEZpbmFsbHkgcmV0dXJuIHRoZSBuZXcgc3RhdGUuXG4gIHJldHVybiBuZXdTdGF0ZTtcbn07XG5cbi8qKiBUaGlzIGlzIHRoZSBjb21tYW5kIHJlZHVjZXJzIHJlZHVjZXIsIHdoaWNoIGxldCB1cyBoYW5kbGVcbiAqIGFzeW5jIHNpZGUgZWZmZWN0cyBpbiBSZWR1eC4gSW4geW91ciByZWR1Y2VycywgaW5zdGVhZFxuICogb2YganVzdCByZXR1cm5pbmcgeW91ciBTdGF0ZSwgeW91IGNhbiByZXR1cm4gYW4gYXJyYXlcbiAqIG9mIFtTdGF0ZSwgLi4uQ29tbWFuZHNdIHdoZXJlIENvbW1hbmRzIGlzIGFzIG1hbnkgQ29tbWFuZFxuICogYXJyYXlzIGFzIHlvdSB3YW50LiBBIENvbW1hbmQgYXJyYXkgY29uc2lzdHMgb2ZcbiAqIFtDb21tYW5kRm4sIC4uLmFyZ3NdLCB3aGVyZSBDb21tYW5kRm4gaXMgYSBmdW5jdGlvblxuICogd2hpY2ggd2lsbCByZXR1cm4gYSBwcm9taXNlIHdoaWNoIHdpbGwgcG9zc2libHkgcmVzb2x2ZVxuICogdG8gYSByZWR1eCBhY3Rpb24sIGFuZCB0aGUgYXJncyBhcmUgdGhlIGFyZ3VtZW50cyB5b3UgbmVlZFxuICogdG8gcGFzcyB0byB0aGUgZnVuY3Rpb24uXG4gKlxuICogZm9yIGV4YW1wbGUgYW4gZXhhbXBsZSByZWR1Y2VyIG1pZ2h0IGxvb2sgc29tZXRoaW5nIGxpa2UgdGhpczpcbiAqXG4gKiBjb25zdCByZWR1Y2VyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcbiAqICAgc3dpdGNoIChhY3Rpb24pIHtcbiAqICAgICBjYXNlICdzdGFuZGFyZEFjdGlvbic6XG4gKiAgICAgICByZXR1cm4gey4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxfVxuICogICAgIGNhc2UgJ2FzeW5jQWN0aW9uJzpcbiAqICAgICAgIHJldHVybiBbXG4gKiAgICAgICAgIHN0YXRlLFxuICogICAgICAgICBbQXBpLmRvU29tZXRoaW5nQXN5bmMsIGFzeW5jQXJnXVxuICogICAgICAgXVxuICogICAgIGNhc2UgJ2FzeW5jQWN0aW9uUmVzdWx0JzpcbiAqICAgICAgIHJldHVybiB7Li4uc3RhdGUsIGRhdGE6IGFjdGlvbi5kYXRhfVxuICogICAgfVxuICogfVxuICpcbiAqIHdoZXJlIHRoZSAnYXN5bmNBY3Rpb24nIHdpbGwgcmV0dXJuIGFuIGFycmF5IGNvbnRhaW5nIHRoZSBzdGF0ZVxuICogYW5kIHRoZSBhc3luY2hyb25vdXMgZnVuY3Rpb25zIHRvIGJlIGNhbGxlZCBhbmQgdGhlbiBkaXNwYXRjaGVkXG4gKiBpZiB0aGV5IHJlc29sdmUgdG8gYW4gYWN0aW9uLlxuICovXG5leHBvcnQgY29uc3QgcmVkdWNlQ29tbWFuZFJlZHVjZXJzID0gKFxuICBzdG9yZTogU3RvcmU8KiwgKj4sXG4gIHJlZHVjZXJzOiBSZWR1Y2VyPCosICo+W11cbikgPT4ge1xuICByZXR1cm4gKHN0YXRlOiBhbnksIGFjdGlvbjogYW55KSA9PlxuICAgIHJlZHVjZXJzLnJlZHVjZShcbiAgICAgIChuZXh0LCByZWR1Y2VyKSA9PiByZXNvbHZlQ21kUmVkdWNlcihyZWR1Y2VyLCBuZXh0LCBhY3Rpb24sIHN0b3JlKSxcbiAgICAgIHN0YXRlXG4gICAgKTtcbn07XG5cbi8qKiBUaGlzIGlzIHRoZSBjb21tYW5kIHJlZHVjZXJzIGNvbWJpbmVyLiBJdCB3b3Jrc1xuICogdGhlIHNhbWUgd2F5IGFzIHRoZSByZWR1Y2VDb21tYW5kUmVkdWNlcnMgZnVuY3Rpb24sXG4gKiBidXQgaXQgd2lsbCB1c2UgdGhlIGNvbWJpbmVSZWR1Y2VycyBiZWhhdmlvclxuICogd2hlcmUgZWFjaCBrZXkgaW4gYW4gb2JqZWN0IGlzIGEgcmVkdWNlciBpbnN0ZWFkXG4gKiBvZiByZWR1Y2luZyBhbiBhcnJheSBvZiByZWR1Y2Vyc1xuICovXG5leHBvcnQgY29uc3QgY29tYmluZUNvbW1hbmRSZWR1Y2VycyA9IChcbiAgc3RvcmU6IFN0b3JlPCosICo+LFxuICByZWR1Y2VyczogeyBba2V5OiBzdHJpbmddOiBSZWR1Y2VyPCosICo+IH1cbikgPT4ge1xuICByZXR1cm4gKHN0YXRlOiBhbnksIGFjdGlvbjogYW55KSA9PiB7XG4gICAgY29uc3QgcmVkdWNlcktleXMgPSBPYmplY3Qua2V5cyhyZWR1Y2Vycyk7XG4gICAgY29uc3QgbmV4dFN0YXRlID0ge307XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlZHVjZXJLZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBrZXkgPSByZWR1Y2VyS2V5c1tpXTtcbiAgICAgIGNvbnN0IHJlZHVjZXIgPSByZWR1Y2Vyc1trZXldO1xuICAgICAgY29uc3QgcHJldiA9IHN0YXRlW2tleV07XG4gICAgICBjb25zdCBuZXh0ID0gcmVzb2x2ZUNtZFJlZHVjZXIocmVkdWNlciwgcHJldiwgYWN0aW9uLCBzdG9yZSk7XG4gICAgICBuZXh0U3RhdGVba2V5XSA9IG5leHQ7XG4gICAgfVxuICAgIHJldHVybiBuZXh0U3RhdGU7XG4gIH07XG59O1xuIl19