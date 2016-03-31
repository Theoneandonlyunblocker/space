module Rance
{
  export module UIComponents
  {
    export var UnitPortrait = React.createFactory(React.createClass(
    {
      displayName: "UnitPortrait",
      render: function()
      {
        var props: any = this.props;
        props.className = "unit-portrait " + (props.className || "");
        if (this.props.imageSrc)
        {
          props.style = 
          {
            backgroundImage: 'url("' + this.props.imageSrc + '")'
          }
        }

        return(
          React.DOM.div(props,
            null
          )
        );
      }
    }));
  }
}
