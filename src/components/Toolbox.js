import React, { Component } from 'react';

import { TwitterPicker as ColorPicker } from 'react-color';
import styles from './Toolbox.module.css';


export default function Toolbox({
  onChangeColor,
  currentColor,
}) {
  return (
    <div className={ styles.toolbox }>
      <ColorPicker
        color={ currentColor }
        triangle={ 'hide' }
        onChangeComplete={ onChangeColor }
      />
      <p>Ctrl+click to remove a cube.</p>
      <a href={'http://github.com/fatiherikli/voxel'}>Source code on github</a>
    </div>
  );
}
