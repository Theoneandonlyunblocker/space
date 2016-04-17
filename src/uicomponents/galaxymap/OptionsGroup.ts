/// <reference path="../../../lib/react-global.d.ts" />

interface PropTypes extends React.Props<any>
{
  isCollapsedInitially?: boolean;
  resetFN?: () => void;
  header?: string;
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
  private bindMethods()
  {
    this.toggleCollapse = this.toggleCollapse.bind(this);    
  }
  
  private getInitialStateTODO(): StateType
  {
    return(
    {
      isCollapsed: this.props.isCollapsedInitially || false
    });
  }
  
  toggleCollapse()
  {
    this.setState(
    {
      isCollapsed: !this.state.isCollapsed
    });
  }

  render()
  {
    var rows: React.ReactHTMLElement<any>[] = [];

    if (!this.state.isCollapsed)
    {
      for (let i = 0; i < this.props.options.length; i++)
      {
        var option = this.props.options[i];

        rows.push(React.DOM.div(
        {
          className: "option-container",
          key: option.key
        },
          option.content
        ));
      }
    }

    var resetButton: React.ReactHTMLElement<any> = null;
    if (this.props.resetFN)
    {
      resetButton = React.DOM.button(
      {
        className: "reset-options-button",
        onClick: this.props.resetFN
      }, "reset")
    }

    var header = this.props.header || resetButton ?
      React.DOM.div(
      {
        className: "option-group-header"
      },
        React.DOM.div(
        {
          className: "option-group-header-title collapsible" + (this.state.isCollapsed ? " collapsed" : ""),
          onClick: this.toggleCollapse
        },
          this.props.header
        ),
        resetButton
      ) :
      null

    return(
      React.DOM.div({className: "option-group"},
        header,
        rows
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsGroupComponent);
export default Factory;
