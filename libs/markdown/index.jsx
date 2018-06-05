/* @flow */

import React, { Component } from 'react';
import type { Node } from 'react'
import ReactDOM from 'react-dom';
import marked from 'marked';
import prism from 'prismjs';

import Canvas from './canvas';
import './prism.css';
import './style.css';

export default class Markdown extends Component<{}> {

  components: any;
  renderer: any;
  document: any;

  constructor(props: any) {
    super(props);

    this.components = new Map();

    this.renderer = new marked.Renderer();
    this.renderer.table = (header: any, body: any) => {
      return `<table class="grid"><thead>${header}</thead><tbody>${body}</tbody></table>`;
    };
  }

  componentDidMount(): void {
    this.renderDOM();
  }

  componentDidUpdate(): void {
    this.renderDOM();
  }

  renderDOM(): void {
    for (const [id, component] of this.components) {
      const div = document.getElementById(id);    
      if (div instanceof HTMLElement) {     
        ReactDOM.render(component, div);
      }
    }
    prism.highlightAll();
  }

  render(): Node {
    const document = this.document && this.document(localStorage.getItem('ACE_LANGUAGE') || 'zh-CN');
    const {classes, theme, ...otherProps} = this.props;
    if (typeof document === 'string') {
      this.components.clear();
      const theme = this.getTheme && this.getTheme();
      const html = marked(document.replace(/:::\s?demo\s?([^]+?):::/g, (match: any, p1: any, offset: number) => {
        const id = offset.toString(36);       
        this.components.set(id, React.createElement(Canvas, Object.assign({
          name: this.constructor.name.toLowerCase(),
          theme
        }, otherProps), p1));
        return `<div id=${id}></div>`;
      }), { renderer: this.renderer });


      return (
        <div className={`markdown-only ${theme}`} dangerouslySetInnerHTML={{
          __html: html
        }} />
      )
    } else {
      return <span />
    }
  }
}