import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export interface PropTypes extends React.Props<any>
{
  className?: string;
  imageSrc: string;
}

interface StateType
{
}

export class UnitPortraitComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "UnitPortrait";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    const props: React.HTMLAttributes<HTMLDivElement> = {};
    props.className = "unit-portrait " + (this.props.className || "");
    if (this.props.imageSrc)
    {
      props.style =
      {
        backgroundImage: `url("${this.props.imageSrc}")`,
      };
    }

    return(
      ReactDOMElements.div(props,
        null,
      )
    );
  }
}

export const UnitPortrait: React.Factory<PropTypes> = React.createFactory(UnitPortraitComponent);
