/// <reference path="star.ts" />

module Rance
{
  // todo: use a heap instead of this crap
  export class PriorityQueue
  {
    items:
    {
      [priority: number]: any[];
    };

    constructor()
    {
      this.items = {};
    }

    isEmpty()
    {
      if (Object.keys(this.items).length > 0) return false;
      else return true;
    }

    push(priority: number, data: any)
    {
      if (!this.items[priority])
      {
        this.items[priority] = [];
      }

      this.items[priority].push(data);
    }
    pop()
    {
      var highestPriority = Math.min.apply(null, Object.keys(this.items));

      var toReturn = this.items[highestPriority].pop();
      if (this.items[highestPriority].length < 1)
      {
        delete this.items[highestPriority];
      }
      return toReturn;
    }
    peek()
    {
      var highestPriority = Math.min.apply(null, Object.keys(this.items));
      var toReturn = this.items[highestPriority][0];

      return [highestPriority, toReturn.mapPosition[1], toReturn.mapPosition[2]];
    }
  }

  export function backTrace(graph, target: Star)
  {
    var parent = graph[target.id];

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
}
