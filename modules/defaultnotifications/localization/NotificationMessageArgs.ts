import { Name } from "core/src/localization/Name";


export type NotificationMessageArgs =
{
  battleFinishTitle: [];
  battleFinishMessage: [{locationName: string; attackerName: Name; defenderName: Name}];
  battleFinishText_attackerLost: [{locationName: string; attackerName: Name; defenderName: Name}];
  battleFinishText_attackerWon: [{locationName: string; attackerName: Name; defenderName: Name}];
  battleFinishText_locationConquered: [{locationName: string; attackerName: Name}];
  playerDiedTitle: [];
  playerDiedMessage: [{playerName: Name}];
  playerDiedTextTop: [{playerName: Name}];
  playerDiedTextBottom: [{playerName: Name}];
  warDeclarationTitle: [];
  warDeclarationMessage: [{aggressorName: Name; defenderName: Name}];
  warDeclarationText: [{aggressorName: Name; defenderName: Name}];
};
