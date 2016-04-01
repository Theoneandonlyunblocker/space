export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class Resource extends React.Component<PropTypes, {}>
{
  displayName: "Resource";
  render: function()
  {
    var sign = this.props.income < 0 ? "-" : "+";
    return(
      React.DOM.div(
      {
        className: "resource",
        title: this.props.resource.displayName + ""
      },
        React.DOM.img(
        {
          className: "resource-icon",
          src: this.props.resource.icon
        },
          null
        ),
        React.DOM.div(
        {
          className: "resource-amount"
        },
          "" + this.props.amount + " (" + sign + this.props.income + ")"
        )
      )
    );
  }
}
