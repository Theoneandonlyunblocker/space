/// <reference path="../../../lib/react-global.d.ts" />

import Color from "../../Color";
import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import EmblemPicker from "./EmblemPicker";
import {default as EmblemComponent, EmblemProps} from "../Emblem";

interface PropTypes extends React.Props<any>
{
  isActive: boolean;
  toggleActive: () => void;

  backgroundColor: Color | null;
  emblem: EmblemProps;

  setEmblemTemplate: (emblem: SubEmblemTemplate | null, color: Color) => void;
  setEmblemColor: (color: Color | null) => void;
}

interface StateType
{
}

export class EmblemSetterComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "EmblemSetter";
  state: StateType;

  mainElement: HTMLDivElement;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(e: MouseEvent): void
  {
    const target = <HTMLElement> e.target;
    if (target === this.mainElement || this.mainElement.contains(target))
    {
      return;
    }
    else
    {
      this.setAsInactive();
    }
  }

  protected componentWillReceiveProps(newProps: PropTypes): void
  {
    if (!this.props.isActive && newProps.isActive)
    {
      document.addEventListener("click", this.handleClick, false);
    }
    else if (this.props.isActive && !newProps.isActive)
    {
      document.removeEventListener("click", this.handleClick);
    }
  }

  private setAsActive(): void
  {
    if (!this.props.isActive)
    {
      this.props.toggleActive();
    }
  }
  private setAsInactive(): void
  {
    if (this.props.isActive)
    {
      this.props.toggleActive();
    }
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "emblem-setter",
        ref: (element: HTMLDivElement) =>
        {
          this.mainElement = element;
        }
      },
        EmblemComponent(
        {
          template: this.props.emblem.template,
          colors: this.props.emblem.colors,
          containerProps:
          {
            onClick: this.props.toggleActive,
            style:
            {
              backgroundColor: this.props.backgroundColor
            }
          }
        }),
        !this.props.isActive ? null :
          EmblemPicker(
          {
            color: this.props.emblem.colors[0],
            backgroundColor: this.props.backgroundColor,
            selectedEmblemTemplate: this.props.emblem.template,

            setEmblemTemplate: this.props.setEmblemTemplate,
            setEmblemColor: this.props.setEmblemColor,
          })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemSetterComponent);
export default Factory;
