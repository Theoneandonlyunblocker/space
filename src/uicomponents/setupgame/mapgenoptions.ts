/// <reference path="../../utility.ts" />
/// <reference path="../galaxymap/optionsgroup.ts" />
/// <reference path="mapgenoption.ts" />

module Rance
{
  export module UIComponents
  {
    export var MapGenOptions = React.createClass(
    {
      displayName: "MapGenOptions",

      getInitialState: function()
      {
        var defaultValues: any = this.getDefaultValues(this.props.mapGenTemplate);

        var state: any =
        {
          defaultOptionsVisible: true,
          basicOptionsVisible: true,
          advancedOptionsVisible: false
        };

        state = extendObject(state, defaultValues);

        return(state);
      },

      componentWillReceiveProps: function(newProps: any)
      {
        if (newProps.mapGenTemplate.key !== this.props.mapGenTemplate.key)
        {
          this.setState(this.getDefaultValues(newProps.mapGenTemplate));
        }
      },

      getDefaultValues: function(mapGenTemplate: Templates.IMapGenTemplate, unsetOnly: boolean = true)
      {
        var defaultValues = {};

        ["defaultOptions", "basicOptions", "advancedOptions"].forEach(function(optionGroup: string)
        {
          var options = mapGenTemplate.options[optionGroup];
          if (!options) return;

          for (var optionName in options)
          {
            var option = options[optionName];
            var value: number;

            if (unsetOnly && this.state && isFinite(this.getOptionValue(optionName)))
            {
              if (!this.props.mapGenTemplate.options[optionGroup]) continue;

              var oldOption = this.props.mapGenTemplate.options[optionGroup][optionName];

              if (!oldOption) continue;

              var oldValuePercentage = getRelativeValue(
                this.getOptionValue(optionName), oldOption.min, oldOption.max);
              value = option.min + (option.max - option.min) * oldValuePercentage;
            }
            else
            {
              value = isFinite(option.defaultValue) ? option.defaultValue : (option.min + option.max) / 2;
            }

            value = clamp(roundToNearestMultiple(value, option.step), option.min, option.max);
            defaultValues["optionValue_" + optionName] = value; 
          }
        }.bind(this));

        return defaultValues;
      },

      resetValuesToDefault: function()
      {
        this.setState(this.getDefaultValues(this.props.mapGenTemplate, false));
      },

      toggleOptionGroupVisibility: function(visibilityProp: string)
      {
        var newState: any = {};
        newState[visibilityProp] = !this.state[visibilityProp];
        this.setState(newState);
      },

      handleOptionChange: function(optionName: string, newValue: number)
      {
        var changedState: any = {};
        changedState["optionValue_" + optionName] = newValue;

        this.setState(changedState);
      },

      getOptionValue: function(optionName: string)
      {
        return this.state["optionValue_" + optionName];
      },

      logOptions: function()
      {
        console.log(this.getOptionValuesForTemplate());
      },

      randomizeOptions: function()
      {
        var newValues: any = {};

        var optionGroups = this.props.mapGenTemplate.options;
        for (var optionGroupName in optionGroups)
        {
          var optionGroup = optionGroups[optionGroupName];
          for (var optionName in optionGroup)
          {
            var option = optionGroup[optionName];
            var optionValue = clamp(roundToNearestMultiple(randInt(option.min, option.max), option.step), option.min, option.max);
            newValues["optionValue_" + optionName] = optionValue;
          }
        }

        this.setState(newValues);
      },

      getOptionValuesForTemplate: function(): Templates.IMapGenOptionValues
      {
        var optionValues: Templates.IMapGenOptionValues =
          extendObject(this.props.mapGenTemplate.options);

        for (var groupName in optionValues)
        {
          var optionsGroup = optionValues[groupName];

          for (var optionName in optionsGroup)
          {
            var optionValue = this.getOptionValue(optionName);
            if (!isFinite(optionValue))
            {
              throw new Error("Value " + optionValue + " for option " + optionName + " is invalid.");
            }

            optionValues[groupName][optionName] = optionValue;
          }
        }

        return optionValues;
      },

      render: function()
      {
        var optionGroups: ReactComponentPlaceHolder[] = [];

        var optionGroupsInfo =
        {
          defaultOptions:
          {
            title: "Default Options",
            visibilityProp: "defaultOptionsVisible"
          },
          basicOptions:
          {
            title: "Basic Options",
            visibilityProp: "basicOptionsVisible"
          },
          advancedOptions:
          {
            title: "Advanced Options",
            visibilityProp: "advancedOptionsVisible"
          }
        };

        for (var groupName in optionGroupsInfo)
        {
          if (!this.props.mapGenTemplate.options[groupName]) continue;

          var visibilityProp = optionGroupsInfo[groupName].visibilityProp;
          var groupIsVisible = this.state[visibilityProp];

          var options: {key: string; content: ReactComponentPlaceHolder;}[] = [];

          if (groupIsVisible)
          {
            for (var optionName in this.props.mapGenTemplate.options[groupName])
            {
              var option = this.props.mapGenTemplate.options[groupName][optionName];

              options.push(
              {
                key: optionName,
                content: UIComponents.MapGenOption(
                {
                  key: optionName,
                  id: optionName,
                  option: option,
                  value: this.getOptionValue(optionName),
                  onChange: this.handleOptionChange
                })
              });
            }
          }

          var headerProps: any =
          {
            className: "map-gen-options-group-header collapsible",
            onClick: this.toggleOptionGroupVisibility.bind(this, visibilityProp)
          }

          if (!groupIsVisible)
          {
            headerProps.className += " collapsed";
          }

          var header = React.DOM.div(headerProps,
            optionGroupsInfo[groupName].title
          )
          
          optionGroups.push(UIComponents.OptionsGroup(
          {
            key: groupName,
            header: header,
            options: options
          }));
        }

        return(
          React.DOM.div(
          {
            className: "map-gen-options"
          },
            optionGroups,
            React.DOM.button(
            {
              onClick: this.logOptions
            },
              "log option values"
            ),
            React.DOM.button(
            {
              onClick: this.randomizeOptions
            },
              "randomize"
            ),
            React.DOM.button(
            {
              onClick: this.resetValuesToDefault
            },
              "reset"
            )
          )
        );
      }
    })
  }
}
