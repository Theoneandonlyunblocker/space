import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Flag} from "core/src/flag/Flag";


export interface PropTypes extends React.Props<any>
{
  flag: Flag;
  props: React.HTMLProps<any>;
}

interface StateType
{
}

export class PlayerFlagComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName: string = "PlayerFlag";
  public override state: StateType;

  public readonly containerElement = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override componentDidMount()
  {
    this.renderFlagElement();
  }
  public override componentDidUpdate()
  {
    this.renderFlagElement();
  }
  public override render(): React.ReactHTMLElement<any>
  {
    const props =
    {
      ...this.props.props,
      ref: this.containerElement,
    };

    return(
      ReactDOMElements.div(props,
        null,
      )
    );
  }

  private renderFlagElement(): void
  {
    const containerNode = this.containerElement.current;
    if (containerNode.firstChild)
    {
      containerNode.removeChild(containerNode.firstChild);
    }

    const flagElement = this.props.flag.draw();
    flagElement.classList.add("player-flag");
    containerNode.appendChild(flagElement);
  }
}

export const PlayerFlag: React.Factory<PropTypes> = React.createFactory(PlayerFlagComponent);
