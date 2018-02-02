import * as React from "react";


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
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const availableSrc = "img/icons/availableAction.png";
    const hoveredSrc = "img/icons/hoveredAction.png";
    const spentSrc = "img/icons/spentAction.png";

    const icons: React.ReactHTMLElement<any>[] = [];

    const availableCount = this.props.currentActionPoints - (this.props.hoveredActionPointExpenditure || 0);
    for (let i = 0; i < availableCount; i++)
    {
      icons.push(React.DOM.img(
        {
          src: availableSrc,
          className: "unit-action-point available-action-point",
          key: "available" + i,
        },
      ));
    }

    const hoveredCount = Math.min(this.props.hoveredActionPointExpenditure, this.props.currentActionPoints);

    for (let i = 0; i < hoveredCount; i++)
    {
      icons.push(React.DOM.img(
        {
          src: hoveredSrc,
          className: "unit-action-point hovered-action-point",
          key: "hovered" + i,
        },
      ));
    }

    const spentCount = this.props.maxActionPoints - this.props.currentActionPoints;
    for (let i = 0; i < spentCount; i++)
    {
      icons.push(React.DOM.img(
        {
          src: spentSrc,
          className: "unit-action-point spent-action-point",
          key: "spent" + i,
        },
      ));
    }

    return(
      React.DOM.div({className: "unit-action-points"},
        icons,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitActionsComponent);
export default Factory;
