import React from 'react'
import PropTypes from 'prop-types';
import CodeMirror from 'codemirror'

import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/comment/comment';
import 'codemirror/lib/codemirror.css';
import './light.css';
import './dark.css';

class Editor extends React.Component {

  componentDidMount() {
    const { onChange, value, mode, theme, lineNumbers, dragDrop } = this.props

    this.cm = CodeMirror(this.editor, {
      mode: mode,
      theme: theme || 'light',
      keyMap: 'sublime',
      viewportMargin: Infinity,
      lineNumbers: lineNumbers,
      dragDrop: dragDrop
    })

    this.cm.setValue(value)

    this.cm.on('changes', (cm) => {
      if (onChange) {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          onChange(cm.getValue());
        }, 300);
      }
    })
  }

  componentWillReceiveProps(nextProps){
    for (const key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        const prop = nextProps[key];
        if(prop !== this.props[key])
        {
          this.cm.setOption(key,prop);
        }
      }
    }
  }

  render() {
    return <div className="editor" ref={(div) => (this.editor = div)} />
  }
}


Editor.propTypes={
  theme: PropTypes.string,
  mode: PropTypes.string,
  lineNumbers: PropTypes.bool,
  dragDrop: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func
}

Editor.defaultProps={
  mode: 'jsx',
  theme: 'light',
  lineNumbers: false,
  dragDrop:false
}

export default  Editor;