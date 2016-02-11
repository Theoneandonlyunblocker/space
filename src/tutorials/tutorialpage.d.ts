declare module Rance
{
  interface ITutorialPage
  {
    content: any; // React elements or strings
    onOpen?: () => void;
    onClose?: () => void;
    desiredSize?:
    {
      width: number;
      height: number;
    }
  }
}
