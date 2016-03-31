/// <reference path="../../../src/templateinterfaces/iresourcetemplate.d.ts"/>
/// <reference path="../../../src/templateinterfaces/idistributable.d.ts" />

namespace Rance
{
  export namespace Modules
  {
    export namespace DefaultModule
    {
      export namespace Templates
      {
        export namespace Resources
        {
          export var testResource1: Rance.Templates.IResourceTemplate =
          {
            type: "testResource1",
            displayName: "Test Resource 1",
            icon: "modules\/default\/img\/resources\/test1.png",
            rarity: 1,
            distributionGroups: ["common"]
          }
          export var testResource2: Rance.Templates.IResourceTemplate =
          {
            type: "testResource2",
            displayName: "Test Resource 2",
            icon: "modules\/default\/img\/resources\/test2.png",
            rarity: 1,
            distributionGroups: ["common"]
          }
          export var testResource3: Rance.Templates.IResourceTemplate =
          {
            type: "testResource3",
            displayName: "Test Resource 3",
            icon: "modules\/default\/img\/resources\/test3.png",
            rarity: 1,
            distributionGroups: ["common"]
          }
          export var testResource4: Rance.Templates.IResourceTemplate =
          {
            type: "testResource4",
            displayName: "Test Resource 4",
            icon: "modules\/default\/img\/resources\/test4.png",
            rarity: 1,
            distributionGroups: ["rare"]
          }
          export var testResource5: Rance.Templates.IResourceTemplate =
          {
            type: "testResource5",
            displayName: "Test Resource 5",
            icon: "modules\/default\/img\/resources\/test5.png",
            rarity: 1,
            distributionGroups: ["rare"]
          }
        }
      }
    }
  }
}