# Usage

Here's a quick example to get you started:

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Slider } from "material-ui-slider";

function App() {
  return <Slider defaultValue={10} />;
}

ReactDOM.render(<App />, document.querySelector("#app"));
```

### basic

::: demo

```javascript
  render() {
    return <div style={{width:768,maxWidth:'100%'}}>
      <Slider/>
    </div>
  }
```

:::

### defaultValue

"defaultValue" must be between min and max

::: demo use prop `defaultValue` to set default value.

```javascript
  render() {
    return <div style={{width:768,maxWidth:'100%'}}>
      <Slider defaultValue={50}/>
    </div>
  }
```

:::

### value

change slider bar's value

::: demo use prop `value` to change value.

```javascript
  constructor(props) {
    super(props);

    this.state = {
      value: 50
    };
  }

  handleChangeComplete(val){
    this.setState({
      value: val
    })
  }

  render() {
    const { value } = this.state;
    return <div style={{width:768,maxWidth:'100%'}}>
      <span>Value:{value}</span>
      <Slider defaultValue={value} onChangeComplete={this.handleChangeComplete.bind(this)}/>
      <Slider color="#bf4040" value={this.state.value}/>
      <Slider color="#39ADBD" range value={[this.state.value,80]}/>
    </div>
  }
```

:::

### disabled

disable slider bar

::: demo

```javascript
  render() {
    return <div style={{width:768,maxWidth:'100%'}}>
      <Slider defaultValue={50} disabled/>
      <Slider defaultValue={[50,80]} disabled range/>
    </div>
  }
```

:::

### decimals

number of decimal places for value

::: demo use prop `decimals` to set number of decimal places.

```javascript
 constructor(props) {
    super(props);

    this.state = {
      value1: 0,
      value2: 0,
    };
  }

   handleChange(val){
    this.setState({
      value1: val
    })
  }

  handleChangeComplete(val){
    this.setState({
      value2: val
    })
  }
  render() {
    const { value1, value2 } = this.state;
    return <div style={{width:768,maxWidth:'100%'}}>
      <span>Value:{value1}</span>
      <Slider  max={10} decimals={2} onChange={this.handleChange.bind(this)}/>
       <span>Value:{value2}</span>
      <Slider  max={10} scaleLength={0.5} onChangeComplete={this.handleChangeComplete.bind(this)}/>
    </div>
  }
```

:::

### color

set slider bar's color

::: demo use prop `color` to set different color.

```javascript
  render() {
    return <div style={{width:768,maxWidth:'100%'}}>
      <Slider color="#bf4040" defaultValue={50}/>
    </div>
  }
```

:::

### min / max

default min is 0, default max is 100

::: demo use prop `min/max` to set selection range.

```javascript
  render() {
    return <div style={{width:768,maxWidth:'100%'}}>
      <Slider color="#bf4040" defaultValue={0} min={-50} max={50}/>
    </div>
  }
```

:::

### range

range choose, "defaultValue" must be an array with two params and between min and max

::: demo use prop `range` to set range selection .

```javascript
  render() {
    return <div style={{width:768,maxWidth:'100%'}}>
      <Slider color="#bf4040" defaultValue={[50,80]} range/>
    </div>
  }
```

:::

### scaleLength

scale choose, value "0" means "no scale", "defaultValue" must be a multiple of "scaleLength".

::: demo

```javascript
  render() {
    return <div style={{width:768,maxWidth:'100%'}}>
      <Slider color="#bf4040" defaultValue={40} scaleLength={20}/>
      <Slider color="#bf4040" defaultValue={[40,80]} range scaleLength={20}/>
    </div>
  }
```

:::

### direction

::: demo

```javascript
  render() {
    return <div style={{height:200}}>
      <Slider direction="vertical" defaultValue={100}/>
      <Slider direction="vertical" defaultValue={[30,50]} disabled range/>
      <Slider direction="vertical" color="#bf4040" defaultValue={0} min={-50} max={50}/>
      <Slider direction="vertical" color="#bf4040" defaultValue={[50,80]} range/>
      <Slider direction="vertical" color="#39ADBD" defaultValue={40} scaleLength={20}/>
      <Slider direction="vertical" color="#39ADBD" defaultValue={[40,80]} range scaleLength={20}/>
    </div>
  }
```

:::
