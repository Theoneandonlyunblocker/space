// TODO performance | not very efficient. probably doesn't matter though
export default class PriorityQueue<T>
{
  items:
  {
    [priority: number]: T[];
  };

  constructor()
  {
    this.items = {};
  }

  public isEmpty(): boolean
  {
    if (Object.keys(this.items).length > 0) { return false; }
    else { return true; }
  }

  public push(priority: number, data: T): void
  {
    if (!this.items[priority])
    {
      this.items[priority] = [];
    }

    this.items[priority].push(data);
  }
  public pop(): T
  {
    const highestPriorityValue = this.getHighestPriorityValue();

    const toReturn = this.items[highestPriorityValue].pop();
    if (this.items[highestPriorityValue].length < 1)
    {
      delete this.items[highestPriorityValue];
    }

    return toReturn;
  }
  public peek(): T
  {
    const highestPriorityValue = this.getHighestPriorityValue();
    const items = this.items[highestPriorityValue];

    return items[items.length - 1];
  }

  private getHighestPriorityValue(): number
  {
    const allPriorityValues = Object.keys(this.items).map(key => Number(key));

    return Math.min(...allPriorityValues);
  }
}
