export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class UnitPortrait extends React.Component<PropTypes, {}>
{
  displayName: "UnitPortrait";
  render: function()
  {
    var props: any = {};
    props.className = "unit-portrait " + (this.props.className || "");
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
}
