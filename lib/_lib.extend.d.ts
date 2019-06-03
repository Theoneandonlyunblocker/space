// https://github.com/Microsoft/TypeScript/issues/12871
interface PromiseConstructor
{
  all(values: PromiseLike<void>[]): Promise<void>;
}
