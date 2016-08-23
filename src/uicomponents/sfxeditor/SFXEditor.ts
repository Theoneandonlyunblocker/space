/// <reference path="../../../lib/react-global.d.ts" />
/// <reference path="../../../lib/pixi.d.ts" />

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";
import ShockWave from "../../../modules/common/battlesfxfunctions/sfxfragments/ShockWave";

// import UnitTemplate from "../../templateinterfaces/UnitTemplate";
import
{
  clamp
} from "../../utility";

import SFXFragmentConstructor from "./SFXFragmentConstructor";
import
{
  default as SFXEditorDisplay,
  SFXEditorDisplayComponent
} from "./SFXEditorDisplay";
import SFXEditorSelection from "./SFXEditorSelection";


const availableFragments: SFXFragmentConstructor[] =
[
  {
    key: "shockWave",
    displayName: "ShockWave",
    constructorFN: ShockWave
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

availableFragments.sort((a, b) =>
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

  selectedFragment?: SFXFragment<any, any>;
  draggingFragment?: SFXFragment<any, any>;
}

export class SFXEditorComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXEditor";
  state: StateType;

  lastAnimationTickTime: number;
  animationHandle: number;

  oldSelectedFragment: SFXFragment<any, any>;

  display: SFXEditorDisplayComponent;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isPlaying: false,
      currentTime: 0,
      SFXDuration: 1000
    }

    this.handleChangeTime = this.handleChangeTime.bind(this);
    this.handleChangeSFXDuration = this.handleChangeSFXDuration.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.handleFragmentConstructorDragStart = this.handleFragmentConstructorDragStart.bind(this); 
    this.handleFragmentConstructorDragEnd = this.handleFragmentConstructorDragEnd.bind(this); 
    this.handleFragmentDragMove = this.handleFragmentDragMove.bind(this);

    this.advanceTime = this.advanceTime.bind(this);
  }
  
  private handleChangeTime(e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;

    const newTime = clamp(parseFloat(target.value), 0, 1);

    if (this.state.isPlaying)
    {
      this.togglePlay();
    }

    this.updateTime(newTime);
  }
  private handleChangeSFXDuration(e: React.FormEvent): void
  {
    const target = <HTMLInputElement> e.target;

    const SFXDuration = Math.max(parseInt(target.value), 0);

    this.setState(
    {
      SFXDuration: SFXDuration
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
      isPlaying: true
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
      isPlaying: false
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
    this.display.updateRenderer();

    this.animationHandle = window.requestAnimationFrame(this.advanceTime);
  }
  private updateTime(relativeTime: number): void
  {
    this.setState(
    {
      currentTime: relativeTime
    });
  }

  private handleFragmentConstructorDragStart(fragmentConstructor: SFXFragmentConstructor): void
  {
    const fragment = new fragmentConstructor.constructorFN();
    fragment.draw();
    fragment.animate(this.state.currentTime);
    this.display.addFragment(fragment);

    this.oldSelectedFragment = this.state.selectedFragment;

    this.setState(
    {
      selectedFragment: fragment,
      draggingFragment: fragment
    });
  }
  private handleFragmentConstructorDragEnd(): void
  {
    this.setState(
    {
      selectedFragment: this.oldSelectedFragment,
      draggingFragment: undefined
    }, () =>
    {
      this.oldSelectedFragment = undefined;
    });
  }
  private handleFragmentDragMove(e: React.MouseEvent): void
  {
    this.state.draggingFragment.position =
    {
      x: e.clientX,
      y: e.clientY
    }
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-editor"
      },
        React.DOM.div(
        {
          className: "sfx-editor-main"
        },
          SFXEditorDisplay(
          {
            hasDraggingFragment: Boolean(this.state.draggingFragment),
            moveDraggingFragment: this.handleFragmentDragMove,
            ref: (component) =>
            {
              this.display = component;
            }
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
            title: "Current time"
          },

          ),
          React.DOM.div(
          {
            className: "sfx-editor-play-wrapper"
          },
            React.DOM.button(
            {
              className: "sfx-editor-play-button",
              onClick: this.togglePlay
            },
              this.state.isPlaying ?
                "Pause" :
                "Play"
            ),
            React.DOM.label(
            {
              className: "sfx-editor-duration-label",
              htmlFor: "sfx-editor-duration"
            },
              "SFX Duration (ms)"
            ),
            React.DOM.input(
            {
              className: "sfx-editor-duration",
              id: "sfx-editor-duration",
              type: "number",
              min: 0,
              step: 100,
              value: "" + this.state.SFXDuration,
              onChange: this.handleChangeSFXDuration
            },
              
            )
          )
        ),
        SFXEditorSelection(
        {
          availableFragments: availableFragments,
          onFragmentListDragStart: this.handleFragmentConstructorDragStart,
          onFragmentListDragEnd: this.handleFragmentConstructorDragEnd
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorComponent);
export default Factory;
