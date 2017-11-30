import createGenericReducer from '../createGenericReducer';

describe('createGenericReducer', () => {
  it('should return empty state if no default', () => {
    const reducer = createGenericReducer();

    expect(reducer()).toEqual({});
  });
  it('should return the default if no state', () => {
    const reducer = createGenericReducer({ foo: 'bar' });

    expect(reducer()).toEqual({ foo: 'bar' });
  });

  it('should return the state', () => {
    const reducer = createGenericReducer({ foo: 'bar' });

    expect(reducer({ bar: 'baz' })).toEqual({ bar: 'baz' });
  });
});
