import React, { Component } from 'react';
import '../style.css'

class Cell extends Component {

  render() {
    var bOut = this.props.blackOut ? " blackout " : ""
    return(<div className={"cell " + this.props.type + bOut }/> )

  } // end render

}

export default Cell;
