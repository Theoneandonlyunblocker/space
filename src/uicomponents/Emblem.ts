/// <reference path="../../lib/react-global.d.ts" />

import Color from "../Color";
import Emblem from "../Emblem";
import SubEmblemTemplate from "../templateinterfaces/SubEmblemTemplate";

import
{
  shallowExtend
} from "../utility";

export interface EmblemProps
{
  colors: Color[];
  template: SubEmblemTemplate | null;
}

interface PropTypes extends React.Props<any>, EmblemProps
{
  containerProps?: React.HTMLAttributes;
}

interface StateType
{
}

export class EmblemComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "Emblem";
  state: StateType;

  container: HTMLDivElement;

  constructor(props: PropTypes)
  {
    super(props);
  }

  private renderEmblemCanvas(): void
  {
    const containerRect = this.container.getBoundingClientRect();

    const emblem = new Emblem(
      this.props.colors,
      this.props.template,
      1,
    );

    const drawn = emblem.draw(containerRect.width, containerRect.height, true);

    if (this.container.firstChild)
    {
      const canvas = <HTMLCanvasElement> this.container.firstChild;
      canvas.width = drawn.width;
      canvas.height = drawn.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(drawn, 0, 0);
    }
    else
    {
      drawn.style.maxWidth = "100%";
      drawn.style.maxHeight = "100%";
      this.container.appendChild(drawn);
    }
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
    const baseClassName = "emblem";

    const containerProps = shallowExtend(this.props.containerProps,
    {
      className: baseClassName + (this.props.containerProps && this.props.containerProps.className ?
        " " + this.props.containerProps.className :
        ""),
      ref: (component: HTMLDivElement) =>
      {
        this.container = component;
      }
    });

    return(
      React.DOM.div(containerProps,
        null
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmblemComponent);
export default Factory;
