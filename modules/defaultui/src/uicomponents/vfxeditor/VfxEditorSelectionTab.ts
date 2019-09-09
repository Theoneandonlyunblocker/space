import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


export type SelectionTabType = "fragmentConstructors" |
  "placedFragments";

const displayString =
{
  fragmentConstructors: "Fragments",
  placedFragments: "Placed",
};

export interface PropTypes extends React.Props<any>
{
  type: SelectionTabType;

  isActive: boolean;
  setTab: (type: SelectionTabType) => void;
}

interface StateType
{
}

export class VfxEditorSelectionTabComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxEditorSelectionTab";
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
      ReactDOMElements.button(
      {
        className: "vfx-editor-selection-tab" +
          " vfx-editor-selection-tab-" + this.props.type,
        disabled: this.props.isActive,
        onClick: this.handleClick,
      },
        displayString[this.props.type],
      )
    );
  }
}

export const VfxEditorSelectionTab: React.Factory<PropTypes> = React.createFactory(VfxEditorSelectionTabComponent);
