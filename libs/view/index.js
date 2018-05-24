/* @flow */

import React, { Component } from 'react';
import type { Element, Node } from 'react'

type Props ={
  show?: boolean,
  children: Element<any>
};

export default class View extends Component<Props> {

  /* eslint-enable */
  static _typeName='View'

  render(): Node {
    const style = this.props.hasOwnProperty('show') && !this.props.show && {
      display: 'none'
    };

    return React.cloneElement(React.Children.only(this.props.children), {
      style: Object.assign({}, this.props.children.props.style, style)
    });
  }
}
