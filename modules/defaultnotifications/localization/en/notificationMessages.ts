import {wasWere} from "../../../../localization/en/_helpers";

export const notificationMessages =
{
  battleFinishTitle: "Battle finished",
  battleFinishMessage: "A battle was fought in {locationName} between {attackerName} and {defenderName}",
  attackSuccessful: "{attackerName} successfully attacked {locationName}.",
  attackUnsuccessful: "{attackerName} unsuccessfully attacked {locationName}.",
  locationConquered: "{attackerName} now controls {locationName}.",
  locationNotConquered: "{defenderName} maintains control of {locationName}.",
  battleFinishText_attackerLost: "[attackUnsuccessful] [locationNotConquered]",
  battleFinishText_attackerWon: "[attackSuccessful] [locationNotConquered]",
  battleFinishText_locationConquered: "[attackSuccessful] [locationConquered]",

  playerDiedTitle: "Player eliminated",
  playerDiedMessage: `{playerName} ${wasWere("count")} eliminated.`,
  playerDiedTextTop: "Here lies {playerName}.",
  playerDiedTextBottom: "{playerPronoun} never scored.",

  warDeclarationTitle: "War declaration",
  warDeclarationMessage: "{aggressorName} declared war on {defenderName}.",
  warDeclarationText: "{aggressorName} declared war on {defenderName}.",
};
