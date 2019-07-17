import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import {options} from "../../../../src/Options";
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
      displayName: localize("beforeAbility")(),
      min: 0,
      max: 5000,
      step: 100,
    },
    {
      key: "effectDuration",
      displayName: localize("abilityEffectDuration")(),
      min: 0,
      max: 10,
      step: 0.1,
    },
    {
      key: "after",
      displayName: localize("afterAbility")(),
      min: 0,
      max: 5000,
      step: 100,
    },
    {
      key: "unitEnter",
      displayName: localize("unitEnter")(),
      min: 0,
      max: 1000,
      step: 50,
    },
    {
      key: "unitExit",
      displayName: localize("unitExit")(),
      min: 0,
      max: 1000,
      step: 50,
    },
    {
      key: "turnTransition",
      displayName: localize("turnTransition")(),
      min: 0,
      max: 2000,
      step: 100,
    },
  ]);
}

export class BattleOptionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "BattleOptions";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "battle-options",
      },
        OptionsGroup(
        {
          headerTitle: localize("battleAnimationTiming")(),
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
