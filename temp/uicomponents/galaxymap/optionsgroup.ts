export interface PropTypes
{
  isCollapsedInitially?: boolean;
  resetFN?: reactTypeTODO_func;
  header?: string;
  options: reactTypeTODO_object[];
}

export default class OptionsGroup extends React.Component<PropTypes, {}>
{
  displayName: "OptionsGroup",


  getInitialState: function()
  {
    return(
    {
      isCollapsed: this.props.isCollapsedInitially || false
    });
  },
  
  toggleCollapse: function()
  {
    this.setState(
    {
      isCollapsed: !this.state.isCollapsed
    });
  },

  render: function()
  {
    var rows: ReactDOMPlaceHolder[] = [];

    if (!this.state.isCollapsed)
    {
      for (var i = 0; i < this.props.options.length; i++)
      {
        var option = this.props.options[i];

        rows.push(React.DOM.div(
        {
          className: "option-container",
          key: option.key
        },
          option.content
        ));
      }
    }

    var resetButton: ReactDOMPlaceHolder = null;
    if (this.props.resetFN)
    {
      resetButton = React.DOM.button(
      {
        className: "reset-options-button",
        onClick: this.props.resetFN
      }, "reset")
    }

    var header = this.props.header || resetButton ?
      React.DOM.div(
      {
        className: "option-group-header"
      },
        React.DOM.div(
        {
          className: "option-group-header-title collapsible" + (this.state.isCollapsed ? " collapsed" : ""),
          onClick: this.toggleCollapse
        },
          this.props.header
        ),
        resetButton
      ) :
      null

    return(
      React.DOM.div({className: "option-group"},
        header,
        rows
      )
    );
  }
}
