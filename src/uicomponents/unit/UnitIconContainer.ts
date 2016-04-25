/// <reference path="../../../lib/react-global.d.ts" />

export interface PropTypes extends React.Props<any>
{
  facesLeft: boolean;
  iconSrc?: string;
}

interface StateType
{
}

export class UnitIconContainerComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitIconContainer";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  shouldComponentUpdate = React.addons.PureRenderMixin.shouldComponentUpdate.bind(this);
  
  render()
  {
    var containerProps: React.HTMLAttributes =
    {
      className: "unit-icon-container"
    };

    var fillerProps: React.HTMLAttributes =
    {
      className: "unit-icon-filler"
    };
    
    if (this.props.facesLeft)
    {
      fillerProps.className += " unit-border-right";
      containerProps.className += " unit-border-no-right";
    }
    else
    {
      fillerProps.className += " unit-border-left";
      containerProps.className += " unit-border-no-left";
    }
    
    const iconElement = React.Children.count(this.props.children) === 1 ?
      React.Children.only(this.props.children) :
      React.DOM.img({src: this.props.iconSrc});

    return(
      React.DOM.div({className: "unit-icon-wrapper"},
        React.DOM.div(fillerProps),
        React.DOM.div(containerProps,
          iconElement
        ),
        React.DOM.div(fillerProps)
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitIconContainerComponent);
export default Factory;
