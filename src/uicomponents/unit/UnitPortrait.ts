import * as React from "react";

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
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    const props: React.HTMLAttributes<HTMLDivElement> = {};
    props.className = "unit-portrait " + (this.props.className || "");
    if (this.props.imageSrc)
    {
      props.style =
      {
        backgroundImage: 'url("' + this.props.imageSrc + '")',
      };
    }

    return(
      React.DOM.div(props,
        null,
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitPortraitComponent);
export default Factory;
