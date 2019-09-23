import {NotificationMessageArgs} from "../NotificationMessageArgs";


const battleFinish =
{
  attackSuccessful: "{attackerName} successfully attacked {locationName}.",
  attackUnsuccessful: "{attackerName} unsuccessfully attacked {locationName}.",
  locationConquered: "{attackerName} now {attackerName, sVerb, control} {locationName}.",
  locationNotConquered: "{defenderName} {defenderName, sVerb, maintain} control of {locationName}.",
};

export const notificationMessages: Record<keyof NotificationMessageArgs, string> =
{
  battleFinishTitle: "Battle finished",
  battleFinishMessage: "A battle was fought in {locationName} between {attackerName} and {defenderName}",

  battleFinishText_attackerLost: `${battleFinish.attackUnsuccessful}\n${battleFinish.locationNotConquered}`,
  battleFinishText_attackerWon: `${battleFinish.attackSuccessful}\n${battleFinish.locationNotConquered}`,
  battleFinishText_locationConquered: `${battleFinish.attackSuccessful}\n${battleFinish.locationConquered}`,

  playerDiedTitle: "Player eliminated",
  playerDiedMessage: "{playerName} {playerName, wasWere} eliminated.",
  playerDiedTextTop: "Here {playerName, sVerb, lie} {playerName}.",
  playerDiedTextBottom: "{_, capitalize, {playerName, pronoun, thirdPerson}} never scored.",

  warDeclarationTitle: "War declaration",
  warDeclarationMessage: "{aggressorName} declared war on {defenderName}.",
  warDeclarationText: "{aggressorName} declared war on {defenderName}.",
};
