module Rance
{
  export module Templates
  {
    export interface IResourceTemplate
    {
      type: string;
      displayName: string;
      rarity: number; // 0 to 1; random candidate is picked from available resources
                      // and if Math.random() < rarity, it's chosen. Else pick another
      distributionGroups: string[]; // sector needs to have any of these flags
                                    // to possibly spawn resource there
      
    }
    export module Resources
    {
      export var testResource1
      {
        type: "testResource1",
        displayName: "Test Resource 1",
        rarity: 1,
        distributionGroups: ["common"]
      }
      export var testResource2
      {
        type: "testResource2",
        displayName: "Test Resource 2",
        rarity: 1,
        distributionGroups: ["common"]
      }
      export var testResource3
      {
        type: "testResource3",
        displayName: "Test Resource 3",
        rarity: 1,
        distributionGroups: ["common"]
      }
      export var testResource4
      {
        type: "testResource4",
        displayName: "Test Resource 4",
        rarity: 1,
        distributionGroups: ["common", "rare"]
      }
      export var testResource5
      {
        type: "testResource5",
        displayName: "Test Resource 5",
        rarity: 1,
        distributionGroups: ["common", "rare"]
      }
    }
  }
}