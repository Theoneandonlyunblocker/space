import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";

import battleCruiser from  "./templates/battleCruiser";
import commandShip from  "./templates/commandShip";
import redShip from  "./templates/redShip";
import stealthShip from  "./templates/stealthShip";
import blueShip from  "./templates/blueShip";
import debugShip from  "./templates/debugShip";
import scout from  "./templates/scout";
import bomberSquadron from  "./templates/bomberSquadron";
import fighterSquadron from  "./templates/fighterSquadron";
import shieldBoat from  "./templates/shieldBoat";

const UnitTemplates: TemplateCollection<UnitTemplate> =
{
  [battleCruiser.type]: battleCruiser,
  [commandShip.type]: commandShip,
  [redShip.type]: redShip,
  [stealthShip.type]: stealthShip,
  [blueShip.type]: blueShip,
  [debugShip.type]: debugShip,
  [scout.type]: scout,
  [bomberSquadron.type]: bomberSquadron,
  [fighterSquadron.type]: fighterSquadron,
  [shieldBoat.type]: shieldBoat
}

export default UnitTemplates;
