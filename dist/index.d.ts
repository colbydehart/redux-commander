import { Action, AnyAction, Store, Reducer } from "redux";
export declare type Command<A extends Action = AnyAction> = [(...args: any[]) => A | Promise<A> | null, ...any[]];
export declare type CommandReducer<S = any, A extends Action = AnyAction> = (state: S | undefined, action: A) => S | [S, ...(Command<A> | null)[]];
export declare type CommandReducersMapObject<S = any, A extends Action<any> = AnyAction> = {
    [K in keyof S]: CommandReducer<S[K], A>;
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
export declare function reduceCommandReducers<S = any, A extends Action<any> = AnyAction>(store: Store<S, A>, reducers: CommandReducer<S, A>[]): Reducer<S, A>;
/** This is the command reducers combiner. It works
 * the same way as the reduceCommandReducers function,
 * but it will use the combineReducers behavior
 * where each key in an object is a reducer instead
 * of reducing an array of reducers
 */
export declare function combineCommandReducers<S = any, A extends Action<any> = AnyAction>(store: Store<S, A>, reducers: CommandReducersMapObject<S, A>): Reducer<S, A>;
