import PriorityQueue from "./PriorityQueue";
import Star from "./Star";


export interface AStarGraph
{
  came:
  {
    [starId: number]: PathNode;
  };
  cost:
  {
    [starId: number]: number;
  };
}

export interface PathNode
{
  star: Star;
  cost: number;
}

export function backTrace(graph: {[starId: number]: PathNode}, target: Star): PathNode[]
{
  let parent = graph[target.id];

  if (!parent) { return []; }

  const path =
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
  const frontier = new PriorityQueue<Star>();
  frontier.push(0, start);

  const cameFrom:
  {
    [starId: number]:
    {
      star: Star;
      cost: number;
    };
  } = {};
  const costSoFar:
  {
    [starId: number]: number;
  } = {};
  cameFrom[start.id] = null;
  costSoFar[start.id] = 0;


  while (!frontier.isEmpty())
  {
    const current = frontier.pop();
    if (current === target)
    {
      return {came: cameFrom, cost: costSoFar};
    }

    const neighbors = current.getAllLinks();

    for (let i = 0; i < neighbors.length; i++)
    {
      const neigh = neighbors[i];
      if (!neigh) { continue; }

      const moveCost = 1;

      const newCost = costSoFar[current.id] + moveCost;

      if (costSoFar[neigh.id] === undefined || newCost < costSoFar[neigh.id])
      {
        costSoFar[neigh.id] = newCost;
        // ^ done
        const priority = newCost;
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
