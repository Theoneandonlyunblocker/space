module Rance
{
  export module UIComponents
  {
    export var OptionsGroup = React.createClass(
    {
      displayName: "OptionsGroup",
      render: function()
      {
        var rows = [];

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

        var resetButton = null;
        if (this.props.resetFN)
        {
          resetButton = React.DOM.button(
          {
            className: "reset-options-button",
            onClick: this.props.resetFN
          }, "reset")
        }

        var header = this.props.header || resetButton ?
          React.DOM.div({className: "option-group-header"},
            this.props.header,
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
    });
  }
}
