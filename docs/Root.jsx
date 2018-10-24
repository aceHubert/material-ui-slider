import React from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import Switch from '@material-ui/core/Switch'
import Hidden from '@material-ui/core/Hidden'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import VolumeMute from '@material-ui/icons/VolumeMute'
import { withStyles } from '@material-ui/core/styles'
import { Slider } from 'material-ui-slider'
import { Component } from '../libs'
import { Install, Usage, Props } from './steps'

const styles= theme=>({
  container:{
    width:'100%',
    height: '100%'
  },
  button: {
    margin: theme.spacing.unit,
  },
  header:{
    width:'100%',
    height: '100%',
    background: `url(${require('./assets/bg.jpg')}) no-repeat center center`,
    backgroundSize: 'cover',
    position: 'relative'
  },
  titleContainer:{  
    width:'100%',
    textAlign:'center',
    position:'absolute',
    top: '20%'
  },
  themePanel:{
    position:'absolute',
    right: 30,
    top: 30
  },
  musicExplame:{
    width: 900,
    position:'absolute',
    left: '50%',
    bottom: 50,
    transform: 'translateX(-50%)'
  },
  card: {
    margin:'0 10px',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  controls: {
    marginTop: 30,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  },  
  regulator:{
    height: 120,
    marginTop:10,
    textAlign:'center'
  },
  slider:{
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  volumn:{
    flex: '0 2 auto'
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  gettingStarted:{
    width: 1120,
    padding: 20,
    margin: '24px auto 0',
    color: theme.typography.caption.color
  },
  footer:{
    padding: 20,
    color:theme.typography.caption.color,
    textAlign:'center'
  },
  '@global footer a':{
    margin: '0 8px',
    fontSize:12,
    lineHeight: 1.5,
    color:theme.typography.caption.color,
  },
  '@media (max-width: 1120px)':{
    gettingStarted:{
      width: 900,
    }
  },
  '@media (max-width: 900px)':{
    titleContainer:{
      top:'15%'
    },
    musicExplame:{
      width: '100%'
    },
    gettingStarted:{
      width: 768
    }
  },
  '@media (max-width: 768px)':{
    gettingStarted:{
      width: '100%'
    }
  }
})

class Root extends Component {

  constructor(props) {
    super(props)
    this.state = {
      sliderMax: 259,
      sliderValue:60
    }
  }

  handleProcess = (val)=>{
    this.setState({
      sliderValue: val
    })
  }

  toTime = (value) =>{
    if(value > 0)
    {
      return `${this.leftZeroPad(Math.floor(value/60),2)}:${this.leftZeroPad(value%60,2)}`
    }
    return '00:00'
  }

  leftZeroPad = (val, length) => {
     //这里用slice和substr均可
     return (Array(length).join("0") + val).slice(-length);
  }

  render() {
    const {classes, theme, onThemeChange} = this.props
    const {sliderMax, sliderValue} = this.state

    return (
      <div className={classes.container}>
        <header className={classes.header}>  
          <div className={classes.themePanel}>
            <FormControlLabel
              control={
                <Switch color="primary" checked={theme.palette.type === 'dark'} onChange={(e,checked)=>{onThemeChange(checked?'dark':'light')}}></Switch>
            }
              label="Dark Theme"></FormControlLabel>
          </div>
          <div className={classes.titleContainer}>
            <Typography color="textSecondary" variant="display3">
            Material-UI 
            </Typography>  <Typography color="textSecondary" variant="display3">
            Slider
            </Typography>
            <Button variant="raised" size="small" className={classes.button} href="https://github.com/aceHubert/material-ui-slider">
              <svg style={{width:18,height:18,marginRight:5}} preserveAspectRatio="xMidYMid" width="34" height="33.19" viewBox="0 0 34 33.19">
                <g id="surface1">
                  <path  d="M17.006,0.005 C7.613,0.005 -0.002,7.540 -0.002,16.835 C-0.002,24.743 5.512,31.374 12.941,33.177 C12.939,31.096 12.933,27.138 12.931,26.994 C12.900,26.975 9.707,28.826 8.078,25.589 C7.881,25.189 7.486,23.853 6.496,23.104 C6.460,23.074 5.729,22.705 5.662,22.342 C5.654,22.291 5.709,22.185 5.781,22.159 C5.856,22.131 7.059,21.642 8.401,23.327 C8.805,23.890 9.718,26.053 12.914,24.716 C12.999,24.383 13.309,23.619 14.000,23.000 C9.241,22.438 7.254,21.046 6.579,17.020 C6.158,14.275 6.968,11.993 8.184,10.867 C8.000,10.627 7.392,8.622 8.336,6.500 C9.359,6.297 11.235,7.024 12.883,8.199 C15.208,7.367 18.990,7.167 21.136,8.199 C21.878,7.592 24.529,6.173 25.666,6.503 C26.001,7.346 26.483,9.387 25.817,10.874 C27.298,12.383 27.716,14.331 27.449,16.725 C27.121,20.352 25.042,22.573 20.000,23.000 C20.840,23.587 22.000,24.634 22.000,26.000 C22.000,27.468 22.001,30.989 22.000,33.000 C29.040,30.941 34.014,24.470 34.014,16.835 C34.014,7.540 26.399,0.005 17.006,0.005 Z" />
                </g>
              </svg>
                GitHub
            </Button>
            <Button color="primary" variant="raised" size="small" className={classes.button} href="#getting_started">
              Document
            </Button>
          </div>
          <div className={classes.musicExplame} >
            <Card className={classes.card}>
              <div className={classes.details}>
                <CardContent className={classes.content}>
                  <Typography variant="headline">Live From Space</Typography>
                  <Typography variant="subheading" color="textSecondary">
                    Mac Miller
                  </Typography>
                </CardContent>
                <div className={classes.regulator}>
                  <Slider direction="vertical" ></Slider>
                  <Hidden smDown >
                    <Slider direction="vertical" defaultValue={100}></Slider> 
                  </Hidden>                
                  <Slider direction="vertical" defaultValue={50} disabled ></Slider>
                  <Hidden smDown >
                    <Slider direction="vertical" defaultValue={80} scaleLength={20}></Slider>
                    <Slider direction="vertical" defaultValue={-10} min={-50} max={50}></Slider>                 
                    <Slider direction="vertical" color="#39ADBD"></Slider>         
                    <Slider direction="vertical" color="#39ADBD" defaultValue={100}></Slider>                
                    <Slider direction="vertical" color="#39ADBD" defaultValue={50} disabled ></Slider>  
                  </Hidden>               
                  <Slider direction="vertical" color="#39ADBD" defaultValue={80} scaleLength={20}></Slider>
                  <Slider direction="vertical" color="#39ADBD" defaultValue={-10} min={-50} max={50}></Slider>                  
                  <Slider direction="vertical" color="green" range></Slider>
                  <Slider direction="vertical" color="green" defaultValue={[30,78]} range></Slider>
                  <Hidden smDown>
                    <Slider direction="vertical" color="green" defaultValue={[20,50]} disabled range ></Slider>
                    <Slider direction="vertical" color="green" defaultValue={[60,80]} scaleLength={20} range></Slider>
                    <Slider direction="vertical" color="green" defaultValue={[-10,10]} min={-50} max={50} range></Slider>
                  </Hidden>
                </div>
                <div className={classes.controls}>
                  <IconButton aria-label="Previous">
                    {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                  </IconButton>
                  <IconButton aria-label="Play/pause">
                    <PlayArrowIcon className={classes.playIcon} />
                  </IconButton>
                  <IconButton aria-label="Next">
                    {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                  </IconButton>
                  <div className={classes.processLeft}>
                    <Typography>{this.toTime(sliderValue)}</Typography>
                  </div>
                  <Slider className={classes.slider} defaultValue={sliderValue} max={sliderMax} onChange={this.handleProcess}></Slider>
                  <div className={classes.processRight}>
                    <Typography>{this.toTime(sliderMax)}</Typography>
                  </div>  
                  <Hidden smDown>  
                    <IconButton aria-label="Volume">
                      <VolumeMute />
                    </IconButton> 
                    <Slider className={classes.volumn} defaultValue={sliderValue} max={sliderMax}></Slider>            
                  </Hidden>
                </div>
              </div>
            </Card>
          </div>
        </header>   
        <div id="getting_started" className={classes.gettingStarted}>
          <Install></Install>
          <Usage></Usage>
          <Hidden smDown >
            <Props></Props>
          </Hidden>
        </div>   
        <footer className={classes.footer}>
          <a href="http://blog.acehubert.com" target="_black">@aceHubert</a>
        </footer>
      </div>
      )
    }
  }

  export default withStyles(styles,{withTheme:true})(Root);
