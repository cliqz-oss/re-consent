import PropTypes from 'prop-types';
import React from 'react';

import { Manager, Reference, Popper } from 'react-popper';


class Tooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  mouseOut() {
    this.setState({ isOpen: false });
  }

  mouseOver() {
    this.setState({ isOpen: true });
  }

  render() {
    const {
      content,
      placement,
      children,
    } = this.props;

    const toggle = isOpen => () => this.setState({ isOpen });

    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <span
              ref={ref}
              onMouseOver={toggle(true)}
              onFocus={toggle(true)}
              onMouseOut={toggle(false)}
              onBlur={toggle(false)}
            >
              {children}
            </span>
          )}
        </Reference>
        {this.state.isOpen && (
          <Popper placement={placement} modifiers={{ keepTogether: { enabled: true } }}>
            {({
              ref,
              style,
              arrowProps,
            }) => (
              <div ref={ref} style={style} data-placement={placement} className="tooltip">
                {content}
                <div ref={arrowProps.ref} style={arrowProps.style} className="tooltip__arrow" />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    );
  }
}

Tooltip.propTypes = {
  content: PropTypes.string.isRequired,
  placement: PropTypes.oneOf(['bottom', 'left']).isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
