import * as React from "react";


import UnitIconContainer from "./UnitIconContainer";


export interface PropTypes extends React.Props<any>
{
  facesLeft: boolean;
  onMouseUp?: () => void;
}

interface StateType
{
}

export class EmptyUnitComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "EmptyUnit";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const innerElements =
    [
      React.DOM.div(
      {
        className: "unit-body",
        key: "body",
      },
        null,
      ),
      UnitIconContainer(
        {
          iconSrc: null,
          facesLeft: this.props.facesLeft,
          key: "icon",
        }),
    ];

    if (this.props.facesLeft)
    {
      innerElements.reverse();
    }

    return(
      React.DOM.div(
      {
        className: "unit empty-unit" + (this.props.facesLeft ? " enemy-unit" : " friendly-unit"),
        onMouseUp: this.props.onMouseUp,
      },
        innerElements,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(EmptyUnitComponent);
export default Factory;
