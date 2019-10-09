import React from 'react';
import { shallow } from 'enzyme';

import Link from './Link';

const setup = (setupProps = {}) => {
  const defaultProps = {
    active: false,
    onClick: jest.fn(),
    children: 'Test link',
  };
  const props = { ...defaultProps, ...setupProps };
  const wrapper = shallow(
    <Link {...props}>
      {props.children}
    </Link>,
  );

  return {
    props,
    wrapper,
  };
};

describe('Link', () => {
  test('renders without crashing', () => {
    const { wrapper } = setup();
    expect(wrapper).toMatchSnapshot();
  });

  test('renders a span when active is true', () => {
    const { wrapper } = setup({ active: true });
    expect(wrapper).toMatchSnapshot();
  });

  test('calls onClick() on click', () => {
    const { props, wrapper } = setup();

    const link = wrapper.find('button');
    link.simulate('click');

    expect(props.onClick).toHaveBeenCalled();
  });
});
