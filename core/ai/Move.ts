import {AbilityTemplate} from "../templateinterfaces/AbilityTemplate";

export interface Move
{
  ability: AbilityTemplate;
  userId: number;
  targetId: number;
}

export class MoveCollection<T>
{
  readonly [id: number]: never;

  public get length(): number
  {
    return this._length;
  }

  private _length: number = 0;
  private readonly moves:
  {
    [userId: number]:
    {
      [targetId: number]:
      {
        [abilityType: string]:
        {
          value: T;
          move: Move;
        };
      };
    };
  } = {};

  constructor()
  {

  }

  public set(move: Move, value: T): void
  {
    if (!this.moves[move.userId])
    {
      this.moves[move.userId] = {};
    }

    if (!this.moves[move.userId][move.targetId])
    {
      this.moves[move.userId][move.targetId] = {};
    }

    if (!this.moves[move.userId][move.targetId][move.ability.type])
    {
      this._length += 1;
    }

    this.moves[move.userId][move.targetId][move.ability.type] =
    {
      value: value,
      move: move,
    };
  }
  public has(move: Move): boolean
  {
    return Boolean(this.get(move));
  }
  public get(move: Move): T | null
  {
    if (
      this.moves[move.userId] &&
      this.moves[move.userId][move.targetId] &&
      this.moves[move.userId][move.targetId][move.ability.type]
    )
    {
      return this.moves[move.userId][move.targetId][move.ability.type].value;
    }

    return null;
  }
  public forEach(fn: (value: T, move?: Move) => void): void
  {
    for (const userId in this.moves)
    {
      for (const targetId in this.moves[userId])
      {
        for (const abilityType in this.moves[userId][targetId])
        {
          const storedData = this.moves[userId][targetId][abilityType];

          fn(storedData.value, storedData.move);
        }
      }
    }
  }
  public filter(filterFn: (value: T, move: Move) => boolean): MoveCollection<T>
  {
    const filtered = new MoveCollection<T>();

    this.forEach((value: T, move: Move) =>
    {
      if (filterFn(value, move))
      {
        filtered.set(move, value);
      }
    });

    return filtered;
  }
  public flatten(): T[]
  {
    const allValues: T[] = [];

    this.forEach(value =>
    {
      allValues.push(value);
    });

    return allValues;
  }
}
