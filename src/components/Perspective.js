import React, { Component } from 'react';

import styles from './Perspective.module.css';

import { dimensions } from '../constants';

export default function Perspective({ 
  cubes,
  preview,
  onStretchMove,
  onStretchStop,
  onStretchStart,
  onStartDragView,
  rotation,
}) {
  return (
    <div
      className={ styles.perspective }
      onMouseMove={ onStretchMove }
      tabIndex={ 1 }
      onMouseUp={ onStretchStop }
      onMouseDown={ onStartDragView }
      onContextMenu={ (e) => e.preventDefault() }
      style={{
        WebkitTransform: `rotateX(${rotation.x}deg) rotateZ(${rotation.z}deg)`
      }}
    >
       { cubes.map(([x, y, z, color], index) => (
        <div key={ index }>
          <div className={ styles.cube } style={{
              left: `${x}em`,
              top: `${y}em`,
              WebkitTransform: `translateZ(${z + 1}em)`,
              background: color,
            }}>
            <div
              style={{ background: color }}
              className={ styles.cubeRight }
              onMouseDown={ onStretchStart(x, y, z, dimensions.X) }
            ></div>
            <div
              style={{ background: color }}
              className={ styles.cubeTop }
              onMouseDown={ onStretchStart(x, y, z, dimensions.Z) }
            ></div>
            <div
              style={{ background: color }}
              className={ styles.cubeLeft }
              onMouseDown={ onStretchStart(x, y, z, dimensions.Y) }
            ></div>
          </div>
        </div>
        )) }

        { preview.map(([x, y, z, color], index) => (
          <div key={ `preview-${index}` }>
            <div className={ `${styles.cube} ${styles.preview}` } style={{
                left: `${x}em`,
                top: `${y}em`,
                WebkitTransform: `translateZ(${z + 1}em)`,
                background: color,
              }}>
              <div
                style={{ background: color }}
                className={ styles.cubeRight }
              ></div>
              <div
                style={{ background: color }}
                className={ styles.cubeTop }
              ></div>
              <div
                style={{ background: color }}
                className={ styles.cubeLeft }
              ></div>
            </div>
          </div>
        )) }
    </div>
  );
}
