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

        ["defaultOptions", "basicOptions"].forEach(function(optionGroup)
        {
          var options = mapGenTemplate[optionGroup];
          if (!options) return;

          for (var optionName in options)
          {
            var option = options[optionName];
            var avg = (option.min + option.max) / 2;
            avg = roundToNearestMultiple(avg, option.step);
            defaultValues["optionValue_" + optionName] = avg; 
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
      
      makeFoldedOptionGroupElement: function(visibilityProp: string)
      {
        return(
          React.DOM.div(
          {
            className: "map-gen-option-group-folded",
            onClick: this.toggleOptionGroupVisibility.bind(this, visibilityProp)
          })
        )
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

      render: function()
      {
        var optionGroups = [];

        var optionGroupsInfo =
        {
          defaultOptions:
          {
            header: "Default Options",
            visibilityProp: "defaultOptionsVisible"
          },
          basicOptions:
          {
            header: "Basic Options",
            visibilityProp: "basicOptionsVisible"
          }
        };

        for (var groupName in optionGroupsInfo)
        {
          var visibilityProp = optionGroupsInfo[groupName].visibilityProp;

          var options = [];

          for (var optionName in this.props.mapGenTemplate[groupName])
          {
            var option = this.props.mapGenTemplate[groupName][optionName];

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
          optionGroups.push(UIComponents.OptionsGroup(
          {
            key: groupName,
            header: optionGroupsInfo[groupName].header,
            collapsedElement: this.state.visibilityProp ?
              null :
              this.makeFoldedOptionGroupElement(visibilityProp),
            options: options
          }));
        }

        return(
          React.DOM.div(
          {
            className: "map-gen-options"
          },
            "options label",
            optionGroups
          )
        );
      }
    })
  }
}
