declare module Rance
{
  interface ITutorial
  {
    pages:
    {
      content: any; // React elements or strings
      onOpen?: () => void;
      onClose?: () => void;
    }[];
  }
}
