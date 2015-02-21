module Rance
{
  export function getAllBorderEdgesByStar(edges: any[]) // Voronoi.Edge[]
  {
    var edgesByStar:
    {
      [starId: number]:
      {
        star: Star;
        edges: any[]; // Voronoi.Edge[];
      }
    } = {};

    for (var i = 0; i < edges.length; i++)
    {
      var edge = edges[i];

      if (edge.lSite && edge.rSite && edge.lSite.owner === edge.rSite.owner)
      {
        continue;
      }

      ["lSite", "rSite"].forEach(function(neighborDirection)
      {
        var neighbor = edge[neighborDirection];

        if (neighbor && neighbor.owner && !neighbor.owner.isIndependent)
        {
          if (!edgesByStar[neighbor.id])
          {
            edgesByStar[neighbor.id] =
            {
              star: neighbor,
              edges: []
            }
          }

          edgesByStar[neighbor.id].edges.push(edge);
        }
      });
    }

    return edgesByStar;
  }
}