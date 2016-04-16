/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

interface PropTypes extends React.Props<any>
{
  className?: string;
  imageSrc: string;
}

interface StateType
{
}

export class UnitPortraitComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitPortrait";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var props: React.HTMLAttributes = {};
    props.className = "unit-portrait " + (this.props.className || "");
    if (this.props.imageSrc)
    {
      props.style = 
      {
        backgroundImage: 'url("' + this.props.imageSrc + '")'
      }
    }

    return(
      React.DOM.div(props,
        null
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitPortraitComponent);
export default Factory;
