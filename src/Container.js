import React, { Component } from 'react';

import Layout from './components/Layout.js';
import Perspective from './components/Perspective.js';
import Toolbox from './components/Toolbox.js';

import { dimensions } from './constants';
import { initialPreset } from './utils';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.startStretch = this.startStretch.bind(this);
    this.handleStretch = this.handleStretch.bind(this);
    this.stopStretch = this.stopStretch.bind(this);
    this.handleChangeColor = this.handleChangeColor.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.startDragView = this.startDragView.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);

    this.state = {
      stretch: false,
      color: '#E76EFF',
      cubes: initialPreset(),
      preview: [],
      rotation: {
        x: 45,
        z: 45,
      },
    };
  }

  distance(startCoords, targetCoords, dimension) {
    switch (dimension) {
      case dimensions.Z:
        return Math.floor(
          (startCoords.y - targetCoords.y) / 3
      );

      case dimensions.X:
        return Math.floor(
          (targetCoords.x - startCoords.x) / 3
      );

      case dimensions.Y:
        return Math.floor(
          (targetCoords.y - startCoords.y) / 3
      );
    }
  }

  handleRotation(event) {
    const [initialX, initialY] = this.state.initialViewCoords;
    this.setState({
      rotation: {
        x: this.state.initialRotation.x + (
          event.clientY - initialY
        ) * -1,
        z: this.state.initialRotation.z + (
          event.clientX - initialX
        ) * -1
      }
    });
  }

  handleStretch(event) {
    const cubes = this.distance(this.state.startCoords, {
      x: event.clientX,
      y: event.clientY,
    }, this.state.dimension);

    const [x, y, z] = this.state.canvasCoords;
    
    const preview = new Array(
      cubes > 0 ? cubes : 0
    ).fill(
      undefined
    ).map(
      (value, index) => {
        switch (this.state.dimension) {
          case dimensions.Z:
            return [x, y, z + index + 1];

          case dimensions.X:
            return [x + index + 1, y, z];

          case dimensions.Y:
            return [x, y + index + 1, z];
        }
      }
    ).map(
      (value) => [...value, this.state.color]
    );

    this.setState({
      preview,
    });
  }

  handleMouseMove(event) {
    if (this.state.dragging) {
      this.handleRotation(event);
    } else if (this.state.stretch) {
      this.handleStretch(event);
    }
  }

  startStretch(x, y, z, dimension) {
    return (event) => {
      this.setState({
        stretch: !this.state.stretch,
        startCoords: {
          x: event.clientX,
          y: event.clientY,
        },
        canvasCoords: [x, y, z],
        dimension,
      });

      event.stopPropagation();
      event.preventDefault();
      event.cancelBubble = true;
      event.returnValue = false;
    }
  }

  stopDrag() {
    this.setState({
      dragging: false,
    });
  }

  removeCurrent(event) {
    const {
      cubes,
      canvasCoords
    } = this.state;

    const [startX, startY, startZ] = canvasCoords;

    this.setState({
      stretch: false,
      cubes: cubes.filter(
        ([x, y, z]) => !(
          x === startX &&
          y === startY &&
          z === startZ
        )
      )
    });
  }

  pushFromPreviews() {
    let { preview } = this.state;
    const {
      cubes,
      dimension,
      canvasCoords: [x, y, z],
      color
    } = this.state;

    if (!preview.length) {
      preview = [(
        () => {
          switch (dimension) {
            case dimensions.Z:
              return [x, y, z + 1, color];

            case dimensions.X:
              return [x + 1, y, z, color];

            case dimensions.Y:
              return [x, y + 1, z, color];
          }
        }
      )()];
    }

    this.setState({
      stretch: false,
      preview: [],
      cubes: [
        ...cubes,
        ...preview,
      ],
    });
  }

  stopStretch(event) {
    if (this.state.dragging) {
      this.stopDrag(event);
    } else if (this.state.removing) {
      this.removeCurrent(event);
    } else if (this.state.canvasCoords) {
      this.pushFromPreviews(event);
    }
  }

  handleChangeColor({ hex }) {
    this.setState({
      color: hex
    });
  }

  handleKeyDown(event) {
    this.setState({
      removing: event.key === 'Control',
    });
  }

  handleKeyUp(event) {
    this.setState({
      removing: false,
      dragging: false,
      stretch: false,
    });
  }

  componentDidMount() {
    document.body.addEventListener('keydown', this.handleKeyDown);
    document.body.addEventListener('keyup', this.handleKeyUp);
    document.body.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.handleKeyDown);
    document.body.removeEventListener('keyup', this.handleKeyUp);
    document.body.removeEventListener('mousemove', this.handleMouseMove);
  }

  startDragView(event) {
    this.setState({
      dragging: true,
      initialViewCoords: [event.clientX, event.clientY],
      initialRotation: this.state.rotation,
    });
  }

  render() {
    const {
      cubes, preview, color, rotation,
    } = this.state;
    return (
      <Layout>
        <Toolbox
          currentColor={ color }
          onChangeColor={ this.handleChangeColor }
        />
        <Perspective
          cubes={ cubes }
          preview={ preview }
          rotation={ rotation }
          onStretchStart={ this.startStretch }
          onStretchStop={ this.stopStretch }
          onStartDragView={ this.startDragView }
        />
      </Layout>
    );
  }
}
