import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { CombatEffect } from "core/src/combat/CombatEffect";
import { getAssetSrc } from "modules/defaultui/assets/assets";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  effects: CombatEffect[];
}

const UnitCombatEffectsComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.div(
    {
      className: "unit-combat-effects",
    },
      props.effects.map(effect =>
      {
        return ReactDOMElements.img(
        {
          key: effect.id,
          className: "unit-combat-effects-icon",
          src: getAssetSrc("availableActionPoint"),
          title: effect.description,
        });
      }),
    )
  );
};

export const UnitCombatEffects: React.FunctionComponentFactory<PropTypes> = React.createFactory(UnitCombatEffectsComponent);
