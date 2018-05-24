/* @flow */

import React, { Component } from 'react';
import type { Element, Node } from 'react'
import ReactDOM from 'react-dom';
import requestAnimationFrame from 'raf';

type Props ={
  name: string,
  onEnter?: Function, // triggered when enter transition start
  onAfterEnter?: Function, // triggered when enter transition end
  onLeave?: Function, // triggered when leave transition start
  onAfterLeave?: Function, // tiggered when leave transition end
  children: Element<any>
};

type State ={
  children: any
};

export default class Transition extends Component<Props,State> {

  didEnter: any;
  didLeave: any;
  el: any;
  timeout: any;

  constructor(props: Props) {
    super(props);

    this.didEnter = this.didEnter.bind(this);
    this.didLeave = this.didLeave.bind(this);
    this.state = {
      children: props.children && this.enhanceChildren(props.children)
    }
  }

  componentWillReceiveProps(nextProps: any): void {
    const children: any = React.isValidElement(this.props.children) && React.Children.only(this.props.children);
    const nextChildren: any = React.isValidElement(nextProps.children) && React.Children.only(nextProps.children);

    if (!nextProps.name) {
      this.setState({
        children: nextChildren
      });
      return;
    }

    if (this.isViewComponent(nextChildren)) {
      this.setState({
        children: this.enhanceChildren(nextChildren, { show: children ? children.props.show : true })
      })
    } else {
      if (nextChildren) {
        this.setState({
          children: this.enhanceChildren(nextChildren)
        })
      }
    }
  }

  componentDidUpdate(preProps: any): void {
    if (!this.props.name) return;

    const children: any  = React.isValidElement(this.props.children) && React.Children.only(this.props.children);
    const preChildren: any = React.isValidElement(preProps.children) && React.Children.only(preProps.children);

    if (this.isViewComponent(children)) {
      if ((!preChildren || !preChildren.props.show) && children.props.show) {
        this.toggleVisible();
      } else if (preChildren && preChildren.props.show && !children.props.show) {
        this.toggleHidden();
      }
    } else {
      if (!preChildren && children) {
        this.toggleVisible();
      } else if (preChildren && !children) {
        this.toggleHidden();
      }
    }

  }

  enhanceChildren(children: any, props: any) {
    return React.cloneElement(children, Object.assign({ ref: (el: any) => { this.el = el } }, props))
  }

  get transitionClass(): Object {
    const { name } = this.props;

    return {
      enter: `${name}-enter`,
      enterActive: `${name}-enter-active`,
      enterTo: `${name}-enter-to`,
      leave: `${name}-leave`,
      leaveActive: `${name}-leave-active`,
      leaveTo: `${name}-leave-to`,
    }
  }

  isViewComponent(element: any) {
    return element && element.type._typeName === 'View';
  }

  /* css animation fix when animation applyied to .{action} instanceof .{action}-active */

  animateElement(element: any, action: any, active: any, fn: Function) {
    element.classList.add(active);

    const styles = getComputedStyle(element);
    const duration = parseFloat(styles['animationDuration']) || parseFloat(styles['transitionDuration']);

    element.classList.add(action);

    if (duration === 0) {
      const styles = getComputedStyle(element);
      const duration = parseFloat(styles['animationDuration']) || parseFloat(styles['transitionDuration']);

      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        fn();
      }, duration * 1000)
    }

    element.classList.remove(action, active);
  }

  didEnter(e: any) {
    const childDOM: any = ReactDOM.findDOMNode(this.el);

    if (!e || e.target !== childDOM) return;

    const { onAfterEnter } = this.props;
    const { enterActive, enterTo } = this.transitionClass;

    childDOM.classList.remove(enterActive, enterTo);

    childDOM.removeEventListener('transitionend', this.didEnter);
    childDOM.removeEventListener('animationend', this.didEnter);

    onAfterEnter && onAfterEnter();
  }

  didLeave(e: any) {
    const childDOM: any = ReactDOM.findDOMNode(this.el);
    if (!e || e.target !== childDOM) return;

    const { onAfterLeave, children } = this.props;
    const { leaveActive, leaveTo } = this.transitionClass;

    new Promise((resolve: any) => {
      if (this.isViewComponent(children)) {
        childDOM.removeEventListener('transitionend', this.didLeave);
        childDOM.removeEventListener('animationend', this.didLeave);

        requestAnimationFrame(() => {
          childDOM.style.display = 'none';
          childDOM.classList.remove(leaveActive, leaveTo);

          requestAnimationFrame(resolve);
        })
      } else {
        this.setState({ children: null }, resolve);
      }
    }).then(() => {
      onAfterLeave && onAfterLeave()
    })
  }

  toggleVisible() {
    const { onEnter } = this.props;
    const { enter, enterActive, enterTo, leaveActive, leaveTo } = this.transitionClass;
    const childDOM: any = ReactDOM.findDOMNode(this.el);

    childDOM.addEventListener('transitionend', this.didEnter);
    childDOM.addEventListener('animationend', this.didEnter);

    // this.animateElement(childDOM, enter, enterActive, this.didEnter);

    requestAnimationFrame(() => {
      // when hidden transition not end
      if (childDOM.classList.contains(leaveActive)) {
        childDOM.classList.remove(leaveActive, leaveTo);

        childDOM.removeEventListener('transitionend', this.didLeave);
        childDOM.removeEventListener('animationend', this.didLeave);
      }

      childDOM.style.display = '';
      childDOM.classList.add(enter, enterActive);

      onEnter && onEnter();

      requestAnimationFrame(() => {
        childDOM.classList.remove(enter);
        childDOM.classList.add(enterTo);
      })
    })
  }

  toggleHidden() {
    const { onLeave } = this.props;
    const { leave, leaveActive, leaveTo, enterActive, enterTo } = this.transitionClass;
    const childDOM: any = ReactDOM.findDOMNode(this.el);

    childDOM.addEventListener('transitionend', this.didLeave);
    childDOM.addEventListener('animationend', this.didLeave);

    // this.animateElement(childDOM, leave, leaveActive, this.didLeave);

    requestAnimationFrame(() => {
      // when enter transition not end
      if (childDOM.classList.contains(enterActive)) {
        childDOM.classList.remove(enterActive, enterTo);

        childDOM.removeEventListener('transitionend', this.didEnter);
        childDOM.removeEventListener('animationend', this.didEnter);
      }

      childDOM.classList.add(leave, leaveActive);

      onLeave && onLeave();

      requestAnimationFrame(() => {
        childDOM.classList.remove(leave);
        childDOM.classList.add(leaveTo);
      })
    })
  }

  render(): Node {
   return this.state.children || null;
  }
}

