/// <reference path="../../lib/react-global.d.ts" />


import Flag from "../../src/Flag";


interface PropTypes extends React.Props<any>
{
  width?: number;
  props: React.HTMLAttributes;
  isMutable?: boolean;
  height?: number;
  stretch?: boolean;
  flag: Flag;
}

interface StateType
{
}

export class PlayerFlagComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "PlayerFlag";
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);
  state: StateType;
  
  ref_TODO_container: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.canUseDataURL = this.canUseDataURL.bind(this);    
  }
  
  canUseDataURL()
  {
    var uaString = navigator.userAgent.toLowerCase();
    var isIE = uaString.indexOf("msie") !== -1 || uaString.indexOf("trident/") !== -1;
    return !isIE;
  }
  componentDidMount()
  {
    if (this.ref_TODO_container && !this.props.isMutable)
    {
      var canvas = this.props.flag.getCanvas(this.props.width, this.props.height, this.props.stretch, false);
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";
      ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_container).appendChild(canvas);
    }
  }
  componentDidUpdate()
  {
    if (this.ref_TODO_container && this.props.isMutable)
    {
      var containerNode = ReactDOM.findDOMNode<HTMLElement>(this.ref_TODO_container);
      if (containerNode.firstChild)
      {
        containerNode.removeChild(containerNode.firstChild);
      }

      var canvas = this.props.flag.getCanvas(this.props.width, this.props.height, this.props.stretch, false);
      canvas.style.maxWidth = "100%";
      canvas.style.maxHeight = "100%";
      containerNode.appendChild(canvas);
    }
  }
  render()
  {
    var props = this.props.props;
    if (this.canUseDataURL())
    {
      var flag = this.props.flag;
      props.src = flag.getCanvas(
        this.props.width, this.props.height, this.props.stretch, !this.props.isMutable).toDataURL();
      return(
        React.DOM.img(props,
          null
        )
      );
    }
    else
    {
      props.ref = (component: HTMLElement) =>
      {
        this.ref_TODO_container = component;
      };
      return(
        React.DOM.div(props,
          null
        )
      );
    }
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(PlayerFlagComponent);
export default Factory;
