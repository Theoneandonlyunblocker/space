/**
 * used to allow modules to utilize each other's content without hard-coding
 * for example, a high tech faction being able to build everything marked with the high tech flag
 *
 * implementation for all flags except "coreAvailabilityFlags.always" & "coreAvailabilityFlags.alwaysInDebugMode" is left to the consuming module
 */
// see DistributionData for randomly distributed things
export interface AvailabilityData
{
  flags: string[];
}

export const coreAvailabilityFlags =
{
  /**
   * always available no matter what
   */
  always: "always",

  /**
   * always available when debug mode is enabled
   */
  alwaysInDebugMode: "alwaysInDebugMode",

  /**
   * should be made available unless implementing module has a very good reason not to
   */
  crucial: "crucial",
};
