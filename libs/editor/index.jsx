/* @flow */

import React, { Component } from 'react'
import type { Node } from 'react'
import CodeMirror from 'codemirror'

import 'codemirror/mode/jsx/jsx'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/comment/comment'
import 'codemirror/lib/codemirror.css'
import './style.scss'

type Props = {  
  theme: string,
  mode: string,
  lineNumbers: boolean,
  dragDrop: boolean,
  value: string,
  onChange: Function
};

export default class Editor extends Component<Props> {

  editor: ?HTMLDivElement;
  cm: any;
  timeout: any;

  static defaultProps={
    mode: 'js',
    theme: 'sublime',
    lineNumbers: false,
    dragDrop:false
  }

  componentDidMount(): void {
    const { onChange, value, mode, theme, lineNumbers, dragDrop } = this.props

    this.cm = CodeMirror(this.editor, {
      mode: mode,
      theme: theme,
      keyMap: theme,
      viewportMargin: Infinity,
      lineNumbers: lineNumbers,
      dragDrop: dragDrop
    })

    this.cm.setValue(value)

    this.cm.on('changes', (cm: any) => {
      if (onChange) {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          onChange(cm.getValue());
        }, 300);
      }
    })
  }

  render(): Node {
    return <div className="editor" ref={(div: ?HTMLDivElement) => (this.editor = div)} />
  }
}


