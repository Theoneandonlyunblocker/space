import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { NumberInput } from "modules/defaultui/src/uicomponents/generic/NumberInput";
import { CombatEffectPicker } from "./CombatEffectPicker";
import { activeModuleData } from "core/src/app/activeModuleData";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{

}

const CombatEffectEditorComponent: React.FunctionComponent<PropTypes> = props =>
{
  const [selectedEffect, setSelectedEffect] = React.useState<CombatEffectTemplate | null>(null);
  const [effectStrength, setEffectStrength] = React.useState<number>(1);

  const allCombatEffects = Object.keys(activeModuleData.templates.combatEffects).map(key =>
  {
    return activeModuleData.templates.combatEffects[key];
  });

  return(
    ReactDOMElements.div(
    {
      className: "combat-effect-editor",
    },
      CombatEffectPicker(
      {
        availableEffects: allCombatEffects,
        effectStrength: effectStrength,
        onChange: effect =>
        {
          setSelectedEffect(effect);
        },
      }),
      ReactDOMElements.div(
      {
        className: "combat-effect-details",
      },
        ReactDOMElements.div(
        {
          className: "selected-combat-effect-name",
          title: selectedEffect ? selectedEffect.getDescription(effectStrength) : "",
        },
          selectedEffect ? selectedEffect.getDisplayName(effectStrength) : "",
        ),
        ReactDOMElements.div(
        {
          className: "selected-combat-effect-strength",
        },
          ReactDOMElements.div(
          {
            className: "selected-combat-effect-strength-label",
          },
            "Effect strength"
          ),
          NumberInput(
          {
            attributes:
            {
              className: "selected-combat-effect-strength-amount",
            },
            value: effectStrength,
            onChange: setEffectStrength,
            step: 1,
            min: selectedEffect?.limit?.min,
            max: selectedEffect?.limit?.max,
          }),
        ),
      ),
    )
  );
};

export const CombatEffectEditor: React.FunctionComponentFactory<PropTypes> = React.createFactory(CombatEffectEditorComponent);
