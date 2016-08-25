/// <reference path="../../../../lib/react-global.d.ts" />

interface PropTypes extends React.Props<any>
{
  
}

interface StateType
{
}

export class SFXFragmentPropColorComponent extends React.Component<PropTypes, StateType>
{
  displayName = "SFXFragmentPropColor";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "sfx-fragment-prop-color"
      },
        
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropColorComponent);
export default Factory;
