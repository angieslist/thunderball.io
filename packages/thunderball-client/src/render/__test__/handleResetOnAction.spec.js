import handleResetOnAction from '../handleResetOnAction';

const initialState = Object.freeze({ foo: 'initial' });
const state = Object.freeze({
  foo: 'changed',
  routing: 'some_routing_state',
});
const resetOnAction = 'LOGOUT';

describe('handleResetOnAction', () => {
  let reducer;
  beforeEach(() => {
    reducer = jest.fn();
  });
  describe('calls reducer with initial state and state.routing for reset action', () => {
    it('supports resetOnAction string', () => {
      const handler = handleResetOnAction(reducer, initialState, resetOnAction);
      const action = {
        type: resetOnAction,
      };
      handler(state, action);
      expect(reducer).toHaveBeenCalledWith({
        ...initialState,
        routing: state.routing,
      }, action);
    });
    it('suppports resetOnAction array', () => {
      const handler = handleResetOnAction(reducer, initialState, [resetOnAction]);
      const action = {
        type: resetOnAction,
      };
      handler(state, action);
      expect(reducer).toHaveBeenCalledWith({
        ...initialState,
        routing: state.routing,
      }, action);
    });
  });
  it('calls reducer with new state for other actions', () => {
    const handler = handleResetOnAction(reducer, initialState, resetOnAction);
    const action = {
      type: 'ANOTHER_ACTION',
    };
    handler(state, action);
    expect(reducer).toHaveBeenCalledWith(state, action);
  });
});
