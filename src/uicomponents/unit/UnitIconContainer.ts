import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export interface PropTypes extends React.Props<any>
{
  facesLeft: boolean;
  iconSrc?: string;
}

interface StateType
{
}

export class UnitIconContainerComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "UnitIconContainer";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const containerProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "unit-icon-container",
    };

    const fillerProps: React.HTMLAttributes<HTMLDivElement> =
    {
      className: "unit-icon-filler",
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
      ReactDOMElements.img({src: this.props.iconSrc});

    return(
      ReactDOMElements.div({className: "unit-icon-wrapper"},
        ReactDOMElements.div(fillerProps),
        ReactDOMElements.div(containerProps,
          iconElement,
        ),
        ReactDOMElements.div(fillerProps),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(UnitIconContainerComponent);
export default factory;
