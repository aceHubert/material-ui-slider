import React from 'react';
import PropTypes from 'prop-types';

class View extends React.Component {

  /* eslint-enable */
  static _typeName='View'

  render() {
    const style = this.props.hasOwnProperty('show') && !this.props.show && {
      display: 'none'
    };

    return React.cloneElement(React.Children.only(this.props.children), {
      style: Object.assign({}, this.props.children.props.style, style)
    });
  }
}

View.propTypes={
  show: PropTypes.bool
}

export default View;