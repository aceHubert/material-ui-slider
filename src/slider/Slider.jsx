import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import debounce from 'lodash/debounce'
import { withStyles } from '@material-ui/core/styles'
import { Component } from '../../libs'
import { calculateChange } from "../helpers/slider"


const styles = theme =>({
  warp:{
    position: 'absolute',
    top: 0, right: 0, bottom: 0, left: 0
  },
  trackContainer:{
    width:'100%',
    height:'100%'
  },
  track:{
    position: 'absolute',
    transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, width 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, height 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, right 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, top 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, bottom 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
  },
  pointer:{
    marginTop: 1,
    width: 12,
    height: 12,    
    backgroundClip: 'padding-box',
    border: '0px solid transparent',
    borderRadius: '50%',
    boxSizing: 'border-box',
    position: 'absolute',
    cursor: 'pointer',
    pointerEvents: 'inherit',   
    transform: 'translate(-50%, -50%)',
    transition: 'background 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, border-color 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, width 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, height 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, left 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, right 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, top 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, bottom 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
    overflow: 'visible',
    outline: 'none',
    zIndex: 1  
  },
  pointerRight:{
    transform: 'translate(50%, -50%)',
  },
  pointerVertical:{
    marginLeft: 1,
    transform: 'translate(-50%, 50%)',
  },
  pointerVerticalTop:{
    transform: 'translate(-50%, -50%)',
  },
  pointerOver:{
    '&:before':{
      content:'""',        
      display: 'block',
      border:`0 solid ${theme.palette.action.hover}`,
      position:'absolute',     
      overflow: 'hidden',    
      borderRadius: 'inherit',
      boxSizing:'border-box',
      pointerEvents: 'none',
      transition: 'border 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, width 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, height 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, left 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, top 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, top 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, bottom 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
      zIndex:-1
    }
  },
  pointerHover:{
    '&:before':{
      width:36,
      height:36,  
      borderWidth:12,
      left:-12,
      top:-12,
    }
  },
  pointerPressed:{
    '&:before':{
      width:48,
      height:48,  
      borderWidth:18,
      borderColor: theme.palette.action.selected,
      left:-18,
      top:-18,
    }
  },
  pointerDisabled:{
    width: 8,
    height: 8, 
  },
  scale:{
    position: 'absolute',
  }
})

class Slider extends Component{

  static defaultProps={
    min:0,
    max:100,
    defaultValue:0,
    range:false,
    scale:0,
    direction:'horizontal',
    onChange:()=>{},
    onChangeComplete:()=>{},
    leftLock: false,
    rightLock: false,
    leftMin: 0
  }

  min;
  max;
  activePointer = 'left';
  constructor(props){
    super(props)
    const {min, max, defaultValue, value} = props;
    this.min = Math.min(min,max);
    this.max = Math.max(min, max);
  
    this.state={
      value: this.calcDefaultValue(value||defaultValue),
      hover: false,
      pressed: false     
    }

    this.debounce = debounce((fn, data, event) => {
      fn(data, event)
    }, 100)
  }

  componentWillUnmount() {
    this.unbindEventListeners()
  }

  componentWillReceiveProps(nextProps){    
    const {min, max} = nextProps;
    this.min = Math.min(min, max);
    this.max = Math.max(min, max);    
    if(!_.isUndefined(nextProps.value) && !_.isEqual(nextProps.value,this.props.value)){
      this.setState({
        value: this.calcDefaultValue(nextProps.value)
      })
    }
  }

  calcDefaultValue = (defaultValue)=>{
    const {range} = this.props;
    const {min, max} = this;   
    if(range)
    {
      let value =!!this.state ? this.state.value : [min, max];
      if(_.isArray(defaultValue)){
        const value1 = _.isNumber(defaultValue[0])? defaultValue[0] : min;
        const value2 = _.isNumber(defaultValue[1])? defaultValue[1] : max;
        const valueMin = Math.min(value1,value2);
        const valueMax = Math.max(value1,value2);
        value[0] = this.calcScaleValue(valueMin >= min && valueMin <= max ? valueMin : min);
        value[1] = this.calcScaleValue(valueMax >= min && valueMax <= max ? valueMax : max);
      }else if(_.isNumber(defaultValue))
      {
        const valueMin = this.calcScaleValue(defaultValue);
        if(valueMin <= value[1])
          value[0] = valueMin
        else 
          value[1] = valueMin
      }
      return value;
    }else{
      return this.calcScaleValue(_.isNumber(defaultValue) && defaultValue >= min && defaultValue <= max ? defaultValue : min);
    }
  }

  calcScaleValue = (value)=>{
    const {scaleLength} = this.props; 
    const {min, max} = this;   
    if(scaleLength> 0){
      value -= min;
      let halfScaleLength = scaleLength/2;
      if((max-min)%scaleLength > 0 && value/scaleLength > Math.floor((max-min)/scaleLength)){
        halfScaleLength = (max-min)%scaleLength/2;
      }   
      if(value%scaleLength > halfScaleLength){
        const upValue = min + Math.ceil((value)/scaleLength)*scaleLength;
        return upValue > max ? max : upValue;
      }else{
        return min + Math.floor((value)/scaleLength)*scaleLength;
      }
    
    }
    else
      return value;
  }

  triggerChange= (event)=>{
    this.props.onChangeComplete && this.debounce(this.props.onChangeComplete, this.state.value, event)
    this.props.onChange && this.props.onChange(this.state.value, event)
  }
  
  handleChange = (e, skip)=>{
    const {range, disabled, leftLock, rightLock, leftMin} = this.props;
    const {min, max} = this;
    if(disabled) return;

    const offset = calculateChange(e,skip,this.props,this.container);
    const oldValue = this.state.value;
    const newValueCal = this.calcScaleValue(Math.round(offset/100*((max-min)))+min);
    const newValue = (leftMin && newValueCal < leftMin) ? leftMin : newValueCal;
    if(range){
      if((this.activePointer==='left' && oldValue[0] !== newValue && newValue < oldValue[1]) || newValue <= oldValue[0] ){
        this.activePointer==='right'&&(this.activePointer='left');
        if (!leftLock) {
          this.setState({
            value:[newValue,oldValue[1]]
          },()=>{this.triggerChange(e)})
        }
      }else if((this.activePointer==='right' && oldValue[1] !== newValue && newValue > oldValue[0])|| newValue >= oldValue[1]) {
        this.activePointer==='left'&&(this.activePointer='right');
        if (!rightLock) {
          this.setState({
            value:[oldValue[0],newValue]
          },()=>{this.triggerChange(e)})
        }
      }
    }else{         
      if(oldValue !== newValue)
      {
        this.setState({
          value:newValue
        },()=>{this.triggerChange(e)})
      }     
    }
   
  }

  handleMouseOver=()=>{
    this.setState({
      hover: true
    })
  }

  handleMouseOut=()=>{
    this.setState({
      hover: false
    })
  }
  
  handleTouchStart = (e, skip)=>{
    this.setState({
      pressed: true
    })
    this.handleChange(e,skip);
    window.addEventListener('touchend', this.handleMouseUp)
  }
  
  handleMouseDown = (e)=>{
    this.setState({
      pressed: true
    })
    this.handleChange(e, true)
    window.addEventListener('mousemove', this.handleChange)
    window.addEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseUp = () => {
    this.setState({
      pressed: false
    })
    this.unbindEventListeners()
  }

  unbindEventListeners() {
    window.removeEventListener('mousemove', this.handleChange)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('touchend', this.handleMouseUp)
  }

  render(){
    const {classes, theme, range, scaleLength, direction, color, disabled} = this.props;
    const {value, hover, pressed}=this.state;
    const {min, max} = this;
    const trackColor = disabled ?  theme.palette.grey[700] : (color || theme.palette.primary[theme.palette.type]);
    const vertical = direction==='vertical';
    let rootStyle=Object.assign({
      position: 'relative',
      width:'100%',
      height: 48,
      display: 'inline-block'
    },vertical&&{
      width:48,
      height:'100%'
    });
    let containerStyle=Object.assign({ 
      position:'absolute',     
      top: 23,
      left: 0,
      width: '100%',
      height: 2
    },vertical&&{
      top:0,
      left:23,
      height:'100%',
      width:2
    });

    let trackEl;
    let thumbEl
    if(range){
      const offsetLeft = Math.round((value[0]-min)/(max-min)*100);
      const offsetRight = 100 - Math.round((value[1]-min)/(max-min)*100);

      const trackActiveStyle=Object.assign({
        backgroundColor: trackColor            
      },vertical?{
        width: '100%',
        bottom: `${offsetLeft}%`,
        top: `${offsetRight}%`,
        marginTop: disabled ? 6 : 0, 
        marginBottom: disabled ? 6 : 0  
      }:{
        height: '100%', 
        left: `${offsetLeft}%`,
        right: `${offsetRight}%`,
        marginRight: disabled ? 6 : 0, 
        marginLeft: disabled ? 6 : 0  
      });

      const trackLeftStyle=Object.assign({       
        backgroundColor:trackColor,       
        opacity:'.38' 
      },vertical?{
        width: '100%',        
        height: disabled ? `calc(${offsetLeft}% - 6px)` : `calc(${offsetLeft}%)`, 
        marginTop: disabled ? 6 : 0, 
        bottom: 0
      }:{
        height: '100%',        
        width: disabled ? `calc(${offsetLeft}% - 6px)` : `calc(${offsetLeft}%)`, 
        marginRight: disabled ? 6 : 0, 
        left: 0
      });

      const trackRightStyle=Object.assign({      
        backgroundColor: trackColor,       
        opacity:'.38' 
      },vertical?{
        width: '100%',        
        height: disabled ? `calc(${offsetRight}% - 6px)` : `calc(${offsetRight}%)`,
        marginBottom: disabled ? 6 : 0, 
        top: 0
      }:{
        height: '100%',        
        width: disabled ? `calc(${offsetRight}% - 6px)` : `calc(${offsetRight}%)`,
        marginLeft: disabled ? 6 : 0, 
        right: 0
      });

      const thumbLeftStyle=Object.assign({        
        backgroundColor: trackColor       
      },vertical?{
        left:0,
        bottom:`${offsetLeft}%`
      }:{
        top:0,
        left:`${offsetLeft}%`
      });

      const thumbLeftClass=this.classNames(classes.pointer,
        disabled && classes.pointerDisabled,
        vertical && classes.pointerVertical,
        this.activePointer==='left' && !disabled && (hover||pressed) && classes.pointerOver,
        this.activePointer==='left' && !disabled && hover && classes.pointerHover,
        this.activePointer==='left' && !disabled && pressed && classes.pointerPressed);

      const thumbRightStyle=Object.assign({        
        backgroundColor: trackColor        
      },vertical?{
        left:0,
        top:`${offsetRight}%`
      }:{
        top:0,
        right:`${offsetRight}%`
      });

      const thumbRightClass=this.classNames(classes.pointer,classes.pointerRight,
        disabled && classes.pointerDisabled,
        vertical && classes.pointerVertical,
        vertical && classes.pointerVerticalTop,
        this.activePointer==='right' && !disabled && (hover||pressed) && classes.pointerOver,
        this.activePointer==='right' && !disabled && hover && classes.pointerHover,
        this.activePointer==='right' && !disabled && pressed && classes.pointerPressed);

      trackEl=(<div>
        <div className={classes.track} style={trackLeftStyle}></div>
        <div className={classes.track} style={trackActiveStyle}></div>
        <div className={classes.track} style={trackRightStyle}></div>
      </div>)
      thumbEl= (<div>
        <div className={thumbLeftClass} 
          style={thumbLeftStyle}
          onMouseOver={()=>{this.activePointer='left'}}
          onTouchStart={()=>{this.activePointer='left'}}></div>
        <div className={thumbRightClass} 
          style={thumbRightStyle} 
          onMouseOver={()=>{this.activePointer='right'}}
          onTouchStart={()=>{this.activePointer='right'}}></div>
      </div>)
    }else{
      let offset = Math.round((value-min)/(max-min)*100);
      const trackActiveStyle=Object.assign({      
        backgroundColor: trackColor       
      },vertical?{
        width: '100%',        
        height: disabled ?  `calc(${offset}% - 6px)` : `calc(${offset}%)`, 
        marginTop: disabled ? 6 : 0,     
        bottom: 0
      }:{
        height: '100%',        
        width: disabled ?  `calc(${offset}% - 6px)` : `calc(${offset}%)`, 
        marginRight: disabled ? 6 : 0,     
        left: 0
      });

      const trackStyle=Object.assign({      
        backgroundColor: trackColor,
        opacity:'.38'
      },vertical?{
        width: '100%',        
        height: disabled ?  `calc(${100-offset}% - 6px)` : `calc(${100-offset}%)`,
        marginBottom: disabled ? 6 : 0, 
        top: 0
      }:{
        height: '100%',        
        width: disabled ?  `calc(${100-offset}% - 6px)` : `calc(${100-offset}%)`,
        marginLeft: disabled ? 6 : 0, 
        right: 0
      });

      const thumbStyle=Object.assign({        
        backgroundColor: trackColor       
      },vertical?{
        left:0,
        bottom:`${offset}%`
      }:{
        top:0,
        left:`${offset}%`
      });

      const thumbClass=this.classNames(classes.pointer,
        disabled && classes.pointerDisabled,
        vertical && classes.pointerVertical,
        !disabled && (hover||pressed)&&classes.pointerOver,
        !disabled && hover&&classes.pointerHover,pressed&&classes.pointerPressed);

      trackEl=(<div>
        <div className={classes.track} style={trackActiveStyle}></div>
        <div className={classes.track} style={trackStyle}></div>
      </div>)
      thumbEl = (<div className={thumbClass} style={thumbStyle}></div>)
    } 
    
    let scaleEl;
    if(scaleLength > 0 && scaleLength <(max - min)){
      let scaleCount =  Math.floor((max - min)/scaleLength);  
      const scaleArray =  Array.from(new Array(scaleCount + ((max - min)%scaleLength===0?1:2)),(val,index)=>index)   
      scaleEl=(<div>
        {
          scaleArray.map(i=>{
            const scaleValue = scaleLength * i + min;
            let scaleOffset = 0;
            if(i=== scaleArray.length-1){
              scaleOffset = 100;
            }else if(i > 0){
              scaleOffset = (1- (max - min)%scaleLength/(max - min))*100/scaleCount * i;
            }
            let scaleStyle = Object.assign({              
              backgroundColor: trackColor
            },vertical?{
              width: '100%',        
              height: 2,
              left:0,
              bottom: `${scaleOffset}%`,
            }:{
              height: '100%',        
              width: 2,
              top:0,
              left: `${scaleOffset}%`,
            });
            if((range && (scaleValue > value[0] && scaleValue < value[1])) ||(!range && scaleValue < value) ){
                Object.assign(scaleStyle,{
                  backgroundColor: 'rgba(255,255,255,.38)'
                })
            }
            return (<span key={i} className={classes.scale} style={scaleStyle}></span>)
          })
        }
      </div>)
    }

    return (
      <div className={this.className('slider')} style={this.style(rootStyle)}>
        <div className={classes.warp}
          ref={ container => this.container = container } 
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
          onMouseDown={this.handleMouseDown}  
          onTouchMove={this.handleChange }  
          onTouchStart={this.handleTouchStart }>
          <div style={containerStyle}>
            {trackEl}
            {scaleEl}
            {thumbEl}
          </div>
        </div>
      </div>
    )
  }
}

Slider.propTypes={
  min: PropTypes.number,
  max: PropTypes.number,
  defaultValue: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
  value: PropTypes.oneOfType([PropTypes.number,PropTypes.arrayOf(PropTypes.number)]),
  range: PropTypes.bool,
  scaleLength: PropTypes.number,
  direction : PropTypes.oneOf(['horizontal','vertical']),
  color: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onChangeComplete: PropTypes.func,
  leftLock: PropTypes.bool,
  rightLock: PropTypes.bool,
  leftMin: PropTypes.number
}

export default withStyles(styles,{withTheme:true})(Slider)
