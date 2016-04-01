/// <reference path="../../player.ts" />

/// <reference path="../trade/tradeoverview.ts" />

export var DiplomacyActions = React.createFactory(React.createClass(
{
  displayName: "DiplomacyActions",

  propTypes:
  {
    player: React.PropTypes.instanceOf(Player).isRequired,
    targetPlayer: React.PropTypes.instanceOf(Player).isRequired,
    onUpdate: React.PropTypes.func.isRequired
  },

  getInitialState: function()
  {
    return(
    {
      trade: undefined
    });
  },
  
  closePopup: function(popupType: string)
  {
    this.refs.popupManager.closePopup(this.state[popupType]);
    var stateObj: any = {};
    stateObj[popupType] = undefined;
    this.setState(stateObj);
  },

  makePopup: function(popupType: string)
  {
    var contentConstructor: ReactComponentPlaceHolder;
    var contentProps: any;
    var popupProps: any =
    {
      resizable: true,
      containerDragOnly: true,
      minWidth: 150,
      minHeight: 50,
      preventAutoResize: true
    };

    switch (popupType)
    {
      case "trade":
      {
        contentConstructor = UIComponents.TradeOverview;
        contentProps =
        {
          selfPlayer: this.props.player,
          otherPlayer: this.props.targetPlayer,
          handleClose: this.closePopup.bind(this, popupType)
        };
        break;
      }
    }

    var id = this.refs.popupManager.makePopup(
    {
      contentConstructor: UIComponents.TopMenuPopup,
      contentProps:
      {
        contentConstructor: contentConstructor,
        contentProps: contentProps,
        handleClose: this.closePopup.bind(this, popupType)
      },
      popupProps: popupProps
    });

    var stateObj: any = {};
    stateObj[popupType] = id;
    this.setState(stateObj)
  },

  togglePopup: function(popupType: string)
  {
    if (isFinite(this.state[popupType]))
    {
      this.closePopup(popupType);
    }
    else
    {
      this.makePopup(popupType);
    }
  },

  handleDeclareWar: function()
  {
    this.props.player.diplomacyStatus.declareWarOn(this.props.targetPlayer);
    this.props.onUpdate();
  },
  handleMakePeace: function()
  {
    this.props.player.diplomacyStatus.makePeaceWith(this.props.targetPlayer);
    this.props.onUpdate();
  },

  render: function()
  {
    var player = this.props.player;
    var targetPlayer = this.props.targetPlayer;


    var declareWarProps: any =
    {
      className: "diplomacy-action-button"
    };

    if (player.diplomacyStatus.canDeclareWarOn(targetPlayer))
    {
      declareWarProps.onClick = this.handleDeclareWar;
    }
    else
    {
      declareWarProps.disabled = true;
      declareWarProps.className += " disabled";
    }

    var makePeaceProps: any =
    {
      className: "diplomacy-action-button"
    };

    if (player.diplomacyStatus.canMakePeaceWith(targetPlayer))
    {
      makePeaceProps.onClick = this.handleMakePeace;
    }
    else
    {
      makePeaceProps.disabled = true;
      makePeaceProps.className += " disabled";
    }

    return(
      React.DOM.div(
      {
        className: "diplomacy-actions-container draggable-container"
      },
        UIComponents.PopupManager(
        {
          ref: "popupManager",
          onlyAllowOne: true
        }),
        React.DOM.button(
        {
          className: "light-box-close",
          onClick: this.props.closePopup
        }, "X"),
        React.DOM.div(
        {
          className: "diplomacy-actions"
        },
          React.DOM.div(
          {
            className: "diplomacy-actions-header"
          },
            targetPlayer.name
          ),
          React.DOM.button(declareWarProps,
            "Declare war"
          ),
          React.DOM.button(makePeaceProps,
            "Make peace"
          ),
          React.DOM.button(
          {
            className: "diplomacy-action-button",
            onClick: this.togglePopup.bind(this, "trade")
          },
            "Trade"
          )
        )
      )
    );
  }
}));
