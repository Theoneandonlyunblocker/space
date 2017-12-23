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
  isMutable?: boolean;
  stretch?: boolean;
}

interface StateType
{
}

export class PlayerFlagComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName: string = "PlayerFlag";
  state: StateType;

  ref_TODO_container: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
  }

  private renderFlagCanvas(): void
  {
    const containerNode = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_container);
    if (containerNode.firstChild)
    {
      containerNode.removeChild(containerNode.firstChild);
    }

    const canvas = this.props.flag.draw();
    // TODO 2017.12.21 |
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    containerNode.appendChild(canvas);
  }

  componentDidMount()
  {
    this.renderFlagCanvas();
  }
  componentDidUpdate()
  {
    this.renderFlagCanvas();
  }

  render(): React.ReactHTMLElement<any>
  {
    const props = shallowExtend(this.props.props,
    {
      ref: (component: HTMLElement) =>
      {
        this.ref_TODO_container = component;
      },
    });

    return(
      React.DOM.div(props,
        null,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(PlayerFlagComponent);
export default Factory;
