/* @flow */

import React from 'react';
import classnames from 'classnames';

type Props = {
  className?: string,
  style?: Object
};

export default class Component extends React.Component<Props> {

  classNames(...args: any): string {
    return classnames(args);
  }

  className(...args: any): string {
    return this.classNames.apply(this, args.concat([this.props.className]));
  }

  style(args: any): Object {
    return Object.assign({}, args, this.props.style)
  }
}