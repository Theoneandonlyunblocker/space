import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import Color from "../Color";
import Emblem from "../Emblem";
import SubEmblemTemplate from "../templateinterfaces/SubEmblemTemplate";


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

  private readonly container = React.createRef<HTMLDivElement>();

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

    if (this.container.current.firstChild)
    {
      this.container.current.removeChild(this.container.current.firstChild);
    }

    this.container.current.appendChild(emblem.draw());
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

const factory: React.Factory<PropTypes> = React.createFactory(EmblemComponent);
export default factory;
