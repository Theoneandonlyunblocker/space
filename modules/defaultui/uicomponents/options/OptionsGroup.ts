import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";

import {Collapsible} from "../generic/Collapsible";


export interface OptionsGroupItem
{
  key: string;
  content: React.ReactNode;
}

export interface PropTypes extends React.Props<any>
{
  isCollapsedInitially?: boolean;
  resetFN?: () => void;
  headerTitle?: string;
  options: OptionsGroupItem[];
}

interface StateType
{
}

export class OptionsGroupComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "OptionsGroup";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    const resetButton = !this.props.resetFN ?
      null :
      ReactDOMElements.button(
      {
        className: "reset-options-button",
        onClick: this.props.resetFN,
      },
        localize("reset")(),
      );

    return(
      ReactDOMElements.div(
      {
        className: "option-group",
      },
        Collapsible(
        {
          isCollapsedInitially: this.props.isCollapsedInitially,
          title: this.props.headerTitle,
          additionalHeaderContent: resetButton,
        },
          this.props.options.map(option =>
          {
            return ReactDOMElements.div(
            {
              className: "option-container",
              key: option.key,
            },
              option.content,
            );
          }),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(OptionsGroupComponent);
export default factory;
