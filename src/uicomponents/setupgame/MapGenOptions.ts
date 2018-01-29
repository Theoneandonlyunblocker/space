import * as React from "react";


import Range from "../../Range";
import
{
  clamp,
  extendObject,
  getRelativeValue,
  randInt,
  roundToNearestMultiple,
} from "../../utility";

import MapGenOptionValues from "../../templateinterfaces/MapGenOptionValues";
import MapGenOptions from "../../templateinterfaces/MapGenOptions";
import MapGenTemplate from "../../templateinterfaces/MapGenTemplate";

import OptionsGroup from "../galaxymap/OptionsGroup";

import MapGenOption from "./MapGenOption";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  mapGenTemplate: MapGenTemplate;
}

interface StateType
{
  // has property for every option value in this.props.mapGenTemplate
  // TODO refactor | move outside state object (?)
}

export class MapGenOptionsComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "MapGenOptions";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.resetValuesToDefault = this.resetValuesToDefault.bind(this);
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.getDefaultValues = this.getDefaultValues.bind(this);
    this.getOptionValue = this.getOptionValue.bind(this);
    this.randomizeOptions = this.randomizeOptions.bind(this);
    this.getOptionValuesForTemplate = this.getOptionValuesForTemplate.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return this.getDefaultValues(this.props.mapGenTemplate);
  }

  componentWillReceiveProps(newProps: PropTypes)
  {
    if (newProps.mapGenTemplate.key !== this.props.mapGenTemplate.key)
    {
      this.setState(this.getDefaultValues(newProps.mapGenTemplate));
    }
  }

  getDefaultValues(mapGenTemplate: MapGenTemplate, unsetOnly: boolean = true)
  {
    const defaultValues = {};

    ["defaultOptions", "basicOptions", "advancedOptions"].forEach(optionGroup =>
    {
      const options: MapGenOptions = mapGenTemplate.options[optionGroup];
      if (!options) return;

      for (let optionName in options)
      {
        const option: Range = options[optionName].range;
        let value: number;

        if (unsetOnly && this.state && isFinite(this.getOptionValue(optionName)))
        {
          if (!this.props.mapGenTemplate.options[optionGroup]) continue;

          const oldOption = this.props.mapGenTemplate.options[optionGroup][optionName];

          if (!oldOption) continue;

          const oldValuePercentage = getRelativeValue(
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
    });

    return defaultValues;
  }

  resetValuesToDefault()
  {
    this.setState(this.getDefaultValues(this.props.mapGenTemplate, false));
  }

  handleOptionChange(optionName: string, newValue: number)
  {
    const changedState: StateType = {};
    changedState["optionValue_" + optionName] = newValue;

    this.setState(changedState);
  }

  getOptionValue(optionName: string): number
  {
    return this.state["optionValue_" + optionName];
  }

  randomizeOptions()
  {
    const newValues: StateType = {};

    const optionGroups: MapGenOptions = this.props.mapGenTemplate.options;
    for (let optionGroupName in optionGroups)
    {
      const optionGroup = optionGroups[optionGroupName];
      for (let optionName in optionGroup)
      {
        const option = optionGroup[optionName].range;
        const optionValue = clamp(roundToNearestMultiple(randInt(option.min, option.max), option.step), option.min, option.max);
        newValues["optionValue_" + optionName] = optionValue;
      }
    }

    this.setState(newValues);
  }

  getOptionValuesForTemplate(): MapGenOptionValues
  {
    const optionValues: MapGenOptionValues =
      extendObject(this.props.mapGenTemplate.options);

    for (let groupName in optionValues)
    {
      const optionsGroup = optionValues[groupName];

      for (let optionName in optionsGroup)
      {
        const optionValue = this.getOptionValue(optionName);
        if (!isFinite(optionValue))
        {
          throw new Error(`Value ${optionValue} for option ${optionName} is invalid.`);
        }

        optionValues[groupName][optionName] = optionValue;
      }
    }

    return optionValues;
  }

  render()
  {
    const optionGroups: React.ReactElement<any>[] = [];

    const optionGroupsInfo =
    {
      defaultOptions:
      {
        title: localize("defaultOptions")(),
        isCollapsedInitially: false,
      },
      basicOptions:
      {
        title: localize("basicOptions")(),
        isCollapsedInitially: false,
      },
      advancedOptions:
      {
        title: localize("advancedOptions")(),
        isCollapsedInitially: true,
      },
    };

    for (let groupName in optionGroupsInfo)
    {
      if (!this.props.mapGenTemplate.options[groupName]) continue;


      const options: {key: string; content: React.ReactElement<any>;}[] = [];

      for (let optionName in this.props.mapGenTemplate.options[groupName])
      {
        const option = this.props.mapGenTemplate.options[groupName][optionName];

        options.push(
        {
          key: optionName,
          content: MapGenOption(
          {
            key: optionName,
            id: optionName,
            option: option,
            value: this.getOptionValue(optionName),
            onChange: this.handleOptionChange,
          }),
        });
      }

      optionGroups.push(OptionsGroup(
      {
        key: groupName,
        header: optionGroupsInfo[groupName].title,
        options: options,
        isCollapsedInitially: optionGroupsInfo[groupName].isCollapsedInitially,
      }));
    }

    return(
      React.DOM.div(
      {
        className: "map-gen-options",
      },
        React.DOM.div(
        {
          className: "map-gen-options-option-groups",
        },
          optionGroups,
        ),
        React.DOM.div(
        {
          className: "map-gen-options-buttons",
        },
          React.DOM.button(
          {
            className: "map-gen-options-button",
            onClick: this.randomizeOptions,
          },
            localize("randomize")(),
          ),
          React.DOM.button(
          {
            className: "map-gen-options-button",
            onClick: this.resetValuesToDefault,
          },
            localize("reset")(),
          ),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(MapGenOptionsComponent);
export default Factory;
