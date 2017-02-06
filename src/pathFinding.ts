import PriorityQueue from "./PriorityQueue";
import Star from "./Star";

export interface AStarGraph
{
  came:
  {
    [starID: number]: PathNode;
  };
  cost:
  {
    [starID: number]: number;
  };
}

export interface PathNode
{
  star: Star;
  cost: number;
}

export function backTrace(graph: {[starID: number]: PathNode}, target: Star): PathNode[]
{
  var parent = graph[target.id];

  if (!parent) return [];

  var path =
  [
    {
      star: target,
      cost: parent.cost,
    },
  ];

  while (parent)
  {
    path.push(
      {
        star: parent.star,
        cost: parent.cost,
      });
    parent = graph[parent.star.id];
  }
  path.reverse();
  path[0].cost = null;

  return path;
}

export function aStar(start: Star, target: Star): AStarGraph | null
{
  var frontier = new PriorityQueue();
  frontier.push(0, start);

  const cameFrom:
  {
    [starID: number]:
    {
      star: Star,
      cost: number,
    },
  } = {};
  const costSoFar:
  {
    [starID: number]: number;
  } = {};
  cameFrom[start.id] = null;
  costSoFar[start.id] = 0;


  while (!frontier.isEmpty())
  {
    var current = frontier.pop();
    if (current === target)
    {
      return {came: cameFrom, cost: costSoFar};
    }

    var neighbors = current.getAllLinks();

    for (let i = 0; i < neighbors.length; i++)
    {
      var neigh = neighbors[i];
      if (!neigh) continue;

      var moveCost = 1;

      var newCost = costSoFar[current.id] + moveCost;

      if (costSoFar[neigh.id] === undefined || newCost < costSoFar[neigh.id])
      {
        costSoFar[neigh.id] = newCost;
        // ^ done
        var priority = newCost;
        frontier.push(priority, neigh);
        cameFrom[neigh.id] =
        {
          star: current,
          cost: moveCost,
        };
      }
    }
  }

  return null; // didnt find path
}
