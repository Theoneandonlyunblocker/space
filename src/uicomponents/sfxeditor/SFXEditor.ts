import * as React from "react";
/// <reference path="../../../lib/pixi.d.ts" />

import Beam from "../../../modules/common/battlesfxfunctions/sfxfragments/Beam";
import FocusingBeam from "../../../modules/common/battlesfxfunctions/sfxfragments/FocusingBeam";
import LightBurst from "../../../modules/common/battlesfxfunctions/sfxfragments/LightBurst";
import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";
import ShockWave from "../../../modules/common/battlesfxfunctions/sfxfragments/ShockWave";

// import UnitTemplate from "../../templateinterfaces/UnitTemplate";
import
{
  clamp,
} from "../../utility";

import
{
  default as SFXEditorDisplay,
  SFXEditorDisplayComponent,
} from "./SFXEditorDisplay";
import SFXEditorSelection from "./SFXEditorSelection";
import SFXFragmentConstructor from "./SFXFragmentConstructor";


const availableFragmentConstructors: SFXFragmentConstructor[] =
[
  {
    key: "shockWave",
    displayName: "ShockWave",
    constructorFN: ShockWave,
  },
  {
    key: "lightBurst",
    displayName: "LightBurst",
    constructorFN: LightBurst,
  },
  {
    key: "beam",
    displayName: "Beam",
    constructorFN: Beam,
  },
  {
    key: "foucsingBeam",
    displayName: "FocusingBeam",
    constructorFN: FocusingBeam,
  },
];

function AlphabeticallyByProp<T>(a2: T, b2: T, props: string[]): number
{
  for (let i = 0; i < props.length; i++)
  {
    const prop = props[i];
    const a = a2[prop].toLowerCase();
    const b = b2[prop].toLowerCase();

    if (a < b)
    {
      return -1;
    }
    else if (a > b)
    {
      return 1;
    }
  }

  return 0;
}

availableFragmentConstructors.sort((a, b) =>
{
  return AlphabeticallyByProp(a, b, ["displayName", "key"]);
});

interface PropTypes extends React.Props<any>
{
  // availableUnitTemplates: UnitTemplate[];
}

interface StateType
{
  isPlaying?: boolean;
  currentTime?: number;
  SFXDuration?: number;

  selectedFragment?: SFXFragment<any>;
  draggingFragment?: SFXFragment<any>;
}

export class SFXEditorComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXEditor";
  state: StateType;

  lastAnimationTickTime: number;
  animationHandle: number;

  display: SFXEditorDisplayComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isPlaying: false,
      currentTime: 0,
      SFXDuration: 1000,
    };

    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeSFXDuration = this.handleChangeSFXDuration.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.handleFragmentConstructorDragStart = this.handleFragmentConstructorDragStart.bind(this);
    this.handleFragmentConstructorDragEnd = this.handleFragmentConstructorDragEnd.bind(this);
    this.handleFragmentDragMove = this.handleFragmentDragMove.bind(this);
    this.selectFragment = this.selectFragment.bind(this);
    this.handleSelectedFragmentPropValueChange = this.handleSelectedFragmentPropValueChange.bind(this);

    this.advanceTime = this.advanceTime.bind(this);
  }

  private handleChangeTime(e: React.FormEvent<HTMLInputElement>): void
  {
    const target = e.currentTarget;

    const newTime = clamp(parseFloat(target.value), 0, 1);

    if (this.state.isPlaying)
    {
      this.togglePlay();
    }

    this.updateTime(newTime);
  }
  private handleChangeSFXDuration(e: React.FormEvent<HTMLInputElement>): void
  {
    const target = e.currentTarget;

    const SFXDuration = Math.max(parseInt(target.value), 0);

    this.setState(
    {
      SFXDuration: SFXDuration,
    });
  }
  private togglePlay(): void
  {
    if (this.state.isPlaying)
    {
      this.stopAnimating();
    }
    else
    {
      this.startAnimating();
    }
  }

  private startAnimating(): void
  {
    this.setState(
    {
      isPlaying: true,
    }, () =>
    {
      this.lastAnimationTickTime = window.performance.now();
      this.animationHandle = window.requestAnimationFrame(this.advanceTime);
    });
  }
  private stopAnimating(): void
  {
    this.setState(
    {
      isPlaying: false,
    }, () =>
    {
      if (isFinite(this.animationHandle))
      {
        window.cancelAnimationFrame(this.animationHandle);
        this.animationHandle = undefined;
        this.lastAnimationTickTime = undefined;
      }
    });
  }
  private advanceTime(timeStamp: number): void
  {
    const elapsedTime = timeStamp - this.lastAnimationTickTime;
    this.lastAnimationTickTime = timeStamp;

    const elapsedRelativeTime = elapsedTime / this.state.SFXDuration;
    const newRelativeTime = (this.state.currentTime + elapsedRelativeTime) % 1;

    this.updateTime(newRelativeTime);

    this.animationHandle = window.requestAnimationFrame(this.advanceTime);
  }
  private updateTime(relativeTime: number): void
  {
    this.display.animateFragments(relativeTime);
    this.display.updateRenderer();

    this.setState(
    {
      currentTime: relativeTime,
    });
  }

  private handleFragmentConstructorDragStart(fragmentConstructor: SFXFragmentConstructor): void
  {
    const fragment = new fragmentConstructor.constructorFN();
    fragment.draw();
    fragment.animate(this.state.currentTime);
    this.display.addFragment(fragment);

    this.setState(
    {
      selectedFragment: fragment,
      draggingFragment: fragment,
    });
  }
  private handleFragmentConstructorDragEnd(): void
  {
    this.setState(
    {
      draggingFragment: undefined,
    });
  }
  private handleFragmentDragMove(e: React.MouseEvent<HTMLDivElement>): void
  {
    this.state.draggingFragment.position.set(
      e.clientX,
      e.clientY,
    );

    this.display.updateRenderer();
  }

  private selectFragment(fragment: SFXFragment<any>): void
  {
    this.setState(
    {
      selectedFragment: fragment,
    });
  }
  private updateFragment(fragment: SFXFragment<any>): void
  {
    fragment.draw();
    fragment.animate(this.state.currentTime);
    this.display.updateRenderer();
  }
  private handleSelectedFragmentPropValueChange(): void
  {
    this.updateFragment(this.state.selectedFragment);
    this.forceUpdate();
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-editor",
      },
        React.DOM.div(
        {
          className: "sfx-editor-main",
        },
          SFXEditorDisplay(
          {
            hasDraggingFragment: Boolean(this.state.draggingFragment),
            moveDraggingFragment: this.handleFragmentDragMove,
            ref: component =>
            {
              this.display = component;
            },
          }),
          React.DOM.input(
          {
            className: "sfx-editor-time-control",
            type: "range",
            min: 0,
            max: 1,
            step: 0.002,
            value: "" + this.state.currentTime,
            onChange: this.handleChangeTime,
            title: "Current time",
          },

          ),
          React.DOM.div(
          {
            className: "sfx-editor-play-wrapper",
          },
            React.DOM.button(
            {
              className: "sfx-editor-play-button",
              onClick: this.togglePlay,
            },
              this.state.isPlaying ?
                "Pause" :
                "Play",
            ),
            React.DOM.label(
            {
              className: "sfx-editor-duration-label",
              htmlFor: "sfx-editor-duration",
            },
              "SFX Duration (ms)",
            ),
            React.DOM.input(
            {
              className: "sfx-editor-duration",
              id: "sfx-editor-duration",
              type: "number",
              min: 0,
              step: 100,
              value: "" + this.state.SFXDuration,
              onChange: this.handleChangeSFXDuration,
            },

            ),
          ),
        ),
        SFXEditorSelection(
        {
          availableFragmentConstructors: availableFragmentConstructors,
          selectedFragment: this.state.selectedFragment,
          onSelectedFragmentPropValueChange: this.handleSelectedFragmentPropValueChange,
          selectFragment: this.selectFragment,
          onFragmentListDragStart: this.handleFragmentConstructorDragStart,
          onFragmentListDragEnd: this.handleFragmentConstructorDragEnd,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorComponent);
export default Factory;
