import {wasWere} from "../../../../localization/en/_helpers";

const battleFinish =
{
  attackSuccessful: "{attackerName} successfully attacked {locationName}.",
  attackUnsuccessful: "{attackerName} unsuccessfully attacked {locationName}.",
  locationConquered: "{attackerName} now controls {locationName}.",
  locationNotConquered: "{defenderName} maintains control of {locationName}.",
};

export const notificationMessages =
{
  battleFinishTitle: "Battle finished",
  battleFinishMessage: "A battle was fought in {locationName} between {attackerName} and {defenderName}",

  battleFinishText_attackerLost: `${battleFinish.attackUnsuccessful} ${battleFinish.locationNotConquered}`,
  battleFinishText_attackerWon: `${battleFinish.attackSuccessful} ${battleFinish.locationNotConquered}`,
  battleFinishText_locationConquered: `${battleFinish.attackSuccessful} ${battleFinish.locationConquered}`,

  playerDiedTitle: "Player eliminated",
  playerDiedMessage: `{playerName} ${wasWere("count")} eliminated.`,
  playerDiedTextTop: "Here lies {playerName}.",
  playerDiedTextBottom: "{playerPronoun} never scored.",

  warDeclarationTitle: "War declaration",
  warDeclarationMessage: "{aggressorName} declared war on {defenderName}.",
  warDeclarationText: "{aggressorName} declared war on {defenderName}.",
};
