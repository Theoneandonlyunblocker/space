/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import Unit from "../../Unit";
import PassiveSkillTemplate from "../../templateinterfaces/PassiveSkillTemplate";


interface PropTypes extends React.Props<any>
{
  unit: Unit;
  isBattlePrep: boolean;
}

interface StateType
{
}

export class UnitStatusEffectsComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "UnitStatusEffects";
  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var statusEffects: React.HTMLElement[] = [];

    var withItems = this.props.unit.getAttributesWithItems();
    var withEffects = this.props.unit.getAttributesWithEffects();

    for (let attribute in withEffects)
    {
      if (attribute === "maxActionPoints") continue;

      var ite = withItems[attribute];
      var eff = withEffects[attribute];

      if (ite === eff) continue;

      var polarityString = eff > ite ? "positive" : "negative";
      var polaritySign = eff > ite ? " +" : " ";

      var imageSrc = "img/icons/statusEffect_" + polarityString + "_" + attribute + ".png";

      var titleString = "" + attribute + polaritySign + (eff - ite);

      statusEffects.push(React.DOM.img(
      {
        className: "status-effect-icon" + " status-effect-icon-" + attribute,
        src: imageSrc,
        key: attribute,
        title: titleString
      }))
    }

    var passiveSkills: PassiveSkillTemplate[] = [];
    var passiveSkillsByPhase = this.props.unit.getPassiveSkillsByPhase();
    var phasesToCheck = this.props.isBattlePrep ? ["atBattleStart"] : ["beforeAbilityUse", "afterAbilityUse"];

    phasesToCheck.forEach(function(phase: string)
    {
      if (passiveSkillsByPhase[phase])
      {
        for (let i = 0; i < passiveSkillsByPhase[phase].length; i++)
        {
          var skill = passiveSkillsByPhase[phase][i];
          if (!skill.isHidden)
          {
            passiveSkills.push(skill);
          }
        }
      }
    });

    var passiveSkillsElement: React.HTMLElement = null;
    if (passiveSkills.length > 0)
    {
      var passiveSkillsElementTitle: string = "";
      for (let i = 0; i < passiveSkills.length; i++)
      {
        passiveSkillsElementTitle += passiveSkills[i].displayName + ": " +
          passiveSkills[i].description + "\n";
      }

      passiveSkillsElement = React.DOM.img(
      {
        className: "unit-status-effects-passive-skills",
        src: "img/icons/availableAction.png",
        title: passiveSkillsElementTitle
      })
    }

    return(
      React.DOM.div(
      {
        className: "unit-status-effects-container"
      },
        passiveSkillsElement,
        React.DOM.div(
        {
          className: "unit-status-effects-attributes"
        },
          statusEffects
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitStatusEffectsComponent);
export default Factory;
