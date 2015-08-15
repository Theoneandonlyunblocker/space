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
        var defaultValues: any = this.getUnsetDefaultValues(this.props.mapGenTemplate);

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
          this.setState(this.getUnsetDefaultValues(newProps.mapGenTemplate));
        }
      },

      getUnsetDefaultValues: function(mapGenTemplate)
      {
        var defaultValues = {};

        ["defaultOptions", "basicOptions", "advancedOptions"].forEach(function(optionGroup)
        {
          var options = mapGenTemplate.options[optionGroup];
          if (!options) return;

          for (var optionName in options)
          {
            var option = options[optionName];
            var value: number;

            if (this.state && isFinite(this.getOptionValue(optionName)))
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
              value = (option.min + option.max) / 2;
            }

            value = roundToNearestMultiple(value, option.step);
            defaultValues["optionValue_" + optionName] = value; 
          }
        }.bind(this));

        return defaultValues;
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

      getOptionValuesForTemplate: function()
      {
        var optionsObject = extendObject(this.props.mapGenTemplate.options);

        for (var groupName in optionsObject)
        {
          var optionsGroup = optionsObject[groupName];

          for (var optionName in optionsGroup)
          {
            var optionValue = this.getOptionValue(optionName);
            if (!isFinite(optionValue))
            {
              throw new Error("Value " + optionValue + " for option " + optionName + " is invalid.");
            }

            optionsObject[groupName][optionName] = optionValue;
          }
        }

        return optionsObject;
      },

      render: function()
      {
        var optionGroups = [];

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

          var options = [];

          if (groupIsVisible)
          {
            for (var optionName in this.props.mapGenTemplate.options[groupName])
            {
              var option = this.props.mapGenTemplate.options[groupName][optionName];

              options.push(
              {
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
            )
          )
        );
      }
    })
  }
}
