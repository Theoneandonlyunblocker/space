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

export class SfxEditorSelectionTabComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxEditorSelectionTab";
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

const factory: React.Factory<PropTypes> = React.createFactory(SfxEditorSelectionTabComponent);
export default factory;
