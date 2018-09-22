import { Action, Store, Reducer } from "redux";

export type Command<A extends Action = any> = [
  (...args: any[]) => A | Promise<A> | null,
  ...any[]
];

export type CommandReducer<S = any, A extends Action = any> = (
  state: S,
  action: A
) => S | [S, ...Command<A>[]];

export type CommandReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: CommandReducer<S[K], A> | Reducer<S[K], A>
};

export function reduceCommandReducers<S = any, A extends Action = any>(
  store: Store<S, A>,
  ...reducers: Array<CommandReducer<S, A> | Reducer<S, A>>
): Reducer<S, A>;

export function combineCommandReducers<S = any, A extends Action = any>(
  store: Store<S, A>,
  reducers: CommandReducersMapObject<S, A>
): Reducer<S, A>;
