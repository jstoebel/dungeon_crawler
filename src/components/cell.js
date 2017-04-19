var Cell = React.createClass({

  render: function(){
    var bOut = this.props.blackOut ? " blackout " : ""
    return(<div className={"cell " + this.props.type + bOut }/> )

  } // end render

})
