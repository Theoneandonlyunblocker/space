/// <reference path="../../../lib/react-global.d.ts" />

import Unit from "../../Unit";
import PassiveSkillTemplate from "../../templateinterfaces/PassiveSkillTemplate";
import {PartialUnitAttributes} from "../../UnitAttributes";


interface PropTypes extends React.Props<any>
{
  attributeChanges?: PartialUnitAttributes;
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

    var passiveSkillsElement: React.ReactHTMLElement<any> = null;
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
        passiveSkillsElement
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(UnitStatusEffectsComponent);
export default Factory;
