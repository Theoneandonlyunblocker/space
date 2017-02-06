/// <reference path="../../../lib/react-global.d.ts" />

import AbilityUpgradeData from "../../AbilityUpgradeData";
import Unit from "../../Unit";
import AbilityBase from "../../templateinterfaces/AbilityBase";
import {default as PopupManager, PopupManagerComponent} from "../popups/PopupManager";
import TopMenuPopup from "../popups/TopMenuPopup";
import UpgradeAbilities from "./UpgradeAbilities";
import UpgradeAttributes from "./UpgradeAttributes";


export interface PropTypes extends React.Props<any>
{
  unit: Unit;
  onUnitUpgrade: () => void;
}

interface StateType
{
  popupId?: number;
  upgradeData?: AbilityUpgradeData;
}

export class UpgradeUnitComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UpgradeUnit";
  state: StateType;
  popupManager: PopupManagerComponent;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.upgradeAttribute = this.upgradeAttribute.bind(this);
    this.upgradeAbility = this.upgradeAbility.bind(this);
    this.makeAbilityLearnPopup = this.makeAbilityLearnPopup.bind(this);
    this.closePopup = this.closePopup.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      upgradeData: this.props.unit.getAbilityUpgradeData(),
      popupId: undefined,
    });
  }
  upgradeAbility(source: AbilityBase, newAbility: AbilityBase)
  {
    var unit = this.props.unit;
    unit.upgradeAbility(source, newAbility);
    unit.handleLevelUp();
    this.setState(
    {
      upgradeData: unit.getAbilityUpgradeData(),
    });
    this.closePopup();
    this.props.onUnitUpgrade();
  }
  upgradeAttribute(attribute: string)
  {
    var unit = this.props.unit;

    unit.baseAttributes[attribute] += 1;
    unit.attributesAreDirty = true;

    unit.handleLevelUp();
    this.props.onUnitUpgrade();
  }
  makeAbilityLearnPopup(ability: AbilityBase)
  {
    var upgradeData = this.state.upgradeData[ability.type];
    var popupId = this.popupManager.makePopup(
    {
      content: TopMenuPopup(
      {
        handleClose: this.closePopup,
        content: UpgradeAbilities(
        {
          abilities: upgradeData.possibleUpgrades,
          handleClick: this.upgradeAbility.bind(this, upgradeData.base),
          sourceAbility: upgradeData.base,
          learningNewability: !Boolean(upgradeData.base),
        }),
      }),
      popupProps:
      {
        dragPositionerProps:
        {
          preventAutoResize: true,
          containerDragOnly: true,
        },
      },
    });

    this.setState(
    {
      popupId: popupId,
    });
  }
  closePopup()
  {
    this.popupManager.closePopup(this.state.popupId);
    this.setState(
    {
      popupId: undefined,
    });
  }
  render()
  {
    var unit = this.props.unit;
    var upgradableAbilities: AbilityBase[] = [];

    for (let source in this.state.upgradeData)
    {
      if (this.state.upgradeData[source].base)
      {
        upgradableAbilities.push(this.state.upgradeData[source].base);
      }
      else
      {
        upgradableAbilities.push(
        {
          type: source,
          displayName: "** New ability **",
          description: "",
        });
      }
    }

    return(
      React.DOM.div(
      {
        className: "upgrade-unit",
      },
        PopupManager(
        {
          ref: (component: PopupManagerComponent) =>
          {
            this.popupManager = component;
          },
          onlyAllowOne: true,
        }),
        React.DOM.div(
        {
          className: "upgrade-unit-header",
        },
          unit.name + "  " + "Level " + unit.level + " -> " + (unit.level + 1),
        ),
        UpgradeAbilities(
        {
          abilities: upgradableAbilities,
          handleClick: this.makeAbilityLearnPopup,
        }),
        UpgradeAttributes(
        {
          unit: unit,
          handleClick: this.upgradeAttribute,
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UpgradeUnitComponent);
export default Factory;
