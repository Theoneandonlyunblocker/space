import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";
import {options} from "core/src/app/Options";
import {OptionsGroup} from "./OptionsGroup";
import {OptionsNumericField} from "./OptionsNumericField";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{

}

interface StateType
{
}

function getBattleAnimationStages()
{
  return(
  [
    {
      key: "before",
      displayName: localize("beforeAbility").toString(),
      min: 0,
      max: 5000,
      step: 100,
    },
    {
      key: "effectDuration",
      displayName: localize("abilityEffectDuration").toString(),
      min: 0,
      max: 10,
      step: 0.1,
    },
    {
      key: "after",
      displayName: localize("afterAbility").toString(),
      min: 0,
      max: 5000,
      step: 100,
    },
    {
      key: "unitEnter",
      displayName: localize("unitEnter").toString(),
      min: 0,
      max: 1000,
      step: 50,
    },
    {
      key: "unitExit",
      displayName: localize("unitExit").toString(),
      min: 0,
      max: 1000,
      step: 50,
    },
    {
      key: "turnTransition",
      displayName: localize("turnTransition").toString(),
      min: 0,
      max: 2000,
      step: 100,
    },
  ]);
}

export class BattleOptionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattleOptions";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "battle-options",
      },
        OptionsGroup(
        {
          headerTitle: localize("battleAnimationTiming").toString(),
          options: getBattleAnimationStages().map(stage =>
          {
            const key = stage.key;

            return(
            {
              key: stage.key,
              content: OptionsNumericField(
              {
                label: stage.displayName,
                id: "options-battle-animation-" + key,
                value: options.battle.animationTiming[key],
                min: stage.min,
                max: stage.max,
                step: stage.step,
                onChange: (value: number) =>
                {
                  options.battle.animationTiming[key] = value;
                  this.forceUpdate();
                },
              }),
            });
          }),
          resetFN: () =>
          {
            options.setDefaultForCategory("battle.animationTiming");
            this.forceUpdate();
          },
        }),
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const BattleOptions: React.Factory<PropTypes> = React.createFactory(BattleOptionsComponent);
