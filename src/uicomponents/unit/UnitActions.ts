/// <reference path="../../../lib/react-global.d.ts" />

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
  displayName: string = "UnitActions";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    var availableSrc = "img/icons/availableAction.png";
    var hoveredSrc = "img/icons/hoveredAction.png";
    var spentSrc = "img/icons/spentAction.png";

    var icons: React.ReactHTMLElement<any>[] = [];

    var availableCount = this.props.currentActionPoints - (this.props.hoveredActionPointExpenditure || 0);
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

    var hoveredCount = Math.min(this.props.hoveredActionPointExpenditure, this.props.currentActionPoints);

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

    var spentCount = this.props.maxActionPoints - this.props.currentActionPoints;
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
