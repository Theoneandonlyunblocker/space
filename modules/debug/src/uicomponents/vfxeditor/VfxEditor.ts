import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Beam} from "modules/common/src/combat/vfx/fragments/Beam";
import {FocusingBeam} from "modules/common/src/combat/vfx/fragments/FocusingBeam";
import {LightBurst} from "modules/common/src/combat/vfx/fragments/LightBurst";
import {VfxFragment} from "modules/common/src/combat/vfx/fragments/VfxFragment";
import {ShockWave} from "modules/common/src/combat/vfx/fragments/ShockWave";
import {Projectile} from "modules/common/src/combat/vfx/fragments/Projectile";
import {ProjectileWithImpact} from "modules/common/src/combat/vfx/fragments/ProjectileWithImpact";

import
{
  clamp,
} from "core/src/generic/utility";

import
{
  VfxEditorDisplay,
  VfxEditorDisplayComponent,
} from "./VfxEditorDisplay";
import {VfxEditorSelection} from "./VfxEditorSelection";
import {VfxFragmentConstructor} from "./VfxFragmentConstructor";


const availableFragmentConstructors: VfxFragmentConstructor[] =
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
  {
    key: "projectile",
    displayName: "Projectile",
    constructorFN: Projectile,
  },
  {
    key: "projectileWithImpact",
    displayName: "ProjectileWithImpact",
    constructorFN: ProjectileWithImpact,
  }
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

export interface PropTypes extends React.Props<any>
{
  // availableUnitTemplates: UnitTemplate[];
}

interface StateType
{
  isPlaying: boolean;
  currentTime: number;
  vfxDuration: number;

  selectedFragment: VfxFragment<any> | null;
  draggingFragment: VfxFragment<any> | null;
}

export class VfxEditorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "vfxEditor";
  public state: StateType;

  lastAnimationTickTime: number;
  animationHandle: number;

  display: VfxEditorDisplayComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isPlaying: false,
      currentTime: 0,
      vfxDuration: 1000,

      selectedFragment: null,
      draggingFragment: null,
    };

    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeVfxDuration = this.handleChangeVfxDuration.bind(this);
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
  private handleChangeVfxDuration(e: React.FormEvent<HTMLInputElement>): void
  {
    const target = e.currentTarget;

    const vfxDuration = Math.max(parseInt(target.value), 0);

    this.setState(
    {
      vfxDuration: vfxDuration,
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

    const elapsedRelativeTime = elapsedTime / this.state.vfxDuration;
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

  private handleFragmentConstructorDragStart(fragmentConstructor: VfxFragmentConstructor): void
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
    this.state.draggingFragment.setCenter(
      e.clientX,
      e.clientY,
    );

    this.display.updateRenderer();
  }

  private selectFragment(fragment: VfxFragment<any>): void
  {
    this.setState(
    {
      selectedFragment: fragment,
    });
  }
  private updateFragment(fragment: VfxFragment<any>): void
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
      ReactDOMElements.div(
      {
        className: "vfx-editor",
      },
        ReactDOMElements.div(
        {
          className: "vfx-editor-main",
        },
          VfxEditorDisplay(
          {
            hasDraggingFragment: Boolean(this.state.draggingFragment),
            moveDraggingFragment: this.handleFragmentDragMove,
            ref: component =>
            {
              this.display = component;
            },
          }),
          ReactDOMElements.input(
          {
            className: "vfx-editor-time-control",
            type: "range",
            min: 0,
            max: 1,
            step: 0.002,
            value: "" + this.state.currentTime,
            onChange: this.handleChangeTime,
            title: "Current time",
          },

          ),
          ReactDOMElements.div(
          {
            className: "vfx-editor-play-wrapper",
          },
            ReactDOMElements.button(
            {
              className: "vfx-editor-play-button",
              onClick: this.togglePlay,
            },
              this.state.isPlaying ?
                "Pause" :
                "Play",
            ),
            ReactDOMElements.label(
            {
              className: "vfx-editor-duration-label",
              htmlFor: "vfx-editor-duration",
            },
              "Vfx Duration (ms)",
            ),
            ReactDOMElements.input(
            {
              className: "vfx-editor-duration",
              id: "vfx-editor-duration",
              type: "number",
              min: 0,
              step: 100,
              value: "" + this.state.vfxDuration,
              onChange: this.handleChangeVfxDuration,
            },

            ),
          ),
        ),
        VfxEditorSelection(
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

export const VfxEditor: React.Factory<PropTypes> = React.createFactory(VfxEditorComponent);
