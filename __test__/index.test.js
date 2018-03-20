import { combineCommandReducers, reduceCommandReducers } from '../src/index';
import { createStore } from 'redux';

const delay = action => new Promise(res => setTimeout(() => res(action), 10));

describe('reduceCommandReducers', () => {
  test('can work as a regular reducer', () => {
    const store = createStore((s, a) => s);
    const reducer = reduceCommandReducers(store, [(s, a) => s]);
    const ret = reducer({ foo: 'bar' }, 'anything');
    expect(ret).toEqual({ foo: 'bar' });
  });

  test('it can handle a delayed side effect', done => {
    expect.assertions(1);
    const store = createStore((s, a) => s, {});
    const reducers = [
      (s, a) => {
        switch (a.type) {
          case 'first':
            return [s, [delay, { type: 'second' }]];
          case 'second':
            expect(true).toBe(true);
            return [{ s, okay: true }, [done]];
          default:
            return s;
        }
      }
    ];
    const reducer = reduceCommandReducers(store, reducers);
    store.replaceReducer(reducer);
    store.dispatch({ type: 'first' });
  });

  test('it can work with multiple reducers', () => {
    const store = createStore((s, a) => s, {});
    const reducers = [
      (s, a) => (a.type === 1 ? { ...s, first: true } : s),
      (s, a) => (a.type === 2 ? { ...s, second: true } : s)
    ];
    const reducer = reduceCommandReducers(store, reducers);
    store.replaceReducer(reducer);
    store.dispatch({ type: 1 });
    store.dispatch({ type: 2 });
    expect(store.getState()).toEqual({ first: true, second: true });
  });
});

describe('combineCommandReducers', () => {
  test('can work as a regular reducer', () => {
    const store = createStore((s, a) => s);
    const reducer = combineCommandReducers(store, { state: (s, a) => s });
    const ret = reducer({ state: 'bar' }, 'anything');
    expect(ret).toEqual({ state: 'bar' });
  });

  test('it can handle a delayed side effect', done => {
    expect.assertions(1);
    const store = createStore((s, a) => s, {});
    const reducers = {
      state: (s, a) => {
        switch (a.type) {
          case 'first':
            return [s, [delay, { type: 'second' }]];
          case 'second':
            expect(true).toBe(true);
            return [{ s, okay: true }, [done]];
          default:
            return s;
        }
      }
    };
    const reducer = combineCommandReducers(store, reducers);
    store.replaceReducer(reducer);
    store.dispatch({ type: 'first' });
  });

  test('it can work with multiple reducers', () => {
    const store = createStore((s, a) => s, {});
    const reducers = {
      first: (s, a) => (a.type === 1 ? true : s),
      second: (s, a) => (a.type === 2 ? true : s)
    };
    const reducer = combineCommandReducers(store, reducers);
    store.replaceReducer(reducer);
    store.dispatch({ type: 1 });
    store.dispatch({ type: 2 });
    expect(store.getState()).toEqual({ first: true, second: true });
  });
});
