import { EnglishName } from "./EnglishName";


export const formatters =
{
  capitalize: (s: string) => s.charAt(0).toUpperCase() + s.slice(1),
  possessiveName: (name: EnglishName) =>
  {
    const lastChar = name.baseName[name.baseName.length - 1];

    if (lastChar === "s")
    {
      return name.baseName + "'";
    }
    else
    {
      return name.baseName + "'s";
    }
  }
};
