/// <reference path="../../../lib/react-global.d.ts" />

import SFXFragmentConstructor from "./SFXFragmentConstructor";

import SFXFragmentListItem from "./SFXFragmentListItem";

interface PropTypes extends React.Props<any>
{
  availableFragments: SFXFragmentConstructor[];
  
  onDragStart: (fragmentConstructor: SFXFragmentConstructor) => void;
  onDragEnd: () => void;
}

interface StateType
{
}

export class SFXFragmentListComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentList";
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
        this.props.availableFragments.map(fragment =>
        {
          return SFXFragmentListItem(
          {
            key: fragment.key,
            fragment: fragment,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd
          });
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentListComponent);
export default Factory;
