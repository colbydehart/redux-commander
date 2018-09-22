"use strict";

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


  new Promise(function () {
    commands.forEach(function (_ref) {
      var _ref2 = _toArray(_ref),
          cmd = _ref2[0],
          args = _ref2.slice(1);

      if (typeof cmd === "function") {
        Promise.resolve(cmd.apply(undefined, _toConsumableArray(args))).then(function (a) {
          return a && a.type && store.dispatch(a);
        });
      }
    });
    // Finally return the new state.
    return newState;
  });
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
      var key = reducerKeys[i];
      var reducer = reducers[key];
      var prev = state[key];
      var next = resolveCmdReducer(reducer, prev, action, store);
      nextState[key] = next;
    }
    return nextState;
  };
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZXNvbHZlQ21kUmVkdWNlciIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInN0b3JlIiwibmV4dCIsIkFycmF5IiwiaXNBcnJheSIsIm5ld1N0YXRlIiwiY29tbWFuZHMiLCJQcm9taXNlIiwiZm9yRWFjaCIsImNtZCIsImFyZ3MiLCJyZXNvbHZlIiwidGhlbiIsImEiLCJ0eXBlIiwiZGlzcGF0Y2giLCJyZWR1Y2VDb21tYW5kUmVkdWNlcnMiLCJyZWR1Y2VycyIsInJlZHVjZSIsImNvbWJpbmVDb21tYW5kUmVkdWNlcnMiLCJyZWR1Y2VyS2V5cyIsIk9iamVjdCIsImtleXMiLCJuZXh0U3RhdGUiLCJpIiwibGVuZ3RoIiwia2V5IiwicHJldiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFNQSxJQUFNQSxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUFDQyxPQUFELEVBQVVDLEtBQVYsRUFBaUJDLE1BQWpCLEVBQXlCQyxLQUF6QixFQUFtQztBQUMzRCxNQUFNQyxPQUFPSixRQUFRQyxLQUFSLEVBQWVDLE1BQWYsQ0FBYjtBQUNBO0FBQ0EsTUFBSSxDQUFDRyxNQUFNQyxPQUFOLENBQWNGLElBQWQsQ0FBTCxFQUEwQjtBQUN4QixXQUFPQSxJQUFQO0FBQ0Q7QUFDRDs7QUFOMkQsdUJBTzNCQSxJQVAyQjtBQUFBLE1BT3BERyxRQVBvRDtBQUFBLE1BT3ZDQyxRQVB1QztBQVEzRDtBQUNBO0FBQ0E7OztBQUNBLE1BQUlDLE9BQUosQ0FBWSxZQUFNO0FBQ2hCRCxhQUFTRSxPQUFULENBQWlCLGdCQUFvQjtBQUFBO0FBQUEsVUFBbEJDLEdBQWtCO0FBQUEsVUFBVkMsSUFBVTs7QUFDbkMsVUFBSSxPQUFPRCxHQUFQLEtBQWUsVUFBbkIsRUFBK0I7QUFDN0JGLGdCQUFRSSxPQUFSLENBQWdCRix3Q0FBT0MsSUFBUCxFQUFoQixFQUE4QkUsSUFBOUIsQ0FDRTtBQUFBLGlCQUFLQyxLQUFLQSxFQUFFQyxJQUFQLElBQWViLE1BQU1jLFFBQU4sQ0FBZUYsQ0FBZixDQUFwQjtBQUFBLFNBREY7QUFHRDtBQUNGLEtBTkQ7QUFPQTtBQUNBLFdBQU9SLFFBQVA7QUFDRCxHQVZEO0FBV0QsQ0F0QkQ7O0FBd0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Qk8sSUFBTVcsd0RBQXdCLFNBQXhCQSxxQkFBd0IsQ0FBQ2YsS0FBRCxFQUFRZ0IsUUFBUixFQUFxQjtBQUN4RCxTQUFPLFVBQUNsQixLQUFELEVBQVFDLE1BQVI7QUFBQSxXQUNMaUIsU0FBU0MsTUFBVCxDQUNFLFVBQUNoQixJQUFELEVBQU9KLE9BQVA7QUFBQSxhQUFtQkQsa0JBQWtCQyxPQUFsQixFQUEyQkksSUFBM0IsRUFBaUNGLE1BQWpDLEVBQXlDQyxLQUF6QyxDQUFuQjtBQUFBLEtBREYsRUFFRUYsS0FGRixDQURLO0FBQUEsR0FBUDtBQUtELENBTk07O0FBUVA7Ozs7OztBQU1PLElBQU1vQiwwREFBeUIsU0FBekJBLHNCQUF5QixDQUFDbEIsS0FBRCxFQUFRZ0IsUUFBUixFQUFxQjtBQUN6RCxTQUFPLFVBQUNsQixLQUFELEVBQVFDLE1BQVIsRUFBbUI7QUFDeEIsUUFBTW9CLGNBQWNDLE9BQU9DLElBQVAsQ0FBWUwsUUFBWixDQUFwQjtBQUNBLFFBQU1NLFlBQVksRUFBbEI7O0FBRUEsU0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLFlBQVlLLE1BQWhDLEVBQXdDRCxHQUF4QyxFQUE2QztBQUMzQyxVQUFNRSxNQUFNTixZQUFZSSxDQUFaLENBQVo7QUFDQSxVQUFNMUIsVUFBVW1CLFNBQVNTLEdBQVQsQ0FBaEI7QUFDQSxVQUFNQyxPQUFPNUIsTUFBTTJCLEdBQU4sQ0FBYjtBQUNBLFVBQU14QixPQUFPTCxrQkFBa0JDLE9BQWxCLEVBQTJCNkIsSUFBM0IsRUFBaUMzQixNQUFqQyxFQUF5Q0MsS0FBekMsQ0FBYjtBQUNBc0IsZ0JBQVVHLEdBQVYsSUFBaUJ4QixJQUFqQjtBQUNEO0FBQ0QsV0FBT3FCLFNBQVA7QUFDRCxHQVpEO0FBYUQsQ0FkTSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIHRha2UgaW4gYSByZWR1Y2VyLCBzdGF0ZSwgYWN0aW9uLCBhbmRcbiAqIHN0b3JlIGFuZCBkaXNwYXRjaCBhbnkgYXN5bmMgY29tbWFuZHMgKGlmIGFueSkgYW5kIHJldHVyblxuICogdGhlIG5leHQgc3RhdGUuIFVzZWQgYXMgYSBoZWxwZXIgZnVuY3Rpb24gaW4gdGhlIHB1YmxpY1xuICogbWV0aG9kcyByZWR1Y2VDb21tYW5kUmVkdWNlcnMgYW5kIGNvbWJpbmVDb21tYW5kUmVkdWNlcnMuXG4gKi9cbmNvbnN0IHJlc29sdmVDbWRSZWR1Y2VyID0gKHJlZHVjZXIsIHN0YXRlLCBhY3Rpb24sIHN0b3JlKSA9PiB7XG4gIGNvbnN0IG5leHQgPSByZWR1Y2VyKHN0YXRlLCBhY3Rpb24pO1xuICAvLyBJZiB3ZSBqdXN0IGdldCBiYWNrIHRoZSBzdGF0ZSwgcmV0dXJuIGl0LiBObyBjb21tYW5kcyB0byBleGVjdXRlLlxuICBpZiAoIUFycmF5LmlzQXJyYXkobmV4dCkpIHtcbiAgICByZXR1cm4gbmV4dDtcbiAgfVxuICAvLyBPdGhlcndpc2UgZ2V0IHRoZSBuZXdTdGF0ZSBhbmQgdGhlIGFycmF5IG9mIGNvbW1hbmRzIHRvIGV4ZWN1dGUuXG4gIGNvbnN0IFtuZXdTdGF0ZSwgLi4uY29tbWFuZHNdID0gbmV4dDtcbiAgLy8gZm9yIGVhY2ggY29tbWFuZCwgaWYgaXQgaXMgYSBmdW5jdGlvbiwgY2FsbCB0aGUgZnVuY3Rpb24gd2l0aCB0aGUgYXJndW1lbnRzXG4gIC8vIGFuZCB0aGVuIGlmIGl0IGlzIGFuIGFjdGlvbiAobWVhbmluZyBpdCBoYXMgYSBgLnR5cGVgIGtleSBvbiBpdCksIGRpc3BhdGNoXG4gIC8vIGl0IGFmdGVyIHRoZSBwcm9taXNlIHJlc29sdmVzLlxuICBuZXcgUHJvbWlzZSgoKSA9PiB7XG4gICAgY29tbWFuZHMuZm9yRWFjaCgoW2NtZCwgLi4uYXJnc10pID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY21kID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKGNtZCguLi5hcmdzKSkudGhlbihcbiAgICAgICAgICBhID0+IGEgJiYgYS50eXBlICYmIHN0b3JlLmRpc3BhdGNoKGEpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgLy8gRmluYWxseSByZXR1cm4gdGhlIG5ldyBzdGF0ZS5cbiAgICByZXR1cm4gbmV3U3RhdGU7XG4gIH0pO1xufTtcblxuLyoqIFRoaXMgaXMgdGhlIGNvbW1hbmQgcmVkdWNlcnMgcmVkdWNlciwgd2hpY2ggbGV0IHVzIGhhbmRsZVxuICogYXN5bmMgc2lkZSBlZmZlY3RzIGluIFJlZHV4LiBJbiB5b3VyIHJlZHVjZXJzLCBpbnN0ZWFkXG4gKiBvZiBqdXN0IHJldHVybmluZyB5b3VyIFN0YXRlLCB5b3UgY2FuIHJldHVybiBhbiBhcnJheVxuICogb2YgW1N0YXRlLCAuLi5Db21tYW5kc10gd2hlcmUgQ29tbWFuZHMgaXMgYXMgbWFueSBDb21tYW5kXG4gKiBhcnJheXMgYXMgeW91IHdhbnQuIEEgQ29tbWFuZCBhcnJheSBjb25zaXN0cyBvZlxuICogW0NvbW1hbmRGbiwgLi4uYXJnc10sIHdoZXJlIENvbW1hbmRGbiBpcyBhIGZ1bmN0aW9uXG4gKiB3aGljaCB3aWxsIHJldHVybiBhIHByb21pc2Ugd2hpY2ggd2lsbCBwb3NzaWJseSByZXNvbHZlXG4gKiB0byBhIHJlZHV4IGFjdGlvbiwgYW5kIHRoZSBhcmdzIGFyZSB0aGUgYXJndW1lbnRzIHlvdSBuZWVkXG4gKiB0byBwYXNzIHRvIHRoZSBmdW5jdGlvbi5cbiAqXG4gKiBmb3IgZXhhbXBsZSBhbiBleGFtcGxlIHJlZHVjZXIgbWlnaHQgbG9vayBzb21ldGhpbmcgbGlrZSB0aGlzOlxuICpcbiAqIGNvbnN0IHJlZHVjZXIgPSAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICogICBzd2l0Y2ggKGFjdGlvbikge1xuICogICAgIGNhc2UgJ3N0YW5kYXJkQWN0aW9uJzpcbiAqICAgICAgIHJldHVybiB7Li4uc3RhdGUsIGNvdW50OiBzdGF0ZS5jb3VudCArIDF9XG4gKiAgICAgY2FzZSAnYXN5bmNBY3Rpb24nOlxuICogICAgICAgcmV0dXJuIFtcbiAqICAgICAgICAgc3RhdGUsXG4gKiAgICAgICAgIFtBcGkuZG9Tb21ldGhpbmdBc3luYywgYXN5bmNBcmddXG4gKiAgICAgICBdXG4gKiAgICAgY2FzZSAnYXN5bmNBY3Rpb25SZXN1bHQnOlxuICogICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgZGF0YTogYWN0aW9uLmRhdGF9XG4gKiAgICB9XG4gKiB9XG4gKlxuICogd2hlcmUgdGhlICdhc3luY0FjdGlvbicgd2lsbCByZXR1cm4gYW4gYXJyYXkgY29udGFpbmcgdGhlIHN0YXRlXG4gKiBhbmQgdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbnMgdG8gYmUgY2FsbGVkIGFuZCB0aGVuIGRpc3BhdGNoZWRcbiAqIGlmIHRoZXkgcmVzb2x2ZSB0byBhbiBhY3Rpb24uXG4gKi9cbmV4cG9ydCBjb25zdCByZWR1Y2VDb21tYW5kUmVkdWNlcnMgPSAoc3RvcmUsIHJlZHVjZXJzKSA9PiB7XG4gIHJldHVybiAoc3RhdGUsIGFjdGlvbikgPT5cbiAgICByZWR1Y2Vycy5yZWR1Y2UoXG4gICAgICAobmV4dCwgcmVkdWNlcikgPT4gcmVzb2x2ZUNtZFJlZHVjZXIocmVkdWNlciwgbmV4dCwgYWN0aW9uLCBzdG9yZSksXG4gICAgICBzdGF0ZVxuICAgICk7XG59O1xuXG4vKiogVGhpcyBpcyB0aGUgY29tbWFuZCByZWR1Y2VycyBjb21iaW5lci4gSXQgd29ya3NcbiAqIHRoZSBzYW1lIHdheSBhcyB0aGUgcmVkdWNlQ29tbWFuZFJlZHVjZXJzIGZ1bmN0aW9uLFxuICogYnV0IGl0IHdpbGwgdXNlIHRoZSBjb21iaW5lUmVkdWNlcnMgYmVoYXZpb3JcbiAqIHdoZXJlIGVhY2gga2V5IGluIGFuIG9iamVjdCBpcyBhIHJlZHVjZXIgaW5zdGVhZFxuICogb2YgcmVkdWNpbmcgYW4gYXJyYXkgb2YgcmVkdWNlcnNcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbWJpbmVDb21tYW5kUmVkdWNlcnMgPSAoc3RvcmUsIHJlZHVjZXJzKSA9PiB7XG4gIHJldHVybiAoc3RhdGUsIGFjdGlvbikgPT4ge1xuICAgIGNvbnN0IHJlZHVjZXJLZXlzID0gT2JqZWN0LmtleXMocmVkdWNlcnMpO1xuICAgIGNvbnN0IG5leHRTdGF0ZSA9IHt9O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZWR1Y2VyS2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qga2V5ID0gcmVkdWNlcktleXNbaV07XG4gICAgICBjb25zdCByZWR1Y2VyID0gcmVkdWNlcnNba2V5XTtcbiAgICAgIGNvbnN0IHByZXYgPSBzdGF0ZVtrZXldO1xuICAgICAgY29uc3QgbmV4dCA9IHJlc29sdmVDbWRSZWR1Y2VyKHJlZHVjZXIsIHByZXYsIGFjdGlvbiwgc3RvcmUpO1xuICAgICAgbmV4dFN0YXRlW2tleV0gPSBuZXh0O1xuICAgIH1cbiAgICByZXR1cm4gbmV4dFN0YXRlO1xuICB9O1xufTtcbiJdfQ==