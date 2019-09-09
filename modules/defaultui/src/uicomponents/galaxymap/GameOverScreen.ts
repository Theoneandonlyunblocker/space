import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {DefaultWindow} from "../windows/DefaultWindow";
import {DialogBox} from "../windows/DialogBox";

import {LoadGame} from "../saves/LoadGame";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{

}

interface StateType
{
  hasLoadPopup: boolean;
  hasConfirmNewGamePopup: boolean;
}

export class GameOverScreenComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "GameOverScreen";
  public state: StateType;

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
      ReactDOMElements.div(
      {
        className: "game-over-screen",
      },
        ReactDOMElements.div(
        {
          className: "game-over-screen-inner",
        },
          ReactDOMElements.h1(
          {
            className: "game-over-header",
          },
            localize("gameOver").toString(),
          ),
          ReactDOMElements.div(
          {
            className: "game-over-buttons",
          },
            ReactDOMElements.button(
            {
              className: "game-over-buttons-button",
              onClick: this.toggleLoadPopup,
            },
              localize("load_action").toString(),
            ),
            ReactDOMElements.button(
            {
              className: "game-over-buttons-button",
              onClick: this.toggleNewGamePopup,
            },
              localize("newGame").toString(),
            ),
          ),
        ),
        !this.state.hasConfirmNewGamePopup ? null :
          DialogBox(
          {
            title: localize("newGame").toString(),
            handleOk: () =>
            {
              window.location.reload(false);
            },
            handleCancel: this.closeNewGamePopup,
          },
            localize("areYouSureYouWantToStartANewGame").toString(),
          ),
        !this.state.hasLoadPopup ? null :
          DefaultWindow(
          {
            title: localize("loadGame").toString(),
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

export const GameOverScreen: React.Factory<PropTypes> = React.createFactory(GameOverScreenComponent);
