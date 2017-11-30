/**
 * Reset the redux store to it's initialState when the defined action(s) occur
 * @param {object} reducer The top level composed reducer to comprise the redux store
 * @param {object} initialState The initial state of the redux store (will be used to reset)
 * @param {Array} resetOnAction The action or actions to cause the store to reset it's state
 * @return {object} The determined state
 */
export default (reducer, initialState, resetOnAction) => (state, action) => {
  // Check if the resetOnAction is a string or array
  const reset = resetOnAction !== undefined &&
    (Array.isArray(resetOnAction)) ?
    resetOnAction.includes(action.type) :
    action.type === resetOnAction;

  const newState = !reset ? state : {
    ...initialState,
    routing: state.routing,
  };

  return reducer(newState, action);
};
