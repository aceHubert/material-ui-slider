import React, {Component} from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import Root from './Root'

class App extends Component { 

  constructor(props){
    super(props)

    this.state={
      themeType: localStorage.getItem('ACE_THEME') || 'light'
    }
  }

  handleThemeChange= (theme)=>{
    localStorage.setItem('ACE_THEME', theme);
    this.setState({
      themeType: theme
    })
  }

  render() {   
    const theme = createMuiTheme({
      palette: {
        type: this.state.themeType,
        primary: {main: '#bf4040'}
      }
    });
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          <Root onThemeChange={this.handleThemeChange} />
        </CssBaseline>
      </MuiThemeProvider>  
    );
  }
}

export default App;
