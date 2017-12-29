import * as React from "react";

import SFXFragment from "../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import
{
  default as SFXEditorSelectionTab,
  SelectionTabType,
} from "./SFXEditorSelectionTab";
import SFXFragmentConstructor from "./SFXFragmentConstructor";
import SFXFragmentEditor from "./SFXFragmentEditor";
import SFXFragmentList from "./SFXFragmentList";

interface PropTypes extends React.Props<any>
{
  availableFragmentConstructors: SFXFragmentConstructor[];
  selectedFragment: SFXFragment<any>;
  onSelectedFragmentPropValueChange: () => void;
  selectFragment: (fragment: SFXFragment<any>) => void;

  onFragmentListDragStart: (fragmentConstructor: SFXFragmentConstructor) => void;
  onFragmentListDragEnd: () => void;
}

interface StateType
{
  activeTab: SelectionTabType;
}

export class SFXEditorSelectionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SFXEditorSelection";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      activeTab: "fragmentConstructors",
    };

    this.setActiveTab = this.setActiveTab.bind(this);
  }

  private setActiveTab(tabType: SelectionTabType): void
  {
    this.setState(
    {
      activeTab: tabType,
    });
  }

  render()
  {

    let activeSelectionElements: React.ReactElement<any>[] = [];

    switch (this.state.activeTab)
    {
      case "placedFragments":
        if (this.props.selectedFragment)
        {
          activeSelectionElements.push(SFXFragmentEditor(
          {
            key: "fragmentEditor",
            fragment: this.props.selectedFragment,
            onActiveFragmentPropValueChange: this.props.onSelectedFragmentPropValueChange,
          }));
        }
        break;
      case "fragmentConstructors":
        activeSelectionElements.push(SFXFragmentList(
        {
          key: "fragmentConstructors",
          fragments: this.props.availableFragmentConstructors,
          isDraggable: true,
          onDragStart: this.props.onFragmentListDragStart,
          onDragEnd: this.props.onFragmentListDragEnd,
        }));
        break;
    }

    return(
      React.DOM.div(
      {
        className: "sfx-editor-selection",
      },
        React.DOM.div(
        {
          className: "sfx-editor-selection-tabs-container",
        },
          ["fragmentConstructors", "placedFragments"].map((tabType: SelectionTabType) =>
          {
            return SFXEditorSelectionTab(
            {
              key: tabType,
              type: tabType,
              setTab: this.setActiveTab,
              isActive: tabType === this.state.activeTab,
            });
          }),
        ),
        React.DOM.div(
        {
          className: "sfx-editor-selection-active-selector-container",
        },
          activeSelectionElements,
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorSelectionComponent);
export default Factory;
