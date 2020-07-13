import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { CombatEffectTemplate } from "core/src/combat/CombatEffectTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  availableEffects: CombatEffectTemplate[];
  effectStrength: number;
  onChange: (selected: CombatEffectTemplate) => void;
}

const CombatEffectPickerComponent: React.FunctionComponent<PropTypes> = props =>
{
  const sortedAvailableEffects = props.availableEffects.sort((a, b) =>
  {
    const alphabetSort = a.getDisplayName(0).localeCompare(b.getDisplayName(props.effectStrength));
    if (alphabetSort)
    {
      return alphabetSort;
    }
    else
    {
      return a.key.localeCompare(b.key);
    }
  });

  return(
    ReactDOMElements.select(
    {
      className: "combat-effect-picker",
      size: sortedAvailableEffects.length,
      onChange: e =>
      {
        const key = e.target.value;
        // using Array.find() isnt great performance wise but doesnt matter here
        const effectTemplate = sortedAvailableEffects.find(effect => effect.key === key);

        props.onChange(effectTemplate);
      },
    },
      sortedAvailableEffects.map(effect => ReactDOMElements.option(
      {
        className: "combat-effect-picker-item",
        value: effect.key,
        key: effect.key,
      },
        effect.getDisplayName(props.effectStrength),
      )),
    )
  );
};

export const CombatEffectPicker: React.FunctionComponentFactory<PropTypes> = React.createFactory(CombatEffectPickerComponent);
