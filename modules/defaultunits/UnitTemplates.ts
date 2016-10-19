import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";

import battleCruiser from  "./templates/battleCruiser";
import commandShip from  "./templates/commandShip";
import stealthShip from  "./templates/stealthShip";
import debugShip from  "./templates/debugShip";
import scout from  "./templates/scout";
import bomberSquadron from  "./templates/bomberSquadron";
import fighterSquadron from  "./templates/fighterSquadron";
import shieldBoat from  "./templates/shieldBoat";

const UnitTemplates: TemplateCollection<UnitTemplate> =
{
  [battleCruiser.type]: battleCruiser,
  [commandShip.type]: commandShip,
  [stealthShip.type]: stealthShip,
  [debugShip.type]: debugShip,
  [scout.type]: scout,
  [bomberSquadron.type]: bomberSquadron,
  [fighterSquadron.type]: fighterSquadron,
  [shieldBoat.type]: shieldBoat
}

export default UnitTemplates;
