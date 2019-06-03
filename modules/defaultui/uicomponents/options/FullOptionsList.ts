import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../localization/localize";
import Options from "../../../../src/Options";
import {Language} from "../../../../src/localization/Language";
import {default as DialogBox} from "../windows/DialogBox";

import {BattleOptions} from "./BattleOptions";
import {DebugOptions} from "./DebugOptions";
import {DisplayOptions} from "./DisplayOptions";
import {SystemOptions} from "./SystemOptions";


export interface PropTypes extends React.Props<any>
{
  activeLanguage: Language;
}

interface StateType
{
  hasConfirmResetAllDialog: boolean;
}

export class FullOptionsListComponent extends React.Component<PropTypes, StateType>
{
  public displayName: string = "FullOptionsList";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      hasConfirmResetAllDialog: false,
    };

    this.bindMethods();
  }

  public render()
  {
    return(
      ReactDOMElements.div({className: "options"},

        !this.state.hasConfirmResetAllDialog ? null :
          DialogBox(
          {
            title: localize("resetAllOptions")(),
            handleOk: () =>
            {
              Options.setDefaults();
              this.closeResetAllOptionsDialog();
            },
            handleCancel: () =>
            {
              this.closeResetAllOptionsDialog();
            },
          },
          localize("areYouSureYouWantToResetAllOptions")(),
        ),

        ReactDOMElements.div({className: "options-header"},
          ReactDOMElements.button(
          {
            className: "reset-options-button reset-all-options-button",
            onClick: this.openResetAllOptionsDialog,
          },
            localize("resetAllOptions")(),
          ),
        ),
        DisplayOptions({activeLanguage: this.props.activeLanguage}),
        BattleOptions(),
        SystemOptions(),
        DebugOptions(),
      )
    );
  }

  private bindMethods()
  {
    this.openResetAllOptionsDialog = this.openResetAllOptionsDialog.bind(this);
    this.closeResetAllOptionsDialog = this.closeResetAllOptionsDialog.bind(this);
  }
  private openResetAllOptionsDialog()
  {
    this.setState(
    {
      hasConfirmResetAllDialog: true,
    });
  }
  private closeResetAllOptionsDialog()
  {
    this.setState(
    {
      hasConfirmResetAllDialog: false,
    });
  }
}

// tslint:disable-next-line:variable-name
const FullOptionsList: React.Factory<PropTypes> = React.createFactory(FullOptionsListComponent);
export default FullOptionsList;
