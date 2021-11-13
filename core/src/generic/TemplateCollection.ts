import { getRandomProperty } from "./utility";


export class TemplateCollection<T>
{
  // prevents accidental assignment. don't think there's a way to prevent access completely
  // readonly [id: string]: never;

  public readonly category: string;
  public get length(): number
  {
    return Object.keys(this.items).length;
  }

  private readonly items:
  {
    [key: string]: T;
  } = {};
  private readonly onCopy?: (copiedTemplates: {[key: string]: T}) => void;
  private cachedValuesArrayIsDirty: boolean = true;
  private cachedValuesArray: T[] = [];

  constructor(displayName: string, onCopy?: (copiedTemplates: {[key: string]: T}) => void)
  {
    this.category = displayName;
    this.onCopy = onCopy;
  }

  public copyTemplates(source: {[key: string]: T}): void
  {
    for (const key in source)
    {
      this.set(key, source[key]);
    }

    if (this.onCopy)
    {
      this.onCopy(source);
    }
  }
  public has(key: string): boolean
  {
    return Boolean(this.items[key]);
  }
  public get(key: string): T
  {
    return this.items[key];
  }
  public getAll(): T[]
  {
    if (this.cachedValuesArrayIsDirty)
    {
      this.cachedValuesArray = Object.keys(this.items).map(key => this.items[key]);
      this.cachedValuesArrayIsDirty = false;
    }

    return this.cachedValuesArray;
  }
  public toObject(): {[key: string]: T}
  {
    return {...this.items};
  }
  public getRandom(): T
  {
    return getRandomProperty(this.items);
  }
  public filter(filterFn: (value: T) => boolean): T[]
  {
    return this.getAll().filter(filterFn);
  }
  public forEach(callback: (value: T) => void): void
  {
    this.getAll().forEach(callback);
  }
  public map<M>(callback: (value: T) => M): M[]
  {
    return this.getAll().map(callback);
  }

  private set(key: string, value: T): void
  {
    if (this.has(key))
    {
      throw new Error(`Duplicate '${this.category}' template '${key}'`);
    }

    this.items[key] = value;
    this.cachedValuesArrayIsDirty = true;
  }
}
