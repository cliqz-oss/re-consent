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

  render() {
    const {
      content,
      placement,
      children,
    } = this.props;

    const toggle = isOpen => () => this.setState({ isOpen });

    return (
      <span onMouseLeave={toggle(false)} onMouseEnter={toggle(true)}>
        <Manager>
          <Reference>
            {({ ref }) => (
              <span ref={ref}>
                {children}
              </span>
            )}
          </Reference>
          {this.state.isOpen && (
            <Popper placement={placement}>
              {({
                ref,
                style,
                placement: currentPlacement,
                arrowProps,
              }) => (
                <div ref={ref} style={style} data-placement={currentPlacement} className="tooltip">
                  {content}
                  <div ref={arrowProps.ref} style={arrowProps.style} className="tooltip__arrow" />
                </div>
              )}
            </Popper>
          )}
        </Manager>
      </span>
    );
  }
}

Tooltip.propTypes = {
  content: PropTypes.string.isRequired,
  placement: PropTypes.oneOf(['bottom', 'left', 'top']).isRequired,
  children: PropTypes.node.isRequired,
};

export default Tooltip;
