# Slider for Material-UI 1.0.0

## Installation

``` bash
  //with yarn
  yarn add material-ui-slider
  //with npm 
  npm install material-ui-slider --save
```

## Usage

Here's a quick example to get you started:

``` jsx
  import React from 'react';
  import ReactDOM from 'react-dom';
  import { Slider } from 'material-ui-slider';

  function App() {
    return (
      <Slider defaultValue={10}></Slider>
    );
  }

  ReactDOM.render(<App />, document.querySelector('#app'));
```

## Prpos

 name | type | default | description
 ---- | ---- | ------- | -----------
 min | number | 0 | min value in process bar.
 max | number | 100 | max value in process bar.
 defaultValue | number/array[number,number] | 0/[0,100] | default value, value must be between min and max.
 value | number/array[number,number] | / | value in process bar.
 range | bool | false |  range choose, "defaultValue" must be an array
 scaleLength | number | 0 | scale choose, value "0" means "no scale", "defaultValue" must be a multiple of "scaleLength".
 direction | horizontal/vertical | horizontal | 
 color | string |  | custom color for process bar, support HEX, RGB(RGBA), HSL
 disabled | bool | false |
 onChange | func |  | Callback fired when the value is changed.<br>__Signature:__ <br> function(value: number/array[number,number]) => void
 onChangeComplete | func |  | Callback fired when the value is changed completely.<br>__Signature:__ <br> function(value: number/array[number,number]) => void

## Update 

> v3.0.0
* Upgrade peerDependencies "@material-ui/core" to be "^3.0.0"
* Remove some unnessesary files from package

> v0.1.11
* Allow dynamic update to min/max value

> v0.1.0
* Added prop "value".


## LICENSE
[MIT](https://choosealicense.com/licenses/mit/)