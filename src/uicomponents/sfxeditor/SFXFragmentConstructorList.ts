/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragmentConstructor from "./SFXFragmentConstructor";

import SFXFragmentConstructorListItem from "./SFXFragmentConstructorListItem";

interface PropTypes extends React.Props<any>
{
  availableFragmentConstructors: SFXFragmentConstructor[];
  
  isDraggable: boolean;
  onDragStart?: (fragmentConstructor: SFXFragmentConstructor) => void;
  onDragEnd?: () => void;

  onClick?: (fragmentConstructor: SFXFragmentConstructor) => void;
}

interface StateType
{
}

export class SFXFragmentConstructorListComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentConstructorList";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    return(
      React.DOM.ol(
      {
        className: "sfx-fragment-list"
      },
        this.props.availableFragmentConstructors.map(fragment =>
        {
          return SFXFragmentConstructorListItem(
          {
            key: fragment.key,
            fragmentConstructor: fragment,
            isDraggable: this.props.isDraggable,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            onClick: this.props.onClick
          });
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentConstructorListComponent);
export default Factory;
