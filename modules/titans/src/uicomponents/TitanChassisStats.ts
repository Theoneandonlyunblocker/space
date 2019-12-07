import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { UnitAttributes, getAttributeKeysSortedForDisplay } from "core/src/unit/UnitAttributes";
import { localize as localizeGeneric } from "modules/defaultui/localization/localize";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  health: {min: number; max: number};
  attributes: {min: UnitAttributes; max: UnitAttributes};
}

function renderProperty(props:
{
  className: string;
  title: string;
  min: number;
  max: number;
})
{
  return(
    ReactDOMElements.div(
    {
      className: props.className,
      key: props.title,
    },
      ReactDOMElements.span(
      {
        className: "titan-chassis-stats-property-title",
      },
        props.title,
      ),
      ReactDOMElements.span(
      {
        className: "titan-chassis-stats-property-amount",
      },
        props.min,
      ),
      props.min === props.max ? null :
        ReactDOMElements.span(
        {
          className: "titan-chassis-stats-divider",
        },
          "-",
        ),
      props.min === props.max ? null :
        ReactDOMElements.span(
        {
          className: "titan-chassis-stats-property-amount",
        },
          props.max,
        ),
    )
  );
}

const TitanChassisStatsComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.div(
    {
      className: "titan-chassis-stats",
    },
      renderProperty(
      {
        className: "titan-chassis-stats-health",
        title: localizeGeneric("unitStrength").toString(),
        min: props.health.min,
        max: props.health.max,
      }),
      getAttributeKeysSortedForDisplay().map(attribute => renderProperty(
      {
        className: `titan-chassis-stats-${attribute}`,
        title: localizeGeneric(attribute).toString(),
        min: props.attributes.min[attribute],
        max: props.attributes.max[attribute],
      }))
    )
  );
};

export const TitanChassisStats: React.FunctionComponentFactory<PropTypes> = React.createFactory(TitanChassisStatsComponent);
