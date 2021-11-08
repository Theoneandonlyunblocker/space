import * as MessageFormat from "messageformat";


export class Message<Args extends any[] = any[]>
{
  protected readonly message: MessageFormat.MessageFunction<Args>;

  constructor(message: MessageFormat.MessageFunction<Args>)
  {
    this.message = message;
  }

  public toString(): string
  {
    return this.message();
  }
  public format(...args: Args): string
  {
    if (args.length === 0 || (typeof args[0] === "object" && args[0] !== null))
    {
      return this.message.apply(null, args);
    }
    else
    {
      return this.message(args);
    }
  }
}

export class ErrorMessage extends Message<[]>
{
  constructor(message: MessageFormat.MessageFunction<[]>)
  {
    super(message);
  }

  public override format(): string
  {
    return this.toString();
  }
}
