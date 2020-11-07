//A singular editable talent

import React, { Component } from "react";

class Editable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: false,
    };
  }

  //Escape component with these keys
  onDown = (event) => {
    const keys = ["Escape", "Tab", "Enter"];
    if (keys.includes(event)) {
      this.setEditing(false);
    }
  };

  //Start editing a talent name
  setEditing = (event) => {
    this.setState({ editing: true });
  };

  //Stop editing a talent name
  setFinished = (event) => {
    this.setState({ editing: false });
    if (event.target.value === "") {
      this.props.removeHandler(this.props.id);
    }
  };

  render() {
    //Only editable if hovering or selected
    if (this.state.editing) {
      return (
        <div
          style={{ margin: 20 }}
          onBlur={this.setFinished}
          onKeyDown={this.onDown}
          onMouseLeave={this.setFinished}
        >
          <input
            name="talent"
            type="text"
            value={this.props.text}
            onChange={(event) => this.props.onChange(event, this.props.id)}
          />
        </div>
      );
    } else {
      return (
        <div
          style={{ margin: 20 }}
          onClick={this.setEditing}
          onMouseEnter={this.setEditing}
        >
          <label>{this.props.text}</label>
        </div>
      );
    }
  }
}

export default Editable;
