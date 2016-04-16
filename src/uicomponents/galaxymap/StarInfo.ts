/// <reference path="../../../lib/react-global-0.13.3.d.ts" />


import DefenceBuildingList from "./DefenceBuildingList";
import Options from "../../Options";
import Star from "../../Star";


interface PropTypes extends React.Props<any>
{
  selectedStar: Star;
}

interface StateType
{
}

export class StarInfoComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "StarInfo";
  shouldComponentUpdate(newProps: PropTypes)
  {
    return this.props.selectedStar !== newProps.selectedStar;
  }
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var star = this.props.selectedStar;
    if (!star) return null;

    var dumpDebugInfoButton: React.HTMLElement = null;

    if (Options.debugMode)
    {
      dumpDebugInfoButton = React.DOM.button(
      {
        className: "star-info-dump-debug-button",
        onClick: function(e)
        {
          console.log(star);
          console.log(star.mapGenData)
        }
      },
        "Debug"
      )
    }
    
    return(
      React.DOM.div(
      {
        className: "star-info"
      },
        React.DOM.div(
        {
          className: "star-info-name"
        },
          star.name
        ),
        React.DOM.div(
        {
          className: "star-info-owner"
        },
          star.owner ? star.owner.name : null
        ),
        dumpDebugInfoButton,
        React.DOM.div(
        {
          className: "star-info-location"
        },
          "x: " + star.x.toFixed() +
          " y: " + star.y.toFixed()
        ),
        React.DOM.div(
        {
          className: "star-info-income"
        },
          "Income: " + star.getIncome()
        ),
        DefenceBuildingList(
        {
          buildings: star.buildings["defence"]
        })
        
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(StarInfoComponent);
export default Factory;
