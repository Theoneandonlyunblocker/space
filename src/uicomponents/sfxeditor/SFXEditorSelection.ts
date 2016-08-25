/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragmentConstructor from "./SFXFragmentConstructor";
import SFXFragmentList from "./SFXFragmentList";
import
{
  default as SFXEditorSelectionTab,
  SelectionTabType
} from "./SFXEditorSelectionTab";

interface PropTypes extends React.Props<any>
{
  availableFragmentConstructors: SFXFragmentConstructor[];

  onFragmentListDragStart: (fragmentConstructor: SFXFragmentConstructor) => void;
  onFragmentListDragEnd: () => void;
}

interface StateType
{
  activeTab?: SelectionTabType;
}

export class SFXEditorSelectionComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXEditorSelection";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      activeTab: "fragmentConstructors"
    }

    this.setActiveTab = this.setActiveTab.bind(this);
  }

  private setActiveTab(tabType: SelectionTabType): void
  {
    this.setState(
    {
      activeTab: tabType
    });
  }
  
  render()
  {

    let activeSelectionElement: React.ReactElement<any>;

    switch (this.state.activeTab)
    {
      case "sfx":
        break;
      case "units":
        break;
      case "fragments":
        activeSelectionElement = SFXFragmentList(
        {
          availableFragments: this.props.availableFragments,
          onDragStart: this.props.onFragmentListDragStart,
          onDragEnd: this.props.onFragmentListDragEnd
        });
        break;
    }
    
    return(
      React.DOM.div(
      {
        className: "sfx-editor-selection"
      },
        React.DOM.div(
        {
          className: "sfx-editor-selection-tabs-container"
        },
          ["sfx", "units", "fragments"].map((tabType: SelectionTabType) =>
          {
            return SFXEditorSelectionTab(
            {
              key: tabType,
              type: tabType,
              setTab: this.setActiveTab,
              isActive: tabType === this.state.activeTab
            });
          })
        ),
        React.DOM.div(
        {
          className: "sfx-editor-selection-active-selector-container"
        },
          activeSelectionElement
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXEditorSelectionComponent);
export default Factory;
