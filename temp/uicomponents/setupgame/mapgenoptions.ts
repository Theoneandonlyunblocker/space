/// <reference path="../../utility.ts" />
/// <reference path="../galaxymap/optionsgroup.ts" />
/// <reference path="mapgenoption.ts" />

/// <reference path="../../templateinterfaces/mapgenoptions.d.ts" />

export var MapGenOptions = React.createFactory(React.createClass(
{
  displayName: "MapGenOptions",

  getInitialState: function()
  {
    return this.getDefaultValues(this.props.mapGenTemplate);
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
      var options: Templates.IMapGenOptions = mapGenTemplate.options[optionGroup];
      if (!options) return;

      for (var optionName in options)
      {
        var option: IRange = options[optionName].range;
        var value: number;

        if (unsetOnly && this.state && isFinite(this.getOptionValue(optionName)))
        {
          if (!this.props.mapGenTemplate.options[optionGroup]) continue;

          var oldOption = this.props.mapGenTemplate.options[optionGroup][optionName];

          if (!oldOption) continue;

          var oldValuePercentage = getRelativeValue(
            this.getOptionValue(optionName), oldOption.range.min, oldOption.range.max);
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

  randomizeOptions: function()
  {
    var newValues: any = {};

    var optionGroups: Templates.IMapGenOptions = this.props.mapGenTemplate.options;
    for (var optionGroupName in optionGroups)
    {
      var optionGroup = optionGroups[optionGroupName];
      for (var optionName in optionGroup)
      {
        var option = optionGroup[optionName].range;
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
        isCollapsedInitially: false
      },
      basicOptions:
      {
        title: "Basic Options",
        isCollapsedInitially: false
      },
      advancedOptions:
      {
        title: "Advanced Options",
        isCollapsedInitially: true
      }
    };

    for (var groupName in optionGroupsInfo)
    {
      if (!this.props.mapGenTemplate.options[groupName]) continue;


      var options: {key: string; content: ReactComponentPlaceHolder;}[] = [];

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
      
      optionGroups.push(UIComponents.OptionsGroup(
      {
        key: groupName,
        header: optionGroupsInfo[groupName].title,
        options: options,
        isCollapsedInitially: optionGroupsInfo[groupName].isCollapsedInitially
      }));
    }

    return(
      React.DOM.div(
      {
        className: "map-gen-options"
      },
        React.DOM.div(
        {
          className: "map-gen-options-option-groups"
        },
          optionGroups
        ),
        React.DOM.div(
        {
          className: "map-gen-options-buttons"
        },
          React.DOM.button(
          {
            className: "map-gen-options-button",
            onClick: this.randomizeOptions
          },
            "randomize"
          ),
          React.DOM.button(
          {
            className: "map-gen-options-button",
            onClick: this.resetValuesToDefault
          },
            "reset"
          )
        )
      )
    );
  }
}));
