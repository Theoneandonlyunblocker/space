/// <reference path="optionsgroup.ts"/>

module Rance
{
  export module UIComponents
  {
    export var OptionsList = React.createClass(
    {
      displayName: "OptionsList",

      makeBattleAnimationOption: function(stage: string)
      {
        if (!isFinite(Options.battleAnimationTiming[stage]))
        {
          console.warn("Invalid option", stage);
          return;
        }

        var onChangeFN = function(e)
        {
          var value = parseInt(e.target.value);
          if (!isFinite(value))
          {
            console.warn("Invalid value", value, "for option", stage);
            return;
          }
          value = clamp(value, parseInt(e.target.min), parseInt(e.target.max));
          Options.battleAnimationTiming[stage] = value;
          this.forceUpdate();
        }.bind(this);

        var key = "battle-animation-option-" + stage;

        return(
        {
          content: React.DOM.div(
          {

          },
            React.DOM.input(
            {
              type: "number",
              id: key,
              value: Options.battleAnimationTiming[stage],
              min: 0,
              max: 10000,
              step: 10,
              onChange: onChangeFN
            }),
            React.DOM.label(
            {
              htmlFor: key
            },
              stage
            )
          )
        });

      },

      handleResetAllOptions: function()
      {
        var resetFN = function()
        {
          Options = extendObject(defaultOptions);
          this.forceUpdate();
        }.bind(this);

        var confirmProps =
        {
          handleOk: resetFN,
          contentText: "Are you sure you want to reset all options?"
        }

        this.refs.popupManager.makePopup(
        {
          contentConstructor: UIComponents.ConfirmPopup,
          contentProps: confirmProps
        });
      },

      render: function()
      {
        var allOptions = [];

        // battle animation timing
        var battleAnimationOptions: any[] = [];
        for (var stage in Options.battleAnimationTiming)
        {
          battleAnimationOptions.push(this.makeBattleAnimationOption(stage));
        }
        allOptions.push(UIComponents.OptionsGroup(
        {
          header: "Battle animation timing",
          options: battleAnimationOptions,
          resetFN: function()
          {
            extendObject(defaultOptions.battleAnimationTiming, Options.battleAnimationTiming);
            this.forceUpdate();
          }.bind(this),
          key: "battleAnimationOptions"
        }));

        return(
          React.DOM.div({className: "options"},

            UIComponents.PopupManager(
            {
              ref: "popupManager"
            }),

            React.DOM.div({className: "options-header"},
              "Options",
              React.DOM.button(
              {
                className: "reset-options-button reset-all-options-button",
                onClick: this.handleResetAllOptions
              },
                "Reset all options"
              )
            ),
            allOptions
          )
        );
      }
    });
  }
}