/// <reference path="../../playertechnology.ts" />

/// <reference path="technology.ts" />

export interface PropTypes
{
  playerTechnology: PlayerTechnology;
}

export default class TechnologiesList extends React.Component<PropTypes, Empty>
{
  displayName: "TechnologiesList",
  updateListener: undefined,


  componentDidMount: function()
  {
    this.updateListener = eventManager.addEventListener(
      "builtBuildingWithEffect_research", this.forceUpdate.bind(this));
  },

  componentWillUnmount: function()
  {
    eventManager.removeEventListener("builtBuildingWithEffect_research", this.updateListener);
  },
  render: function()
  {
    var playerTechnology: PlayerTechnology = this.props.playerTechnology;
    
    var researchSpeed = playerTechnology.getResearchSpeed();
    var rows: ReactComponentPlaceHolder[] = [];

    for (var key in playerTechnology.technologies)
    {
      rows.push(UIComponents.Technology(
      {
        playerTechnology: playerTechnology,
        technology: playerTechnology.technologies[key].technology,
        researchPoints: researchSpeed,
        key: key
      }));
    }

    return(
      React.DOM.div(
      {
        className: "technologies-list-container"
      },
        React.DOM.div(
        {
          className: "technologies-list"
        },
          rows
        ),
        React.DOM.div(
        {
          className: "technologies-list-research-speed"
        },
          "Research speed: " + researchSpeed + " per turn"
        )
      )
    );
  }
}
