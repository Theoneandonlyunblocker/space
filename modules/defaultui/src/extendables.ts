// ways to allow other modules to programmatically extend the ui

// these are just added to old components on an as-needed basis
// if there are parts of the ui you'd like to extend that aren't here, open up an issue on github
// new ui components should be written with extendability in mind when appropriate

import * as React from "react";
import { Star } from "core/src/map/Star";
import { ManufacturableThing } from "core/src/templateinterfaces/ManufacturableThing";
import { Manufactory } from "core/src/production/Manufactory";
import { localize } from "../localization/localize";
import { ManufacturableUnits } from "./uicomponents/production/ManufacturableUnits";
import { ManufacturableItems } from "./uicomponents/production/ManufacturableItems";
import { Player } from "core/src/player/Player";


type ManufacturableThingKindUiData<T extends ManufacturableThing> =
{
  displayOrder: number; // 0 should be considered default
  buttonString: string;
  getManufacturableThings: (manufactory: Manufactory) => T[];
  render: (props:
  {
    manufacturableThings: T[];
    selectedLocation: Star | undefined;
    player: Player;
    canManufacture: boolean;
    triggerParentUpdate: () => void;
  }) => React.ReactElement<any>;
};

export const extendables:
{
  manufacturableThingKinds:
  {
    [key: string]: ManufacturableThingKindUiData<any>
  };
} =
{
  manufacturableThingKinds:
  {
    units:
    {
      displayOrder: 0,
      get buttonString() {return localize("manufactureUnitsButton").toString();},
      getManufacturableThings: manufactory => manufactory.getManufacturableUnits(),
      render: props => ManufacturableUnits(props),
    },
    items:
    {
      displayOrder: 1,
      get buttonString() {return localize("manufactureItemsButton").toString();},
      getManufacturableThings: manufactory => manufactory.getManufacturableItems(),
      render: props => ManufacturableItems(props),
    },
  },
};
