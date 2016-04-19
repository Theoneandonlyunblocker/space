/// <reference path="../../../lib/react-global.d.ts" />


import UnitIconContainer from "./UnitIconContainer";


interface PropTypes extends React.Props<any>
{
  facesLeft: boolean;
  onMouseUp?: () => void;
}

interface StateType
{
}

export class EmptyUnitComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "EmptyUnit";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);
  
  render()
  {
    const innerElements =
    [
      React.DOM.div(
      {
        className: "unit-body",
        key: "body"
      },
        null
      ),
      UnitIconContainer(
        {
          iconSrc: null,
          facesLeft: this.props.facesLeft,
          key: "icon"
        })
    ];

    if (this.props.facesLeft)
    {
      innerElements.reverse();
    }
    
    return(
      React.DOM.div(
      {
        className: "unit empty-unit" + (this.props.facesLeft ? " enemy-unit" : " friendly-unit"),
        onMouseUp: this.props.onMouseUp
      },
        innerElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmptyUnitComponent);
export default Factory;
