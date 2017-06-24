/// <reference path="../../../lib/react-global.d.ts" />

import {Language} from "../../localization/Language";

export interface PropTypes extends React.Props<any>
{
  isCollapsedInitially?: boolean;
  resetFN?: () => void;
  header?: string;
  activeLanguage: Language;
  options:
  {
    key: string;
    content: React.ReactElement<any>;
  }[];
}

interface StateType
{
  isCollapsed?: boolean;
}

export class OptionsGroupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "OptionsGroup";

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }

  public render()
  {
    const rows: React.ReactHTMLElement<any>[] = [];

    if (!this.state.isCollapsed)
    {
      for (let i = 0; i < this.props.options.length; i++)
      {
        const option = this.props.options[i];

        rows.push(React.DOM.div(
        {
          className: "option-container",
          key: option.key,
        },
          option.content,
        ));
      }
    }

    let resetButton: React.ReactHTMLElement<any> = null;
    if (this.props.resetFN)
    {
      resetButton = React.DOM.button(
      {
        className: "reset-options-button",
        onClick: this.props.resetFN,
      }, "reset");
    }

    const header = this.props.header || resetButton ?
      React.DOM.div(
      {
        className: "option-group-header",
      },
        React.DOM.div(
        {
          className: "option-group-header-title" + (this.state.isCollapsed ? " collapsed" : " collapsible"),
          onClick: this.toggleCollapse,
        },
          this.props.header,
        ),
        resetButton,
      ) :
      null;

    return(
      React.DOM.div({className: "option-group"},
        header,
        rows,
      )
    );
  }

  private bindMethods()
  {
    this.toggleCollapse = this.toggleCollapse.bind(this);
  }
  private getInitialStateTODO(): StateType
  {
    return(
    {
      isCollapsed: this.props.isCollapsedInitially || false,
    });
  }
  private toggleCollapse()
  {
    this.setState(
    {
      isCollapsed: !this.state.isCollapsed,
    });
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsGroupComponent);
export default Factory;
