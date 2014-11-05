/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>

var unit, reactUI;
module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    unit = new Unit(Templates.ShipTypes.fighterSquadron);

    reactUI = new ReactUI(document.getElementById("react-container"), unit);
  });
}
