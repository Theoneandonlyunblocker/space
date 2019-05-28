import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


interface PropTypes extends React.Props<any>
{
  displayName: string;
  description: string;
}

interface StateType
{
}

export class TechnologyUnlockComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "TechnologyUnlock";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "technology-unlock",
        title: this.props.description,
      },
        this.props.displayName,
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const TechnologyUnlock: React.Factory<PropTypes> = React.createFactory(TechnologyUnlockComponent);
