import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {VfxFragment} from "modules/baselib/src/combat/vfx/fragments/VfxFragment";

import
{
  VfxEditorSelectionTab,
  SelectionTabType,
} from "./VfxEditorSelectionTab";
import {VfxFragmentConstructor} from "./VfxFragmentConstructor";
import {VfxFragmentEditor} from "./VfxFragmentEditor";
import {VfxFragmentList} from "./VfxFragmentList";


export interface PropTypes extends React.Props<any>
{
  availableFragmentConstructors: VfxFragmentConstructor[];
  selectedFragment: VfxFragment<any>;
  onSelectedFragmentPropValueChange: () => void;
  selectFragment: (fragment: VfxFragment<any>) => void;

  onFragmentListDragStart: (fragmentConstructor: VfxFragmentConstructor) => void;
  onFragmentListDragEnd: () => void;
}

interface StateType
{
  activeTab: SelectionTabType;
}

export class VfxEditorSelectionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "VfxEditorSelection";
  public override state: StateType;

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

  public override render()
  {

    const activeSelectionElements: React.ReactElement<any>[] = [];

    switch (this.state.activeTab)
    {
      case "placedFragments":
        if (this.props.selectedFragment)
        {
          activeSelectionElements.push(VfxFragmentEditor(
          {
            key: "fragmentEditor",
            fragment: this.props.selectedFragment,
            onActiveFragmentPropValueChange: this.props.onSelectedFragmentPropValueChange,
          }));
        }
        break;
      case "fragmentConstructors":
        activeSelectionElements.push(VfxFragmentList(
        {
          key: "fragmentConstructors",
          fragments: this.props.availableFragmentConstructors,
          isDraggable: true,
          // @ts-ignore 2322
          onDragStart: this.props.onFragmentListDragStart,
          onDragEnd: this.props.onFragmentListDragEnd,
        }));
        break;
    }

    const tabTypes: SelectionTabType[] = ["fragmentConstructors", "placedFragments"];

    return(
      ReactDOMElements.div(
      {
        className: "vfx-editor-selection",
      },
        ReactDOMElements.div(
        {
          className: "vfx-editor-selection-tabs-container",
        },
          tabTypes.map(tabType =>
          {
            return VfxEditorSelectionTab(
            {
              key: tabType,
              type: tabType,
              setTab: this.setActiveTab,
              isActive: tabType === this.state.activeTab,
            });
          }),
        ),
        ReactDOMElements.div(
        {
          className: "vfx-editor-selection-active-selector-container",
        },
          activeSelectionElements,
        ),
      )
    );
  }
}

export const VfxEditorSelection: React.Factory<PropTypes> = React.createFactory(VfxEditorSelectionComponent);
