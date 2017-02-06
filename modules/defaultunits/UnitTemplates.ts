import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";

import battleCruiser from  "./templates/battleCruiser";
import bomberSquadron from  "./templates/bomberSquadron";
import commandShip from  "./templates/commandShip";
import debugShip from  "./templates/debugShip";
import fighterSquadron from  "./templates/fighterSquadron";
import scout from  "./templates/scout";
import shieldBoat from  "./templates/shieldBoat";
import stealthShip from  "./templates/stealthShip";

const UnitTemplates: TemplateCollection<UnitTemplate> =
{
  [battleCruiser.type]: battleCruiser,
  [commandShip.type]: commandShip,
  [stealthShip.type]: stealthShip,
  [debugShip.type]: debugShip,
  [scout.type]: scout,
  [bomberSquadron.type]: bomberSquadron,
  [fighterSquadron.type]: fighterSquadron,
  [shieldBoat.type]: shieldBoat,
};

export default UnitTemplates;
