import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  isCollapsedInitially?: boolean;
  title: string;
  // headerContent?: React.ReactNode;
  additionalHeaderContent?: React.ReactNode;
}

interface StateType
{
  isCollapsed: boolean;
}

export class CollapsibleComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Collapsible";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      isCollapsed: props.isCollapsedInitially || false,
    };

    this.toggleCollapse = this.toggleCollapse.bind(this);
  }

  public render()
  {
    return(
      ReactDOMElements.div(
      {
        className: `${this.state.isCollapsed ? "collapsed" : "collapsible"}`,
      },
        ReactDOMElements.div(
        {
          className: "collapsible-header",
        },
          ReactDOMElements.div(
          {
            className: "collapsible-header-title",
            onClick: this.toggleCollapse,
          },
            this.props.title,
          ),
          this.props.additionalHeaderContent || null,
        ),
          this.state.isCollapsed ? null : this.props.children,
      )
    );
  }
  private toggleCollapse(): void
  {
    this.setState(
    {
      isCollapsed: !this.state.isCollapsed,
    });
  }
}

// tslint:disable-next-line:variable-name
export const Collapsible: React.Factory<PropTypes> = React.createFactory(CollapsibleComponent);
