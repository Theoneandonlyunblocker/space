import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import SfxFragment from "../../../modules/space/battlesfx/drawingfunctions/sfxfragments/SfxFragment";

import
{
  default as SfxEditorSelectionTab,
  SelectionTabType,
} from "./SfxEditorSelectionTab";
import SfxFragmentConstructor from "./SfxFragmentConstructor";
import SfxFragmentEditor from "./SfxFragmentEditor";
import SfxFragmentList from "./SfxFragmentList";


interface PropTypes extends React.Props<any>
{
  availableFragmentConstructors: SfxFragmentConstructor[];
  selectedFragment: SfxFragment<any>;
  onSelectedFragmentPropValueChange: () => void;
  selectFragment: (fragment: SfxFragment<any>) => void;

  onFragmentListDragStart: (fragmentConstructor: SfxFragmentConstructor) => void;
  onFragmentListDragEnd: () => void;
}

interface StateType
{
  activeTab: SelectionTabType;
}

export class SfxEditorSelectionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "SfxEditorSelection";
  public state: StateType;

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

    const activeSelectionElements: React.ReactElement<any>[] = [];

    switch (this.state.activeTab)
    {
      case "placedFragments":
        if (this.props.selectedFragment)
        {
          activeSelectionElements.push(SfxFragmentEditor(
          {
            key: "fragmentEditor",
            fragment: this.props.selectedFragment,
            onActiveFragmentPropValueChange: this.props.onSelectedFragmentPropValueChange,
          }));
        }
        break;
      case "fragmentConstructors":
        activeSelectionElements.push(SfxFragmentList(
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
        className: "sfx-editor-selection",
      },
        ReactDOMElements.div(
        {
          className: "sfx-editor-selection-tabs-container",
        },
          tabTypes.map(tabType =>
          {
            return SfxEditorSelectionTab(
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
          className: "sfx-editor-selection-active-selector-container",
        },
          activeSelectionElements,
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(SfxEditorSelectionComponent);
export default factory;
