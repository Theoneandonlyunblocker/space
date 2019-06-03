import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Beam from "../../../../modules/space/battlesfx/drawingfunctions/sfxfragments/Beam";
import FocusingBeam from "../../../../modules/space/battlesfx/drawingfunctions/sfxfragments/FocusingBeam";
import LightBurst from "../../../../modules/space/battlesfx/drawingfunctions/sfxfragments/LightBurst";
import SfxFragment from "../../../../modules/space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";
import ShockWave from "../../../../modules/space/battlesfx/drawingfunctions/sfxfragments/ShockWave";

import
{
  clamp,
} from "../../../../src/utility";

import
{
  default as SfxEditorDisplay,
  SfxEditorDisplayComponent,
} from "./SfxEditorDisplay";
import SfxEditorSelection from "./SfxEditorSelection";
import SfxFragmentConstructor from "./SfxFragmentConstructor";


const availableFragmentConstructors: SfxFragmentConstructor[] =
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

export interface PropTypes extends React.Props<any>
{
  // availableUnitTemplates: UnitTemplate[];
}

interface StateType
{
  isPlaying: boolean;
  currentTime: number;
  sfxDuration: number;

  selectedFragment: SfxFragment<any> | null;
  draggingFragment: SfxFragment<any> | null;
}

export class SfxEditorComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "sfxEditor";
  public state: StateType;

  lastAnimationTickTime: number;
  animationHandle: number;

  display: SfxEditorDisplayComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isPlaying: false,
      currentTime: 0,
      sfxDuration: 1000,

      selectedFragment: null,
      draggingFragment: null,
    };

    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeSfxDuration = this.handleChangeSfxDuration.bind(this);
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
  private handleChangeSfxDuration(e: React.FormEvent<HTMLInputElement>): void
  {
    const target = e.currentTarget;

    const sfxDuration = Math.max(parseInt(target.value), 0);

    this.setState(
    {
      sfxDuration: sfxDuration,
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

    const elapsedRelativeTime = elapsedTime / this.state.sfxDuration;
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

  private handleFragmentConstructorDragStart(fragmentConstructor: SfxFragmentConstructor): void
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

  private selectFragment(fragment: SfxFragment<any>): void
  {
    this.setState(
    {
      selectedFragment: fragment,
    });
  }
  private updateFragment(fragment: SfxFragment<any>): void
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
        className: "sfx-editor",
      },
        ReactDOMElements.div(
        {
          className: "sfx-editor-main",
        },
          SfxEditorDisplay(
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
          ReactDOMElements.div(
          {
            className: "sfx-editor-play-wrapper",
          },
            ReactDOMElements.button(
            {
              className: "sfx-editor-play-button",
              onClick: this.togglePlay,
            },
              this.state.isPlaying ?
                "Pause" :
                "Play",
            ),
            ReactDOMElements.label(
            {
              className: "sfx-editor-duration-label",
              htmlFor: "sfx-editor-duration",
            },
              "Sfx Duration (ms)",
            ),
            ReactDOMElements.input(
            {
              className: "sfx-editor-duration",
              id: "sfx-editor-duration",
              type: "number",
              min: 0,
              step: 100,
              value: "" + this.state.sfxDuration,
              onChange: this.handleChangeSfxDuration,
            },

            ),
          ),
        ),
        SfxEditorSelection(
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxEditorComponent);
export default factory;
