import {ResourceTemplate} from "core/src/templateinterfaces/ResourceTemplate";
import { localize } from "modules/space/localization/localize";
import { getResourceIcon } from "modules/space/assets/resources/resourceAssets";


export const testResource1: ResourceTemplate =
{
  key: "testResource1",
  get displayName()
  {
    return localize("testResource1").toString();
  },
  getIcon: getResourceIcon.bind(null, "test1"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["common"],
  },
  displayOrder: 10,
  baseValuableness: 100,
};
export const testResource2: ResourceTemplate =
{
  key: "testResource2",
  get displayName()
  {
    return localize("testResource2").toString();
  },
  getIcon: getResourceIcon.bind(null, "test2"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["common"],
  },
  displayOrder: 10,
  baseValuableness: 100,
};
export const testResource3: ResourceTemplate =
{
  key: "testResource3",
  get displayName()
  {
    return localize("testResource3").toString();
  },
  getIcon: getResourceIcon.bind(null, "test3"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["common"],
  },
  displayOrder: 10,
  baseValuableness: 100,
};
export const testResource4: ResourceTemplate =
{
  key: "testResource4",
  get displayName()
  {
    return localize("testResource4").toString();
  },
  getIcon: getResourceIcon.bind(null, "test4"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["rare"],
  },
  displayOrder: 10,
  baseValuableness: 100,
};
export const testResource5: ResourceTemplate =
{
  key: "testResource5",
  get displayName()
  {
    return localize("testResource5").toString();
  },
  getIcon: getResourceIcon.bind(null, "test5"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["rare"],
  },
  displayOrder: 10,
  baseValuableness: 100,
};

export const resourceTemplates =
{
  testResource1: testResource1,
  testResource2: testResource2,
  testResource3: testResource3,
  testResource4: testResource4,
  testResource5: testResource5,
};
