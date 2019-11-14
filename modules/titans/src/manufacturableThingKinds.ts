import { ManufacturableThingKind } from "core/src/templateinterfaces/ManufacturableThing";
import { TitanComponent } from "./TitanComponent";
import { TitanComponentTemplate } from "./TitanComponentTemplate";


export const manufacturableThingKinds =
{
  titanComponent: <ManufacturableThingKind<TitanComponentTemplate, TitanComponent>>
  {
    key: "titanComponent",
    buildFromTemplate: (template, manufactory) =>
    {

    },
    afterBuilt: (builtThings, manufactory) =>
    {

    },
  },
};
