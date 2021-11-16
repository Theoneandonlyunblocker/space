type Nodes<T> = {[key: string]: T};

export class OrderedGraph<T>
{
  private readonly _nodes: Nodes<T> = {}; // use #getNode() instead
  private readonly children: {[key: string]: Nodes<boolean>} = {};
  private readonly parents: {[key: string]: Nodes<boolean>} = {};

  constructor()
  {

  }

  public addNode(key: string, node: T): void
  {
    this._nodes[key] = node;

    this.initKeyIfNeeded(key);
  }
  public addOrdering(parentKey: string, childKey: string): void
  {
    [childKey, parentKey].forEach(nodeKey =>
    {
      this.initKeyIfNeeded(nodeKey);
    });


    this.parents[childKey][parentKey] = true;
    this.children[parentKey][childKey] = true;
  }
  public getOrderedNodes(): T[]
  {
    const ordered: T[] = [];
    const traversed: Nodes<boolean> = {};

    const DFS = (currentNodeKey: string, takenPath: string[] = []) =>
    {
      traversed[currentNodeKey] = true;

      Object.keys(this.children[currentNodeKey]).forEach(childOfCurrent =>
      {
        if (!traversed[childOfCurrent])
        {
          DFS(childOfCurrent, [...takenPath, currentNodeKey]);
        }
        else if (takenPath.indexOf(childOfCurrent) !== -1)
        {
          throw new Error(`Cyclical ordering: ${[...takenPath, childOfCurrent].join(" -> ")}`);
        }
      });

      ordered.unshift(this.getNode(currentNodeKey));
    };

    const startNodes = this.getIndependentNodeKeys();

    startNodes.forEach(startNode => DFS(startNode));

    const hasUntraversedNodes = Object.keys(traversed).length < Object.keys(this._nodes).length;
    if (hasUntraversedNodes)
    {
      const baseMessage = startNodes.length === 0 ?
       "No starting node could be found as all nodes have parents." :
       "Ordered graph has isolated nodes that form a cycle.";

      const untraversedKeys = Object.keys(this._nodes).filter(key => !traversed[key]);
      throw new Error(`${baseMessage}\n${
        untraversedKeys.map(key =>
        {
          return `${key} => [${Object.keys(this.parents[key]).join(", ")}]`;
        }).join("\n")
      }`);
    }

    return ordered;
  }
  public getImmediateParentsOf(nodeKey: string): T[]
  {
    return Object.keys(this.parents[nodeKey]).map(parentKey => this.getNode(parentKey));
  }

  private hasKey(key: string): boolean
  {
    return Boolean(this.parents[key] || this.children[key]);
  }
  private initKeyIfNeeded(key: string): void
  {
    if (!this.hasKey(key))
    {
      this.parents[key] = {};
      this.children[key] = {};
    }
  }
  private getIndependentNodeKeys(): string[]
  {
    return Object.keys(this._nodes).filter(node => Object.keys(this.parents[node]).length === 0);
  }
  private getNode(key: string): T
  {
    const node = this._nodes[key];

    if (!node)
    {
      throw new Error(`Key '${key}' was used to order items in ordering graph, but no node with the key '${key}' was provided.`);
    }

    return node;
  }
}
