import {localize} from "../localization/localize";
import {ResourceTemplate} from "core/src/templateinterfaces/ResourceTemplate";


export const moneyResource: ResourceTemplate =
{
  key: "money",
  get displayName()
  {
    return localize("money").toString();
  },
  // TODO 2019.09.30 | temporary
  getIcon: () =>
  {
    const a = document.createElement("div");
    a.style.backgroundColor = "#F3C620";

    return a;
  },
  styleTextProps: props =>
  {
    props.style =
    {
      color: "#FFEB00",
    };
  },
  displayOrder: -100,

  // TODO 2019.09.27 | what do we do with this?
  distributionData:
  {
    weight: 0,
    distributionGroups: [],
  },
  baseValuableness: 1,
};
