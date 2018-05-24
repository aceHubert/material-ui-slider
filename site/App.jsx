import React, {Component} from 'react';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import Root from './Root'

class App extends Component { 

  constructor(props){
    super(props)

    this.state={
      themeType:'light'
    }
  }

  handleThemeChange= (theme)=>{
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
        <Root onThemeChange={this.handleThemeChange} />
      </MuiThemeProvider>  
    );
  }
}

export default App;
