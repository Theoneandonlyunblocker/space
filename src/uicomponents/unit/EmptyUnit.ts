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
  shouldComponentUpdate(newProps: PropTypes)
  {
    return newProps.facesLeft !== this.props.facesLeft;
  }
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var wrapperProps: React.HTMLAttributes =
    {
      className: "unit empty-unit"
    };

    var containerProps =
    {
      className: "unit-container",
      key: "container"
    };

    if (this.props.facesLeft)
    {
      wrapperProps.className += " enemy-unit";
    }
    else
    {
      wrapperProps.className += " friendly-unit";
    }

    var allElements =
    [
      React.DOM.div(containerProps,
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
      allElements = allElements.reverse();
    }
    
    return(
      React.DOM.div(wrapperProps,
        allElements
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmptyUnitComponent);
export default Factory;
