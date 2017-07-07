/// <reference path="../../../lib/react-global.d.ts" />

import {default as DefaultWindow} from "../windows/DefaultWindow";
import {default as DialogBox} from "../windows/DialogBox";

import LoadGame from "../saves/LoadGame";

interface PropTypes extends React.Props<any>
{

}

interface StateType
{
  hasLoadPopup?: boolean;
  hasConfirmNewGamePopup?: boolean;
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
            "Game over",
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
              "Load",
            ),
            React.DOM.button(
            {
              className: "game-over-buttons-button",
              onClick: this.toggleNewGamePopup,
            },
              "New game",
            ),
          ),
        ),
        !this.state.hasConfirmNewGamePopup ? null :
          DialogBox(
          {
            title: "New game",
            handleOk: () =>
            {
              window.location.reload(false);
            },
            handleCancel: this.closeNewGamePopup,
          },
            "Are you sure you want to start a new game?",
          ),
        !this.state.hasLoadPopup ? null :
          DefaultWindow(
          {
            title: "Load game",
            handleClose: this.closeLoadPopup,

            minWidth: 200,
            minHeight: 200,
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
