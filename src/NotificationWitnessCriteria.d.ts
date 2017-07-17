export declare enum NotificationWitnessCriteria
{
  always                = 1 << 0,
  isInvolved            = 1 << 1,
  metOneInvolvedPlayer  = 1 << 2,
  metAllInvolvedPlayers = 1 << 3,
  locationIsRevealed    = 1 << 4,
  locationIsVisible     = 1 << 5,
  locationIsDetected    = 1 << 6,
}
