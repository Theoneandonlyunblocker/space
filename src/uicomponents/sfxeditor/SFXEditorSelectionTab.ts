import * as React from "react";

export type SelectionTabType = "fragmentConstructors" |
  "placedFragments";

const displayString =
{
  fragmentConstructors: "Fragments",
  placedFragments: "Placed",
};

interface PropTypes extends React.Props<any>
{
  type: SelectionTabType;

  isActive: boolean;
  setTab: (type: SelectionTabType) => void;
}

interface StateType
{
}

export class SFXEditorSelectionTabComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SFXEditorSelectionTab";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  private handleClick(): void
  {
    this.props.setTab(this.props.type);
  }

  render()
  {
    return(
      React.DOM.button(
      {
        className: "sfx-editor-selection-tab" +
          " sfx-editor-selection-tab-" + this.props.type,
        disabled: this.props.isActive,
        onClick: this.handleClick,
      },
        displayString[this.props.type],
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorSelectionTabComponent);
export default Factory;
