/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="battle.ts"/>

var fleet1, fleet2, battle, reactUI;
module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    fleet1 = [];
    fleet2 = [];

    [fleet1, fleet2].forEach(function(fleet)
    {
      for (var i = 0; i < 2; i++)
      {
        var emptySlot = randInt(0, 3);
        var row = [];
        for (var j = 0; j < 4; j++)
        {
          if (j === emptySlot)
          {
            row.push(null);
          }
          else
          {
            var type = getRandomArrayItem(["fighterSquadron", "battleCruiser"]);
            row.push(new Unit(Templates.ShipTypes[type]));
          }
        }
        fleet.push(row);
      }
    });

    battle = new Battle(
    {
      side1: fleet1,
      side2: fleet2
    });

    battle.init();

    reactUI = new ReactUI(document.getElementById("react-container"), battle);
  });
}
