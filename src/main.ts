/// <reference path="reactui/reactui.ts"/>
/// <reference path="unit.ts"/>
/// <reference path="battle.ts"/>
/// <reference path="ability.ts"/>
/// <reference path="player.ts"/>
/// <reference path="battleprep.ts"/>

var fleet1, fleet2, player1, player2, battle, battlePrep, reactUI;
module Rance
{
  document.addEventListener('DOMContentLoaded', function()
  {
    fleet1 = [];
    fleet2 = [];
    player1 = new Player();
    player2 = new Player();

    function setupFleetAndPlayer(fleet, player)
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
            var type = getRandomArrayItem(["fighterSquadron", "battleCruiser", "bomberSquadron"]);
            var unit = new Unit(Templates.ShipTypes[type]);
            row.push(unit);
            player.addUnit(unit);
          }
        }
        fleet.push(row);
      }
    }

    setupFleetAndPlayer(fleet1, player1);
    setupFleetAndPlayer(fleet2, player2);

    battlePrep = new BattlePrep(player1);


    reactUI = new ReactUI(document.getElementById("react-container"));
    reactUI.battlePrep = battlePrep;

    reactUI.switchScene("battlePrep");
  });
}


var indexedFibonacciResults = {};

function fibonacci(n)
{
  if (n <= 1) return n;

  
  if (!indexedFibonacciResults[n])
  {
    var a = fibonacci(n - 2);
    var b = fibonacci(n - 1);

    indexedFibonacciResults[n] = a + b;
  }

  return indexedFibonacciResults[n];
}