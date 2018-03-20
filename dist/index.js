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
  if (!Array.isArray(next)) {
    return next;
  }

  var _next = _toArray(next),
      newState = _next[0],
      commands = _next.slice(1);

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
  return newState;
};

/** This is the command reducers reducer, which let us handle
 * async side effects in Redux. In your reducers, instead
 * of just returning your State, you can return an array
 * of [State, ...Commands] where Commands is as many Command
 * arrays as you want. A command array consists of
 * [CommandFn, ...args], where CommandFn is a function
 * which will return a promise which will resolve to a
 * redux action, and the args are the arguments you need
 * to pass to the function.
 *
 * for example an example reducer might look something like this:
 *
 * const reducer = (state, action) => {
 *   switch (action) {
 *     case 'standardAction':
 *       return {...state, count: state.count+1}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZXNvbHZlQ21kUmVkdWNlciIsInJlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsInN0b3JlIiwibmV4dCIsIkFycmF5IiwiaXNBcnJheSIsIm5ld1N0YXRlIiwiY29tbWFuZHMiLCJmb3JFYWNoIiwiY21kIiwiYXJncyIsIlByb21pc2UiLCJyZXNvbHZlIiwidGhlbiIsImEiLCJ0eXBlIiwiZGlzcGF0Y2giLCJyZWR1Y2VDb21tYW5kUmVkdWNlcnMiLCJyZWR1Y2VycyIsInJlZHVjZSIsImNvbWJpbmVDb21tYW5kUmVkdWNlcnMiLCJyZWR1Y2VyS2V5cyIsIk9iamVjdCIsImtleXMiLCJuZXh0U3RhdGUiLCJpIiwibGVuZ3RoIiwia2V5IiwicHJldiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUlBOzs7Ozs7QUFNQSxJQUFNQSxvQkFBb0IsU0FBcEJBLGlCQUFvQixDQUN4QkMsT0FEd0IsRUFFeEJDLEtBRndCLEVBR3hCQyxNQUh3QixFQUl4QkMsS0FKd0IsRUFLckI7QUFDSCxNQUFNQyxPQUFPSixRQUFRQyxLQUFSLEVBQWVDLE1BQWYsQ0FBYjtBQUNBLE1BQUksQ0FBQ0csTUFBTUMsT0FBTixDQUFjRixJQUFkLENBQUwsRUFBMEI7QUFDeEIsV0FBT0EsSUFBUDtBQUNEOztBQUpFLHVCQUs2QkEsSUFMN0I7QUFBQSxNQUtJRyxRQUxKO0FBQUEsTUFLaUJDLFFBTGpCOztBQU1IQSxXQUFTQyxPQUFULENBQWlCLGdCQUFvQjtBQUFBO0FBQUEsUUFBbEJDLEdBQWtCO0FBQUEsUUFBVkMsSUFBVTs7QUFDbkMsUUFBSSxPQUFPRCxHQUFQLEtBQWUsVUFBbkIsRUFBK0I7QUFDN0JFLGNBQVFDLE9BQVIsQ0FBZ0JILHdDQUFPQyxJQUFQLEVBQWhCLEVBQThCRyxJQUE5QixDQUFtQztBQUFBLGVBQUtDLEtBQUtBLEVBQUVDLElBQVAsSUFBZWIsTUFBTWMsUUFBTixDQUFlRixDQUFmLENBQXBCO0FBQUEsT0FBbkM7QUFDRDtBQUNGLEdBSkQ7QUFLQSxTQUFPUixRQUFQO0FBQ0QsQ0FqQkQ7O0FBbUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCTyxJQUFNVyx3REFBd0IsU0FBeEJBLHFCQUF3QixDQUNuQ2YsS0FEbUMsRUFFbkNnQixRQUZtQyxFQUdoQztBQUNILFNBQU8sVUFBQ2xCLEtBQUQsRUFBYUMsTUFBYjtBQUFBLFdBQ0xpQixTQUFTQyxNQUFULENBQ0UsVUFBQ2hCLElBQUQsRUFBT0osT0FBUDtBQUFBLGFBQW1CRCxrQkFBa0JDLE9BQWxCLEVBQTJCSSxJQUEzQixFQUFpQ0YsTUFBakMsRUFBeUNDLEtBQXpDLENBQW5CO0FBQUEsS0FERixFQUVFRixLQUZGLENBREs7QUFBQSxHQUFQO0FBS0QsQ0FUTTs7QUFXUDs7Ozs7O0FBTU8sSUFBTW9CLDBEQUF5QixTQUF6QkEsc0JBQXlCLENBQ3BDbEIsS0FEb0MsRUFFcENnQixRQUZvQyxFQUdqQztBQUNILFNBQU8sVUFBQ2xCLEtBQUQsRUFBYUMsTUFBYixFQUE2QjtBQUNsQyxRQUFNb0IsY0FBY0MsT0FBT0MsSUFBUCxDQUFZTCxRQUFaLENBQXBCO0FBQ0EsUUFBTU0sWUFBWSxFQUFsQjs7QUFFQSxTQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUosWUFBWUssTUFBaEMsRUFBd0NELEdBQXhDLEVBQTZDO0FBQzNDLFVBQU1FLE9BQU1OLFlBQVlJLENBQVosQ0FBWjtBQUNBLFVBQU0xQixVQUFVbUIsU0FBU1MsSUFBVCxDQUFoQjtBQUNBLFVBQU1DLE9BQU81QixNQUFNMkIsSUFBTixDQUFiO0FBQ0EsVUFBTXhCLE9BQU9MLGtCQUFrQkMsT0FBbEIsRUFBMkI2QixJQUEzQixFQUFpQzNCLE1BQWpDLEVBQXlDQyxLQUF6QyxDQUFiO0FBQ0FzQixnQkFBVUcsSUFBVixJQUFpQnhCLElBQWpCO0FBQ0Q7QUFDRCxXQUFPcUIsU0FBUDtBQUNELEdBWkQ7QUFhRCxDQWpCTSIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEBmbG93XG5cbmltcG9ydCB0eXBlIHsgU3RvcmUsIFJlZHVjZXIgfSBmcm9tICdyZWR1eCc7XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiB3aWxsIHRha2UgaW4gYSByZWR1Y2VyLCBzdGF0ZSwgYWN0aW9uLCBhbmRcbiAqIHN0b3JlIGFuZCBkaXNwYXRjaCBhbnkgYXN5bmMgY29tbWFuZHMgKGlmIGFueSkgYW5kIHJldHVyblxuICogdGhlIG5leHQgc3RhdGUuIFVzZWQgYXMgYSBoZWxwZXIgZnVuY3Rpb24gaW4gdGhlIHB1YmxpY1xuICogbWV0aG9kcyByZWR1Y2VDb21tYW5kUmVkdWNlcnMgYW5kIGNvbWJpbmVDb21tYW5kUmVkdWNlcnMuXG4gKi9cbmNvbnN0IHJlc29sdmVDbWRSZWR1Y2VyID0gKFxuICByZWR1Y2VyOiBSZWR1Y2VyPCosICo+LFxuICBzdGF0ZTogYW55LFxuICBhY3Rpb246IGFueSxcbiAgc3RvcmU6IFN0b3JlPCosICo+XG4pID0+IHtcbiAgY29uc3QgbmV4dCA9IHJlZHVjZXIoc3RhdGUsIGFjdGlvbik7XG4gIGlmICghQXJyYXkuaXNBcnJheShuZXh0KSkge1xuICAgIHJldHVybiBuZXh0O1xuICB9XG4gIGNvbnN0IFtuZXdTdGF0ZSwgLi4uY29tbWFuZHNdID0gbmV4dDtcbiAgY29tbWFuZHMuZm9yRWFjaCgoW2NtZCwgLi4uYXJnc10pID0+IHtcbiAgICBpZiAodHlwZW9mIGNtZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKGNtZCguLi5hcmdzKSkudGhlbihhID0+IGEgJiYgYS50eXBlICYmIHN0b3JlLmRpc3BhdGNoKGEpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gbmV3U3RhdGU7XG59O1xuXG4vKiogVGhpcyBpcyB0aGUgY29tbWFuZCByZWR1Y2VycyByZWR1Y2VyLCB3aGljaCBsZXQgdXMgaGFuZGxlXG4gKiBhc3luYyBzaWRlIGVmZmVjdHMgaW4gUmVkdXguIEluIHlvdXIgcmVkdWNlcnMsIGluc3RlYWRcbiAqIG9mIGp1c3QgcmV0dXJuaW5nIHlvdXIgU3RhdGUsIHlvdSBjYW4gcmV0dXJuIGFuIGFycmF5XG4gKiBvZiBbU3RhdGUsIC4uLkNvbW1hbmRzXSB3aGVyZSBDb21tYW5kcyBpcyBhcyBtYW55IENvbW1hbmRcbiAqIGFycmF5cyBhcyB5b3Ugd2FudC4gQSBjb21tYW5kIGFycmF5IGNvbnNpc3RzIG9mXG4gKiBbQ29tbWFuZEZuLCAuLi5hcmdzXSwgd2hlcmUgQ29tbWFuZEZuIGlzIGEgZnVuY3Rpb25cbiAqIHdoaWNoIHdpbGwgcmV0dXJuIGEgcHJvbWlzZSB3aGljaCB3aWxsIHJlc29sdmUgdG8gYVxuICogcmVkdXggYWN0aW9uLCBhbmQgdGhlIGFyZ3MgYXJlIHRoZSBhcmd1bWVudHMgeW91IG5lZWRcbiAqIHRvIHBhc3MgdG8gdGhlIGZ1bmN0aW9uLlxuICpcbiAqIGZvciBleGFtcGxlIGFuIGV4YW1wbGUgcmVkdWNlciBtaWdodCBsb29rIHNvbWV0aGluZyBsaWtlIHRoaXM6XG4gKlxuICogY29uc3QgcmVkdWNlciA9IChzdGF0ZSwgYWN0aW9uKSA9PiB7XG4gKiAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gKiAgICAgY2FzZSAnc3RhbmRhcmRBY3Rpb24nOlxuICogICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgY291bnQ6IHN0YXRlLmNvdW50KzF9XG4gKiAgICAgY2FzZSAnYXN5bmNBY3Rpb24nOlxuICogICAgICAgcmV0dXJuIFtcbiAqICAgICAgICAgc3RhdGUsXG4gKiAgICAgICAgIFtBcGkuZG9Tb21ldGhpbmdBc3luYywgYXN5bmNBcmddXG4gKiAgICAgICBdXG4gKiAgICAgY2FzZSAnYXN5bmNBY3Rpb25SZXN1bHQnOlxuICogICAgICAgcmV0dXJuIHsuLi5zdGF0ZSwgZGF0YTogYWN0aW9uLmRhdGF9XG4gKiAgICB9XG4gKiB9XG4gKlxuICogd2hlcmUgdGhlICdhc3luY0FjdGlvbicgd2lsbCByZXR1cm4gYW4gYXJyYXkgY29udGFpbmcgdGhlIHN0YXRlXG4gKiBhbmQgdGhlIGFzeW5jaHJvbm91cyBmdW5jdGlvbnMgdG8gYmUgY2FsbGVkIGFuZCB0aGVuIGRpc3BhdGNoZWRcbiAqIGlmIHRoZXkgcmVzb2x2ZSB0byBhbiBhY3Rpb24uXG4gKi9cbmV4cG9ydCBjb25zdCByZWR1Y2VDb21tYW5kUmVkdWNlcnMgPSAoXG4gIHN0b3JlOiBTdG9yZTwqLCAqPixcbiAgcmVkdWNlcnM6IFJlZHVjZXI8KiwgKj5bXVxuKSA9PiB7XG4gIHJldHVybiAoc3RhdGU6IGFueSwgYWN0aW9uOiBhbnkpID0+XG4gICAgcmVkdWNlcnMucmVkdWNlKFxuICAgICAgKG5leHQsIHJlZHVjZXIpID0+IHJlc29sdmVDbWRSZWR1Y2VyKHJlZHVjZXIsIG5leHQsIGFjdGlvbiwgc3RvcmUpLFxuICAgICAgc3RhdGVcbiAgICApO1xufTtcblxuLyoqIFRoaXMgaXMgdGhlIGNvbW1hbmQgcmVkdWNlcnMgY29tYmluZXIuIEl0IHdvcmtzXG4gKiB0aGUgc2FtZSB3YXkgYXMgdGhlIHJlZHVjZUNvbW1hbmRSZWR1Y2VycyBmdW5jdGlvbixcbiAqIGJ1dCBpdCB3aWxsIHVzZSB0aGUgY29tYmluZVJlZHVjZXJzIGJlaGF2aW9yXG4gKiB3aGVyZSBlYWNoIGtleSBpbiBhbiBvYmplY3QgaXMgYSByZWR1Y2VyIGluc3RlYWRcbiAqIG9mIHJlZHVjaW5nIGFuIGFycmF5IG9mIHJlZHVjZXJzXG4gKi9cbmV4cG9ydCBjb25zdCBjb21iaW5lQ29tbWFuZFJlZHVjZXJzID0gKFxuICBzdG9yZTogU3RvcmU8KiwgKj4sXG4gIHJlZHVjZXJzOiB7IFtrZXk6IHN0cmluZ106IFJlZHVjZXI8KiwgKj4gfVxuKSA9PiB7XG4gIHJldHVybiAoc3RhdGU6IGFueSwgYWN0aW9uOiBhbnkpID0+IHtcbiAgICBjb25zdCByZWR1Y2VyS2V5cyA9IE9iamVjdC5rZXlzKHJlZHVjZXJzKTtcbiAgICBjb25zdCBuZXh0U3RhdGUgPSB7fTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVkdWNlcktleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGtleSA9IHJlZHVjZXJLZXlzW2ldO1xuICAgICAgY29uc3QgcmVkdWNlciA9IHJlZHVjZXJzW2tleV07XG4gICAgICBjb25zdCBwcmV2ID0gc3RhdGVba2V5XTtcbiAgICAgIGNvbnN0IG5leHQgPSByZXNvbHZlQ21kUmVkdWNlcihyZWR1Y2VyLCBwcmV2LCBhY3Rpb24sIHN0b3JlKTtcbiAgICAgIG5leHRTdGF0ZVtrZXldID0gbmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIG5leHRTdGF0ZTtcbiAgfTtcbn07XG4iXX0=