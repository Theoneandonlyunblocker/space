import {NotificationMessageArgs} from "../NotificationMessageArgs";


const battleFinish =
{
  attacked: "{attackerName} attacked {defenderName} in {locationName}.",
  locationConquered: "{attackerName} now {attackerName, sVerb, control} {locationName}.",
  locationNotConquered: "{defenderName} {defenderName, sVerb, maintain} control of {locationName}.",
};

export const notificationMessages: Record<keyof NotificationMessageArgs, string> =
{
  battleFinishTitle: "Battle finished",
  battleFinishMessage: "A battle was fought between {attackerName} and {defenderName}",

  battleFinishText_attackerLost: `${battleFinish.attacked}\n\n${battleFinish.locationNotConquered}`,
  battleFinishText_attackerWon: `${battleFinish.attacked}\n\n${battleFinish.locationNotConquered}`,
  battleFinishText_locationConquered: `${battleFinish.attacked}\n\n${battleFinish.locationConquered}`,

  playerDiedTitle: "Player eliminated",
  playerDiedMessage: "{playerName} {playerName, wasWere} eliminated.",
  playerDiedTextTop: "Here {playerName, sVerb, lie} {playerName}.",
  playerDiedTextBottom: "{_, capitalize, {playerName, pronoun, thirdPerson}} never scored.",

  warDeclarationTitle: "War declaration",
  warDeclarationMessage: "{aggressorName} declared war on {defenderName}.",
  warDeclarationText: "{aggressorName} declared war on {defenderName}.",
};
