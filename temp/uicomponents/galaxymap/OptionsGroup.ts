/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

export interface PropTypes
{
  isCollapsedInitially?: boolean;
  resetFN?: reactTypeTODO_func;
  header?: string;
  options: reactTypeTODO_object[];
}

interface StateType
{
  // TODO refactor | add state type
}

class OptionsGroup_COMPONENT_TODO extends React.Component<PropTypes, StateType>
{
  displayName: string = "OptionsGroup";


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
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
    var rows: ReactDOMPlaceHolder[] = [];

    if (!this.state.isCollapsed)
    {
      for (var i = 0; i < this.props.options.length; i++)
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

    var resetButton: ReactDOMPlaceHolder = null;
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

const Factory: React.Factory<PropTypes> = React.createFactory(OptionsGroup_COMPONENT_TODO);
export default Factory;
