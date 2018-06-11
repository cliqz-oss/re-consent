import PropTypes from 'prop-types';
import React from 'react';

const Button = ({ children }) => (
  <button className="btn btn-primary">{children}</button>
);

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;
