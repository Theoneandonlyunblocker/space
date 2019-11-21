import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Manufactory } from "core/src/production/Manufactory";
import { TitanChassisTemplate } from "../TitanChassisTemplate";
import { Player } from "core/src/player/Player";
import { TitanChassisList } from "./TitanChassisList";
import { TitanChassisInfo } from "./TitanChassisInfo";
// import { getBuildableChassis } from "../getBuildableChassis";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  player: Player;
  manufactory: Manufactory;
}

const TitanAssemblingOverviewComponent: React.FunctionComponent<PropTypes> = props =>
{
  const [selectedChassis, setSelectedChassis] = React.useState<TitanChassisTemplate>(undefined);

  return(
    ReactDOMElements.div(
    {
      className: "titan-assembling-overview",
    },
      ReactDOMElements.div(
      {
        className: "titan-chassis-list",
      },
        TitanChassisList(
        {
          // TODO 2019.11.19 |
          // displayedChassis: getBuildableChassis(props.manufactory),
          displayedChassis: props.manufactory.getManufacturableUnits(),
          onSelect: setSelectedChassis,
        }),
      ),
      ReactDOMElements.div(
      {
        className: "titan-assembling-info",
      },
        !selectedChassis ? null :
          TitanChassisInfo(
          {
            template: selectedChassis
          }),
      )
    )
  );
};

export const TitanAssemblingOverview: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanAssemblingOverviewComponent);
