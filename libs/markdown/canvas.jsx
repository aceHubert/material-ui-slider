/* @flow */

import React, { Component } from 'react'
import type { Element, Node } from 'react'
import ReactDOM from 'react-dom'
import marked from 'marked'
import { transform } from 'babel-standalone'
   
import Editor from '../editor'

type Props ={
  locale: Object,
  name: string,
  children: string
};

type State ={
  showBlock: boolean
};

export default class Canvas extends Component<Props,State> {

  static defaultProps={
    locale:{}
  }

  playerId: any = `${parseInt(Math.random() * 1e9).toString(36)}`;
  document: ?Array<any>;
  description: any;
  source: any;

  constructor(props: Props) {
    super(props)

    this.state= {
      showBlock: false
    }

    this.document = props.children.match(/([^]*)[\r\n|\n]?(```[^]+```)/)
    this.document && this.document[1] &&( this.description = marked(this.document[1]))
    this.document && this.document[2] &&(this.source = this.document[2].match(/```(.*)[\n|\r\n]([^]+)```/))   
  }

  componentDidMount(): void {
    this.renderSource(this.source[2])
  }

  blockControl(): void {
    this.setState({
      showBlock: !this.state.showBlock
    })
  }

  renderSource(value: any): void {
    import('../../src').then((Element: Element<any>) => {
      const args = ['context', 'React', 'ReactDOM']
      const argv = [this, React, ReactDOM]

      for (const key in Element) {
        args.push(key)
        argv.push(Element[key])
      }

      return {
        args,
        argv
      }
    }).then(({ args, argv }: { args: any,argv: Array<any>}) => {
      const code = transform(`
        class Demo extends React.Component {
          ${value}
        }

        ReactDOM.render(<Demo {...context.props} />, document.getElementById('${this.playerId}'))
      `, {
        presets: ['es2015', 'react']
      }).code

      args.push(code)

      new Function(...args).apply(this, argv)

      this.source[2] = value
    }).catch((err: any) => {
      if (process.env.NODE_ENV !== 'production') {
        throw err;
      }
    })
  }

  render(): Node {
    return (
      <div className={`demo-block demo-box demo-${this.props.name}`}>
        <div className="source" id={this.playerId} />
        {
          this.state.showBlock && (
            <div className="meta">
              {
                this.description && (
                  <div
                    ref="description"
                    className="description"
                    dangerouslySetInnerHTML={{ __html: this.description }}
                  />
                )
              }
              <Editor
                value={this.source[2]}
                onChange={(code: any) => this.renderSource(code)}
              />
            </div>
          )
        }
        <div className="demo-block-control" onClick={this.blockControl.bind(this)}>
          {
            this.state.showBlock ? (
              <span>
                <i className="el-icon-caret-top" />{this.props.locale.hide}
              </span>
            ) : (
              <span>
                <i className="el-icon-caret-bottom" />{this.props.locale.show}
              </span>
            )
          }
        </div>
      </div>
    )
  }
}
