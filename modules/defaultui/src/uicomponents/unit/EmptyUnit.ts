import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


import {UnitIconContainer} from "./UnitIconContainer";


export interface PropTypes extends React.Props<any>
{
  isFacingRight: boolean;
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
      ReactDOMElements.div(
      {
        className: "unit-body",
        key: "body",
      },
        null,
      ),
      UnitIconContainer(
        {
          iconSrc: null,
          isFacingRight: this.props.isFacingRight,
          key: "icon",
        }),
    ];

    if (!this.props.isFacingRight)
    {
      innerElements.reverse();
    }

    return(
      ReactDOMElements.div(
      {
        className: "unit empty-unit" + (this.props.isFacingRight ? " friendly-unit" : " enemy-unit"),
        onMouseUp: this.props.onMouseUp,
      },
        innerElements,
      )
    );
  }
}

export const EmptyUnit: React.Factory<PropTypes> = React.createFactory(EmptyUnitComponent);
