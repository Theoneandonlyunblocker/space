/// <reference path="../../../lib/react-global-0.13.3.d.ts" />


import UnitIcon from "./UnitIcon";


interface PropTypes extends React.Props<any>
{
  facesLeft: boolean;
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
      UnitIcon(
        {
          icon: null,
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
