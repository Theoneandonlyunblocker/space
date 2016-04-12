/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="unitstrength.ts"/>

export interface PropTypes extends React.Props<any>
{
  currentActionPoints: any; // TODO refactor | define prop type 123
  hoveredActionPointExpenditure: any; // TODO refactor | define prop type 123
  maxActionPoints: any; // TODO refactor | define prop type 123
}

interface StateType
{
}

export class UnitActions_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitActions";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var availableSrc = "img\/icons\/availableAction.png";
    var hoveredSrc = "img\/icons\/spentAction.png";
    var spentSrc = "img\/icons\/spentAction.png";

    var icons: React.HTMLElement[] = [];

    var availableCount = this.props.currentActionPoints - this.props.hoveredActionPointExpenditure;
    for (var i = 0; i < availableCount; i++)
    {
      icons.push(React.DOM.img(
        {
          src: availableSrc,
          className: "unit-action-point available-action-point",
          key: "available" + i
        }
      ));
    }

    var hoveredCount = Math.min(this.props.hoveredActionPointExpenditure, this.props.currentActionPoints);

    for (var i = 0; i < hoveredCount; i++)
    {
      icons.push(React.DOM.img(
        {
          src: hoveredSrc,
          className: "unit-action-point hovered-action-point",
          key: "hovered" + i
        }
      ));
    }

    var spentCount = this.props.maxActionPoints - this.props.currentActionPoints;
    for (var i = 0; i < spentCount; i++)
    {
      icons.push(React.DOM.img(
        {
          src: spentSrc,
          className: "unit-action-point spent-action-point",
          key: "spent" + i
        }
      ));
    }

    return(
      React.DOM.div({className: "unit-action-points"},
        icons
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitActions_COMPONENT_TODO);
export default Factory;
