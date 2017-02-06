/// <reference path="../../../lib/react-global.d.ts" />

import ConfirmPopup from "../popups/ConfirmPopup";
import {CustomPopupProps} from "../popups/Popup";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import TopMenuPopup from "../popups/TopMenuPopup";

import LoadGame from "../saves/LoadGame";

interface PropTypes extends React.Props<any>
{

}

interface StateType
{
}

export class GameOverScreenComponent extends React.Component<PropTypes, StateType>
{
  displayName = "GameOverScreen";
  state: StateType;
  private popupManager: PopupManagerComponent;

  private popupIDs:
  {
    load: number | undefined;
    newGame: number | undefined;
  } =
  {
    load: undefined,
    newGame: undefined
  }

  private popupProps: CustomPopupProps =
  {
    dragPositionerProps:
    {
      preventAutoResize: true,
    }
  }

  constructor(props: PropTypes)
  {
    super(props);

    this.toggleLoadPopup = this.toggleLoadPopup.bind(this);
    this.toggleNewGamePopup = this.toggleNewGamePopup.bind(this);
  }

  private toggleLoadPopup(): void
  {
    if (isFinite(this.popupIDs.load))
    {
      this.popupManager.closePopup(this.popupIDs.load);
    }
    else
    {
      this.popupIDs.load = this.popupManager.makePopup(
      {
        popupProps: this.popupProps,
        content: TopMenuPopup(
        {
          content: LoadGame(
          {
            handleClose: () =>
            {
              this.popupIDs.load = undefined;
            }
          }),
          handleClose: () =>
          {
            this.popupIDs.load = undefined;
          }
        })
      });
    }
  }
  private toggleNewGamePopup(): void
  {
    if (isFinite(this.popupIDs.newGame))
    {
      this.popupManager.closePopup(this.popupIDs.newGame);
    }
    else
    {
      this.popupIDs.newGame = this.popupManager.makePopup(
      {
        popupProps: this.popupProps,
        content: ConfirmPopup(
        {
          handleOk: () =>
          {
            window.location.reload(false);
          },
          handleClose: () =>
          {
            this.popupIDs.load = undefined;
          },
          content: "Are you sure you want to start a new game?"
        })
      });
    }
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "game-over-screen"
      },
        React.DOM.div(
        {
          className: "game-over-screen-inner"
        },
          React.DOM.h1(
          {
            className: "game-over-header"
          },
            "Game over"
          ),
          React.DOM.div(
          {
            className: "game-over-buttons"
          },
            React.DOM.button(
            {
              className: "game-over-buttons-button",
              onClick: this.toggleLoadPopup,
            },
              "Load"
            ),
            React.DOM.button(
            {
              className: "game-over-buttons-button",
              onClick: this.toggleNewGamePopup,
            },
              "New game"
            ),
          )
        ),
        PopupManager(
        {
          ref: component =>
          {
            this.popupManager = component;
          }
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(GameOverScreenComponent);
export default Factory;
