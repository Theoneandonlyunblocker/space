import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Flag} from "../../../../src/flag/Flag";

import {cachedAssets} from "../../assets";
import {PlayerFlag} from "../PlayerFlag";


export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  facingRight: boolean;
}

interface StateType
{
}

export class BattleSceneFlagComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "BattleSceneFlag";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.applyMask = this.applyMask.bind(this);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "battle-scene-flag-container" + (this.props.facingRight ? " facing-right" : " facing-left"),
      },
        PlayerFlag(
        {
          props:
          {
            className: "battle-scene-flag",
          },
          flag: this.props.flag,
          onUpdate: this.applyMask,
        }),
      )
    );
  }

  private applyMask(flagElement: HTMLDivElement): void
  {
    const maskId = this.props.facingRight ? "battle-scene-flag-fade-right" : "battle-scene-flag-fade-left";

    const gradientString = this.createBackgroundGradient();
    flagElement.style.backgroundColor = undefined;
    flagElement.style.background = gradientString;

    const fadeDocument = cachedAssets.battleSceneFlagFade;
    flagElement.insertBefore(fadeDocument, flagElement.firstChild);
    flagElement.classList.add(maskId);
  }
  private createBackgroundGradient(): string
  {
    const bgColor = this.props.flag.backgroundColor;

    const stops =
    [
      {stop: 0.0, alpha: 0.7},
      {stop: 0.6, alpha: 0.5},
      {stop: 0.8, alpha: 0.2},
      {stop: 1.0, alpha: 0.0},
    ];

    return `linear-gradient(${this.props.facingRight ? "to right" : "to left"}, ` +
      stops.map(stopData =>
      {
        const colorString = `rgba(${bgColor.get8BitRGB().join(", ")}, ${stopData.alpha})`;

        return `${colorString} ${Math.round(stopData.stop * 100)}%`;
      }).join(", ") +
    ")";
  }
}

export const BattleSceneFlag: React.Factory<PropTypes> = React.createFactory(BattleSceneFlagComponent);
