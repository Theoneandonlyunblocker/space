type Nodes = {[key: string]: boolean};

export class DependencyGraph
{
  private readonly nodes: Nodes = {};
  private readonly children: {[key: string]: Nodes} = {};
  private readonly parents: {[key: string]: Nodes} = {};

  constructor()
  {

  }

  public addNode(node: string): void
  {
    this.nodes[node] = true;

    if (!this.parents[node])
    {
      this.parents[node] = {};
    }
    if (!this.children[node])
    {
      this.children[node] = {};
    }
  }
  public addDependency(parent: string, child: string): void
  {
    this.addNode(parent);
    this.addNode(child);

    this.parents[child][parent] = true;
    this.children[parent][child] = true;
  }
  public getOrderedNodes(): string[]
  {
    const startNodes = this.getIndependentNodes();

    const ordered: string[] = [];
    const traversed: Nodes = {};

    const DFS = (currentNode: string, takenPath: string[] = []) =>
    {
      Object.keys(this.children[currentNode]).forEach(childOfCurrent =>
      {
        if (!traversed[childOfCurrent])
        {
          DFS(childOfCurrent, [...takenPath, currentNode]);
        }
        else if (takenPath.indexOf(childOfCurrent) !== -1)
        {
          throw new Error(`Cyclical dependency: ${[...takenPath, childOfCurrent].join(" -> ")}`);
        }
      });

      traversed[currentNode] = true;
      ordered.unshift(currentNode);
    };

    startNodes.forEach(startNode => DFS(startNode));

    return ordered;
  }

  private getIndependentNodes(): string[]
  {
    return Object.keys(this.nodes).filter(node => Object.keys(this.parents[node]).length === 0);
  }
}
