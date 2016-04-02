/// <reference path="star.ts" />
/// <reference path="priorityqueue.ts" />

import PriorityQueue from "./PriorityQueue.ts";
import Star from "./Star.ts";

export function backTrace(graph: any, target: Star)
{
  var parent = graph[target.id];

  if (!parent) return [];

  var path =
  [
    {
      star: target,
      cost: parent.cost
    }
  ];

  while (parent)
  {
    path.push(
      {
        star: parent.star,
        cost: parent.cost
      });
    parent = graph[parent.star.id];
  }
  path.reverse();
  path[0].cost = null;

  return path;
}

export function aStar(start: Star, target: Star)
{
  var frontier = new PriorityQueue();
  frontier.push(0, start);
  //var frontier = new EasyStar.PriorityQueue("p", 1);
  //frontier.insert({p: 0, tile: start})

  var cameFrom:any = {};
  var costSoFar:any = {};
  cameFrom[start.id] = null;
  costSoFar[start.id] = 0;


  while (!frontier.isEmpty())
  //while (frontier.length > 0)
  {
    var current = frontier.pop();
    //var current = frontier.shiftHighestPriorityElement().tile;
    if (current === target) return {came: cameFrom, cost: costSoFar, queue: frontier};

    var neighbors = current.getAllLinks();

    for (var i = 0; i < neighbors.length; i++)
    {
      var neigh = neighbors[i];
      if (!neigh) continue;

      var moveCost = 1;

      var newCost = costSoFar[current.id] + moveCost;

      if (costSoFar[neigh.id] === undefined || newCost < costSoFar[neigh.id])
      {
        costSoFar[neigh.id] = newCost;
        // ^ done
        var dx = Math.abs(neigh.id[1] - target.id[1]);
        var dy = Math.abs(neigh.id[2] - target.id[2]);
        var priority = newCost;
        frontier.push(priority, neigh);
        //frontier.insert({p: priority, tile: neigh});
        cameFrom[neigh.id] =
        {
          star: current,
          cost: moveCost
        };
      }
    }
  }
 
  return null; // didnt find path 
}
