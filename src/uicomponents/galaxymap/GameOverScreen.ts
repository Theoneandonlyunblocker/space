import * as React from "react";

import {default as DefaultWindow} from "../windows/DefaultWindow";
import {default as DialogBox} from "../windows/DialogBox";

import LoadGame from "../saves/LoadGame";

import {localize} from "../../../localization/localize";


interface PropTypes extends React.Props<any>
{

}

interface StateType
{
  hasLoadPopup: boolean;
  hasConfirmNewGamePopup: boolean;
}

export class GameOverScreenComponent extends React.Component<PropTypes, StateType>
{
  displayName = "GameOverScreen";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state =
    {
      hasLoadPopup: false,
      hasConfirmNewGamePopup: false,
    };

    this.toggleLoadPopup = this.toggleLoadPopup.bind(this);
    this.closeLoadPopup = this.closeLoadPopup.bind(this);
    this.toggleNewGamePopup = this.toggleNewGamePopup.bind(this);
    this.closeNewGamePopup = this.closeNewGamePopup.bind(this);
  }

  public render()
  {
    return(
      React.DOM.div(
      {
        className: "game-over-screen",
      },
        React.DOM.div(
        {
          className: "game-over-screen-inner",
        },
          React.DOM.h1(
          {
            className: "game-over-header",
          },
            localize("gameOver")(),
          ),
          React.DOM.div(
          {
            className: "game-over-buttons",
          },
            React.DOM.button(
            {
              className: "game-over-buttons-button",
              onClick: this.toggleLoadPopup,
            },
              localize("load_action")(),
            ),
            React.DOM.button(
            {
              className: "game-over-buttons-button",
              onClick: this.toggleNewGamePopup,
            },
              localize("newGame")(),
            ),
          ),
        ),
        !this.state.hasConfirmNewGamePopup ? null :
          DialogBox(
          {
            title: localize("newGame")(),
            handleOk: () =>
            {
              window.location.reload(false);
            },
            handleCancel: this.closeNewGamePopup,
          },
            localize("areYouSureYouWantToStartANewGame")(),
          ),
        !this.state.hasLoadPopup ? null :
          DefaultWindow(
          {
            title: localize("loadGame")(),
            handleClose: this.closeLoadPopup,
          },
            LoadGame(
            {
              handleClose: this.closeLoadPopup,
            }),
          ),
      )
    );
  }

  private closeLoadPopup(): void
  {
    this.setState({hasLoadPopup: false});
  }
  private closeNewGamePopup(): void
  {
    this.setState({hasConfirmNewGamePopup: false});
  }
  private toggleLoadPopup(): void
  {
    if (this.state.hasLoadPopup)
    {
      this.closeLoadPopup();
    }
    else
    {
      this.setState({hasLoadPopup: true});
    }
  }
  private toggleNewGamePopup(): void
  {
    if (this.state.hasConfirmNewGamePopup)
    {
      this.closeNewGamePopup();
    }
    else
    {
      this.setState({hasConfirmNewGamePopup: true});
    }
  }


}

const Factory: React.Factory<PropTypes> = React.createFactory(GameOverScreenComponent);
export default Factory;
