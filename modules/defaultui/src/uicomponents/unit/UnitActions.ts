import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { getAssetSrc } from "modules/defaultui/assets/assets";


export interface PropTypes extends React.Props<any>
{
  currentActionPoints: number;
  maxActionPoints: number;
  hoveredActionPointExpenditure?: number;
}

interface StateType
{
}

export class UnitActionsComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "UnitActions";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    const icons: React.ReactHTMLElement<any>[] = [];

    const availableCount = this.props.currentActionPoints - (this.props.hoveredActionPointExpenditure || 0);
    for (let i = 0; i < availableCount; i++)
    {
      icons.push(ReactDOMElements.img(
        {
          src: getAssetSrc("availableActionPoint"),
          className: "unit-action-point available-action-point",
          key: "available" + i,
        },
      ));
    }

    const hoveredCount = Math.min(this.props.hoveredActionPointExpenditure, this.props.currentActionPoints);

    for (let i = 0; i < hoveredCount; i++)
    {
      icons.push(ReactDOMElements.img(
        {
          src: getAssetSrc("hoveredActionPoint"),
          className: "unit-action-point hovered-action-point",
          key: "hovered" + i,
        },
      ));
    }

    const spentCount = this.props.maxActionPoints - this.props.currentActionPoints;
    for (let i = 0; i < spentCount; i++)
    {
      icons.push(ReactDOMElements.img(
        {
          src: getAssetSrc("spentActionPoint"),
          className: "unit-action-point spent-action-point",
          key: "spent" + i,
        },
      ));
    }

    return(
      ReactDOMElements.div({className: "unit-action-points"},
        icons,
      )
    );
  }
}

export const UnitActions: React.Factory<PropTypes> = React.createFactory(UnitActionsComponent);
