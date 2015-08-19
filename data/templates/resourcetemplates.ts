module Rance
{
  export module Templates
  {
    export interface IResourceTemplate
    {
      type: string;
      displayName: string;
      icon: string;
      rarity: number; // relative probability resource is picked from pool of
                      // available resources
      distributionGroups: string[]; // sector needs to have any of these flags
                                    // to possibly spawn resource there
      
    }
    export module Resources
    {
      export var testResource1: IResourceTemplate =
      {
        type: "testResource1",
        displayName: "Test Resource 1",
        icon: "img\/resources\/test1.png",
        rarity: 1,
        distributionGroups: ["common"]
      }
      export var testResource2: IResourceTemplate =
      {
        type: "testResource2",
        displayName: "Test Resource 2",
        icon: "img\/resources\/test2.png",
        rarity: 1,
        distributionGroups: ["common"]
      }
      export var testResource3: IResourceTemplate =
      {
        type: "testResource3",
        displayName: "Test Resource 3",
        icon: "img\/resources\/test3.png",
        rarity: 1,
        distributionGroups: ["common"]
      }
      export var testResource4: IResourceTemplate =
      {
        type: "testResource4",
        displayName: "Test Resource 4",
        icon: "img\/resources\/test4.png",
        rarity: 1,
        distributionGroups: ["rare"]
      }
      export var testResource5: IResourceTemplate =
      {
        type: "testResource5",
        displayName: "Test Resource 5",
        icon: "img\/resources\/test5.png",
        rarity: 1,
        distributionGroups: ["rare"]
      }
    }
  }
}