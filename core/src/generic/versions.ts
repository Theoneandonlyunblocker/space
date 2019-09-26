// all versions are assumed to be in format \d+\.\d+\.\d+
// 0.1.0, 10.2.4, etc.

class Version
{
  public readonly major: number;
  public readonly minor: number;
  public readonly patch: number;

  constructor(versionString: string)
  {
    [this.major, this.minor, this.patch] = versionString.split(".").map(n => parseInt(n));
  }
}

export function compare(a: string, b: string): number
{
  const aVer = new Version(a);
  const bVer = new Version(b);

  const majorSort = aVer.major - bVer.major;
  if (majorSort)
  {
    return majorSort;
  }

  const minorSort = aVer.minor - bVer.minor;
  if (minorSort)
  {
    return minorSort;
  }

  const patchSort = aVer.patch - bVer.patch;
  if (patchSort)
  {
    return patchSort;
  }

  return 0;
}

export function gt(a: string, b: string): boolean
{
  return compare(a, b) > 0;
}
export function gte(a: string, b: string): boolean
{
  return compare(a, b) >= 0;
}
export function lt(a: string, b: string): boolean
{
  return compare(a, b) < 0;
}
