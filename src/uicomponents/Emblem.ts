/// <reference path="../../lib/react-global.d.ts" />

import SubEmblemTemplate from "../templateinterfaces/SubEmblemTemplate";
import Color from "../Color";
import Emblem from "../Emblem";

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
  containerProps?: React.HTMLProps<any>;
}

interface StateType
{
}

export class EmblemComponent extends React.Component<PropTypes, StateType>
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
    if (this.container.firstChild)
    {
      this.container.removeChild(this.container.firstChild);
    }

    const containerRect = this.container.getBoundingClientRect();
    
    const emblem = new Emblem(
      this.props.colors,
      this.props.template,
      1,
    );

    const canvas = emblem.draw(containerRect.width, containerRect.height, true);

    this.container.appendChild(canvas);
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
    const className = "emblem";

    const containerProps = shallowExtend(this.props.containerProps,
    {
      className: className + this.props.containerProps && this.props.containerProps.className ?
        " " + this.props.containerProps.className :
        "",
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
