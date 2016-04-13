import TemplateCollection from "../../src/templateinterfaces/TemplateCollection";
import UnitTemplate from "../../src/templateinterfaces/UnitTemplate";

import battleCruiser from  "./templates/battleCruiser.ts";
import commandShip from  "./templates/commandShip.ts";
import redShip from  "./templates/redShip.ts";
import stealthShip from  "./templates/stealthShip.ts";
import blueShip from  "./templates/blueShip.ts";
import debugShip from  "./templates/debugShip.ts";
import scout from  "./templates/scout.ts";
import bomberSquadron from  "./templates/bomberSquadron.ts";
import fighterSquadron from  "./templates/fighterSquadron.ts";
import shieldBoat from  "./templates/shieldBoat.ts";

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
