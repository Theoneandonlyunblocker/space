import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {Color} from "core/src/color/Color";
import {Emblem as EmblemObj} from "core/src/flag/Emblem";
import {SubEmblemTemplate} from "core/src/templateinterfaces/SubEmblemTemplate";


export interface EmblemProps
{
  colors: Color[];
  template: SubEmblemTemplate | null;
}

export interface PropTypes extends React.Props<any>, EmblemProps
{
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
}

interface StateType
{
}

export class EmblemComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "Emblem";
  public override state: StateType;

  private readonly container = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);
  }

  private renderEmblemCanvas(): void
  {
    const emblem = new EmblemObj(
      this.props.colors,
      this.props.template,
    );

    if (this.container.current.firstChild)
    {
      this.container.current.removeChild(this.container.current.firstChild);
    }

    this.container.current.appendChild(emblem.draw());
  }

  public override componentDidMount()
  {
    this.renderEmblemCanvas();
  }
  public override componentDidUpdate()
  {
    this.renderEmblemCanvas();
  }

  public override render()
  {
    const baseClassName = "standalone-emblem";
    const hasSpecifiedTitle = this.props.containerProps && this.props.containerProps.title;

    const containerProps =
    {
      ...this.props.containerProps,
      className: baseClassName + (this.props.containerProps && this.props.containerProps.className ?
        " " + this.props.containerProps.className :
        ""),
      ref: this.container,
      title: hasSpecifiedTitle ?
        this.props.containerProps.title :
        this.props.template.key,
    };

    return(
      ReactDOMElements.div(containerProps,
        null,
      )
    );
  }
}

export const Emblem: React.Factory<PropTypes> = React.createFactory(EmblemComponent);
