import {ResourceTemplate} from "core/src/templateinterfaces/ResourceTemplate";
import { localize } from "modules/space/localization/localize";
import { getResourceIconSrc } from "modules/space/assets/resources/resourceAssets";


export const testResource1: ResourceTemplate =
{
  type: "testResource1",
  get displayName()
  {
    return localize("testResource1").toString();
  },
  getIconSrc: getResourceIconSrc.bind(null, "test1"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["common"],
  },
};
export const testResource2: ResourceTemplate =
{
  type: "testResource2",
  get displayName()
  {
    return localize("testResource2").toString();
  },
  getIconSrc: getResourceIconSrc.bind(null, "test2"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["common"],
  },
};
export const testResource3: ResourceTemplate =
{
  type: "testResource3",
  get displayName()
  {
    return localize("testResource3").toString();
  },
  getIconSrc: getResourceIconSrc.bind(null, "test3"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["common"],
  },
};
export const testResource4: ResourceTemplate =
{
  type: "testResource4",
  get displayName()
  {
    return localize("testResource4").toString();
  },
  getIconSrc: getResourceIconSrc.bind(null, "test4"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["rare"],
  },
};
export const testResource5: ResourceTemplate =
{
  type: "testResource5",
  get displayName()
  {
    return localize("testResource5").toString();
  },
  getIconSrc: getResourceIconSrc.bind(null, "test5"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["rare"],
  },
};
