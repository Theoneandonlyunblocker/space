import * as React from "react";
import * as ReactDOM from "react-dom";

import {Flag} from "../Flag";
import
{
  shallowExtend,
} from "../utility";


export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  props: React.HTMLProps<any>;

  onUpdate?: (flagElement: HTMLDivElement) => void;
}

interface StateType
{
}

export class PlayerFlagComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName: string = "PlayerFlag";
  public state: StateType;

  private containerElement: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public componentDidMount()
  {
    this.renderFlagElement();
  }
  public componentDidUpdate()
  {
    this.renderFlagElement();
  }
  public render(): React.ReactHTMLElement<any>
  {
    const props = shallowExtend(this.props.props,
    {
      ref: (component: HTMLElement) =>
      {
        this.containerElement = component;
      },
    });

    return(
      React.DOM.div(props,
        null,
      )
    );
  }

  private renderFlagElement(): void
  {
    const containerNode = ReactDOM.findDOMNode<HTMLElement>(this.containerElement);
    if (containerNode.firstChild)
    {
      containerNode.removeChild(containerNode.firstChild);
    }

    const flagElement = this.props.flag.draw();
    flagElement.classList.add("player-flag");
    // TODO 2017.12.21 |
    flagElement.style.width = "100%";
    flagElement.style.height = "100%";
    containerNode.appendChild(flagElement);

    if (this.props.onUpdate)
    {
      this.props.onUpdate(flagElement);
    }
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(PlayerFlagComponent);
export default Factory;
