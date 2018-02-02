import * as React from "react";

import Color from "../Color";
import Emblem from "../Emblem";
import SubEmblemTemplate from "../templateinterfaces/SubEmblemTemplate";

import
{
  shallowExtend,
} from "../utility";


export interface EmblemProps
{
  colors: Color[];
  template: SubEmblemTemplate | null;
}

interface PropTypes extends React.Props<any>, EmblemProps
{
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface StateType
{
}

export class EmblemComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "Emblem";
  public state: StateType;

  container: HTMLDivElement;

  constructor(props: PropTypes)
  {
    super(props);
  }

  private renderEmblemCanvas(): void
  {
    const emblem = new Emblem(
      this.props.colors,
      this.props.template,
      1,
    );

    if (this.container.firstChild)
    {
      this.container.removeChild(this.container.firstChild);
    }

    this.container.appendChild(emblem.draw());
  }

  componentDidMount()
  {
    this.renderEmblemCanvas();
  }
  componentDidUpdate()
  {
    this.renderEmblemCanvas();
  }

  render()
  {
    const baseClassName = "standalone-emblem";

    const containerProps = shallowExtend(this.props.containerProps,
    {
      className: baseClassName + (this.props.containerProps && this.props.containerProps.className ?
        " " + this.props.containerProps.className :
        ""),
      ref: (component: HTMLDivElement) =>
      {
        this.container = component;
      },
    });

    return(
      React.DOM.div(containerProps,
        null,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemComponent);
export default Factory;
