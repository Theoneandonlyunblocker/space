import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";
import { NumberInput } from "modules/defaultui/src/uicomponents/generic/NumberInput";
import { CombatEffectPicker } from "./CombatEffectPicker";
import { activeModuleData } from "core/src/app/activeModuleData";
import { Unit } from "core/src/unit/Unit";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  triggerUpdate: () => void;
  selectedUnit: Unit;
}

const CombatEffectEditorComponent: React.FunctionComponent<PropTypes> = props =>
{
  const availableEffects = activeModuleData.templates.combatEffects.getAll();

  const [selectedEffect, setSelectedEffect] = React.useState<CombatEffectTemplate | null>(availableEffects[0]);
  const [effectStrength, setEffectStrength] = React.useState<number>(1);

  return(
    ReactDOMElements.div(
    {
      className: "combat-effect-editor",
    },
      CombatEffectPicker(
      {
        availableEffects: availableEffects,
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
          ReactDOMElements.button(
          {
            onClick: () =>
            {
              const effect = props.selectedUnit.battleStats.combatEffects.get(selectedEffect);
              effect.strength = effectStrength;
              props.triggerUpdate();
            }
          },
            "Set"
          ),
        ),
      ),
    )
  );
};

export const CombatEffectEditor: React.FunctionComponentFactory<PropTypes> = React.createFactory(CombatEffectEditorComponent);
