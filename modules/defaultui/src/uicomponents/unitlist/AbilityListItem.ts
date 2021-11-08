import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export type AbilityListItemType = "active" | "passive" | "redundant" | "learnable";

const classNameMap: {[k in AbilityListItemType]: string} =
{
  active: "active-skill",
  passive: "passive-skill",
  redundant: "redundant-ability",
  learnable: "learnable-ability",
};

// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  type: AbilityListItemType;
  displayName: string;
  title: string;

  onClick?: () => void;
}

interface StateType
{
}

export class AbilityListItemComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "AbilityListItem";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    return(
      ReactDOMElements.li(
      {
        className: "unit-info-ability " + classNameMap[this.props.type],
        title: this.props.title,
        onClick: this.props.onClick,
      },
        `[${this.props.displayName}]`,
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const AbilityListItem: React.Factory<PropTypes> = React.createFactory(AbilityListItemComponent);
