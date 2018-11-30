// TODO performance | not very efficient. probably doesn't matter though
export default class PriorityQueue
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
    if (Object.keys(this.items).length > 0) { return false; }
    else { return true; }
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
    const highestPriorityValue = this.getHighestPriorityValue();

    const toReturn = this.items[highestPriorityValue].pop();
    if (this.items[highestPriorityValue].length < 1)
    {
      delete this.items[highestPriorityValue];
    }

    return toReturn;
  }
  peek()
  {
    const highestPriorityValue = this.getHighestPriorityValue();
    const toReturn = this.items[highestPriorityValue][0];

    // TODO 2018.11.30 | .mapPosition = wtf?
    return [highestPriorityValue, toReturn.mapPosition[1], toReturn.mapPosition[2]];
  }

  private getHighestPriorityValue(): number
  {
    const allPriorityValues = Object.keys(this.items).map(key => Number(key));

    return Math.min(...allPriorityValues);
  }
}
