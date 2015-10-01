module Rance
{
  export module UIComponents
  {
    export var UnitExperience = React.createClass(
    {
      displayName: "UnitExperience",
      render: function()
      {
        var rows: ReactDOMPlaceHolder[] = [];

        var totalBars = Math.ceil(this.props.experienceToNextLevel) / 10;
        var filledBars = Math.ceil(this.props.experienceForCurrentLevel / 10);
        var lastBarWidth = (10 * (this.props.experienceForCurrentLevel % 10));

        for (var i = 0; i < totalBars; i++)
        {
          var bgProps: any =
          {
            className: "unit-experience-bar-point-background"
          };
          if (i < filledBars)
          {
            bgProps.className += " filled";

            if (i === filledBars - 1 && lastBarWidth !== 0)
            {
              bgProps.style =
              {
                width: "" +  lastBarWidth + "%"
              }
            }
          }
          else
          {
            bgProps.className += " empty";
          }

          rows.push(React.DOM.div(
          {
            className: "unit-experience-bar-point",
            key: "" + i
          },
            React.DOM.div(bgProps,
              null
            ),
            React.DOM.div(
            {
              className: "unit-experience-bar-point-markers"
            },
              null
            )
          ))
        }

        return(
          React.DOM.div(
          {
            className: "unit-experience-bar"
          },
            this.props.experienceForCurrentLevel,
            rows
          )
        );
      }
    })
  }
}
