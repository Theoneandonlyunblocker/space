import {ResourceTemplate} from "../../../src/templateinterfaces/ResourceTemplate";
import { getIconSrc } from "./assets";
import { localize } from "./localization/localize";


export const testResource1: ResourceTemplate =
{
  type: "testResource1",
  get displayName()
  {
    return localize("testResource1")();
  },
  getIconSrc: getIconSrc.bind(null, "test1"),
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
    return localize("testResource2")();
  },
  getIconSrc: getIconSrc.bind(null, "test2"),
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
    return localize("testResource3")();
  },
  getIconSrc: getIconSrc.bind(null, "test3"),
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
    return localize("testResource4")();
  },
  getIconSrc: getIconSrc.bind(null, "test4"),
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
    return localize("testResource5")();
  },
  getIconSrc: getIconSrc.bind(null, "test5"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["rare"],
  },
};
