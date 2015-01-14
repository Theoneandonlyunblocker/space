module Rance
{
  export module Templates
  {
    export module MapGen
    {
      export var defaultMap =
      {
        mapOptions:
        {
          width: 600,
          height: 600
        },
        starGeneration:
        {
          galaxyType: "spiral",
          totalAmount: 40,
          arms: 5,
          centerSize: 0.4,
          amountInCenter: 0.3
        },
        relaxation:
        {
          timesToRelax: 5,
          dampeningFactor: 2
        }
      }
    }
  }
}
