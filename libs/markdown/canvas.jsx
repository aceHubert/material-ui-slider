import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import marked from 'marked';
import { transform } from '@babel/standalone'  ; 
import Editor from '../editor';

class Canvas extends React.Component {

  playerId= `${parseInt(Math.random() * 1e9,10).toString(36)}`;
  description;
  extras={};
  source=[];
  constructor(props) {
    super(props)

    this.state= {
      showBlock: false
    }

    const matchs = props.children.match(/([^]*)[\r\n|\n](```[^]+```)/)
    if(matchs && matchs[1])
    {
      const descs =  matchs[1].match(/([^]*)[\r\n|\n]===\s?extra\s?[\r\n|\n]([^]+)[\r\n|\n]===/)
      if(!descs)
        this.description = marked(matchs[1])
      else{
        this.description = marked(descs[1])
        descs[2].split(/\r\n/).forEach((desc)=>{
        const value = desc.split(/\s+/)
          this.extras[value[0]]= value[1]
        })
      }
    }
    if(matchs && matchs[2])
    {
     this.source = matchs[2].match(/```(.*)[\n|\r\n]([^]+)[\r\n|\n]```/)
    }
  }

  componentDidMount() {
    this.renderSource(this.source[2])
  }

  blockControl() {
    this.setState({
      showBlock: !this.state.showBlock
    })
  }

  renderSource(value) {
    import('../../src').then((Element) => {
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
    }).then(({args, argv}) => {
      const code = transform(`
        class Demo extends React.Component {
          ${value}
        }

        ReactDOM.render(<Demo {...context.props} />, document.getElementById('${this.playerId}'))
      `, {
        presets: ['es2015', 'react']
      }).code

      args.push(code)

      const Fn = Function
      new Fn(...args).apply(this, argv)

      this.source[2] = value
    }).catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        throw err
      }
    })
  }

  render() {
    return (
      <div className={`demo-block demo-box demo-${this.props.name}`}>       
        <div className="demo-block-control">
          {
            this.extras.codepen && <a className="control-button" href={this.extras.codepen} target="_black">
              <svg aria-labelledby="simpleicons-codepen-icon" role="img" viewBox="0 0 24 24"><title id="simpleicons-codepen-icon">CodePen icon</title><path d="M24 8.182l-.018-.087-.017-.05c-.01-.024-.018-.05-.03-.075-.003-.018-.015-.034-.02-.05l-.035-.067-.03-.05-.044-.06-.046-.045-.06-.045-.046-.03-.06-.044-.044-.04-.015-.02L12.58.19c-.347-.232-.796-.232-1.142 0L.453 7.502l-.015.015-.044.035-.06.05-.038.04-.05.056-.037.045-.05.06c-.02.017-.03.03-.03.046l-.05.06-.02.06c-.02.01-.02.04-.03.07l-.01.05C0 8.12 0 8.15 0 8.18v7.497c0 .044.003.09.01.135l.01.046c.005.03.01.06.02.086l.015.05c.01.027.016.053.027.075l.022.05c0 .01.015.04.03.06l.03.04c.015.01.03.04.045.06l.03.04.04.04c.01.013.01.03.03.03l.06.042.04.03.01.014 10.97 7.33c.164.12.375.163.57.163s.39-.06.57-.18l10.99-7.28.014-.01.046-.037.06-.043.048-.036.052-.058.033-.045.04-.06.03-.05.03-.07.016-.052.03-.077.015-.045.03-.08v-7.5c0-.05 0-.095-.016-.14l-.014-.045.044.003zm-11.99 6.28l-3.65-2.44 3.65-2.442 3.65 2.44-3.65 2.44zm-1.034-6.674l-4.473 2.99L2.89 8.362l8.086-5.39V7.79zm-6.33 4.233l-2.582 1.73V10.3l2.582 1.726zm1.857 1.25l4.473 2.99v4.82L2.89 15.69l3.618-2.417v-.004zm6.537 2.99l4.474-2.98 3.613 2.42-8.087 5.39v-4.82zm6.33-4.23l2.583-1.72v3.456l-2.583-1.73zm-1.855-1.24L13.042 7.8V2.97l8.085 5.39-3.612 2.415v.003z"/></svg>
            </a>
          }
          {
            this.extras.github && <a className="control-button" href={this.extras.github} target="_black">
              <svg aria-labelledby="simpleicons-github-icon" role="img" viewBox="0 0 24 24"><title id="simpleicons-github-icon">GitHub icon</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
          }
          <button className="control-button"  onClick={this.blockControl.bind(this)}>
            <svg aria-labelledby="simpleicons-coding-icon" role="img"  viewBox="0 0 24 24"><g><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"></path></g></svg>
          </button>
        </div>
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
                theme={this.props.theme}
                lineNumbers={true}
                onChange={(code) => this.renderSource(code)}
              />
            </div>
          )
        }
        <div className="source" id={this.playerId} />
      </div>
    )
  }
}


Canvas.propTypes={
  name: PropTypes.string.isRequired,
  theme: PropTypes.string,
  children: PropTypes.string.isRequired
}

export default Canvas;