interface ITutorialPage
{
  content: any; // React elements or strings or arrays of these
  onOpen?: () => void;
  onClose?: () => void;
  desiredSize?:
  {
    width: number;
    height: number;
  }
}
