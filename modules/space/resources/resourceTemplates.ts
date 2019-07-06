import {ResourceTemplate} from "../../../src/templateinterfaces/ResourceTemplate";
import { getIconSrc } from "./assets";


export const testResource1: ResourceTemplate =
{
  type: "testResource1",
  displayName: "Test Resource 1",
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
  displayName: "Test Resource 2",
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
  displayName: "Test Resource 3",
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
  displayName: "Test Resource 4",
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
  displayName: "Test Resource 5",
  getIconSrc: getIconSrc.bind(null, "test5"),
  distributionData:
  {
    weight: 1,
    distributionGroups: ["rare"],
  },
};
