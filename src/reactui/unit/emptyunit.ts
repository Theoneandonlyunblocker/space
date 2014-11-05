module Rance
{
  export module UIComponents
  {
    export var EmptyUnit = React.createClass(
    {
      render: function()
      {
        var data: any =
        {
          className: "unit-container unit-empty"
        };

        data.className += (this.props.facesLeft ? " faces-left" : " faces-right");
        
        return(
          React.DOM.div(data,
            null
          )
        );
      }
    });
  }
}