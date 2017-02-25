/* OLD STUFF
-- objectives ai
get expansion targets
create expansion objectives with priority based on score
add flat amount of priority if objective is ongoing
sort objectives by priority
while under max active expansion objectives
  make highest priority expansion objective active

-- fronts ai
divide available units to fronts based on priority
make requests for extra units if needed
muster units at muster location
when requested units arrive
  move units to target location
  execute action

-- economy ai
build units near request target
 */

/*
scouting objectives
  discovery
    find new locations
  tracking
    track enemy armies
  perimeter
    create perimeter of vision around own locations
END OLD STUFF*/

/*
diplo           |
front requests  V
econ
front moves
diplo
econ
*/

import {DiplomaticObjective} from "../objectives/common/DiplomaticObjective";
import {EconomicObjective} from "../objectives/common/EconomicObjective";
import {FrontObjective} from "../objectives/common/FrontObjective";

export class ObjectivesAI
{
  private diplomaticObjectives: DiplomaticObjective[];
  private economicObjectives: EconomicObjective[];
  private frontObjectives: FrontObjective[];

  public processDiplomaticObjectives(): void
  {

  }
  public processEconomicObjectives(): void
  {

  }
  public createFrontRequests(): void
  {

  }
  public executeFrontMoves(): void
  {

  }
}

