declare module Rance
{
  module Templates
  {
    interface IUnitDrawingFunctionProps
    {
      facesRight: boolean;
      maxWidth?: number;
      maxHeight?: number;
      desiredHeight?: number;
    }
    interface IUnitDrawingFunction
    {
      (unit: Unit, props: IUnitDrawingFunctionProps): HTMLCanvasElement;
    }
  }
}
