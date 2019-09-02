import { EnglishName } from "./EnglishName";


export const formatters =
{
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
