module Rance
{
  export function defaultUnitScene(unit: Unit, props:
  {
    unitsToDraw?: number;
    maxUnitsPerColumn: number;
    degree: number;
    rotationAngle: number;
    scalingFactor: number;
    xDistance: number;
    zDistance: number;
    facesRight: boolean;
    maxWidth?: number;
    maxHeight?: number;
    desiredHeight?: number;
  })
  {
    //var unitsToDraw = props.unitsToDraw;
    var maxUnitsPerColumn = props.maxUnitsPerColumn;
    var isConvex = true
    var degree = props.degree;
    if (degree < 0)
    {
      isConvex = !isConvex;
      degree = Math.abs(degree);
    }

    var xDistance = isFinite(props.xDistance) ? props.xDistance : 5;
    var zDistance = isFinite(props.zDistance) ? props.zDistance : 5;

    var canvas = document.createElement("canvas");
    canvas.width = 2000;
    canvas.height = 2000;

    var ctx = canvas.getContext("2d");

    var spriteTemplate = unit.template.sprite;
    var image = app.images[spriteTemplate.imageSrc];

    var unitsToDraw: number;

    if (isFinite(props.unitsToDraw))
    {
      unitsToDraw = props.unitsToDraw;
    }
    else if (!unit.isSquadron)
    {
      unitsToDraw = 1;
    }
    else
    {
      var lastHealthDrawnAt = unit.lastHealthDrawnAt || unit.battleStats.lastHealthBeforeReceivingDamage;
      unit.lastHealthDrawnAt = unit.currentHealth;
      unitsToDraw = Math.round(lastHealthDrawnAt * 0.05);
      var heightRatio = 25 / image.height;
      heightRatio = Math.min(heightRatio, 1.25);
      maxUnitsPerColumn = Math.round(maxUnitsPerColumn * heightRatio);
      unitsToDraw = Math.round(unitsToDraw * heightRatio);
      zDistance *= (1 / heightRatio);

      unitsToDraw = clamp(unitsToDraw, 1, maxUnitsPerColumn * 3);
    }

    var xMin: number, xMax: number, yMin: number, yMax: number;

    function transformMat3(a: Point, m: number[])
    {
      var x = m[0] * a.x + m[3] * a.y + m[6];
      var y = m[1] * a.x + m[4] * a.y + m[7];

      return {x: x, y: y};
    }

    var rotationAngle = Math.PI / 180 * props.rotationAngle;
    var sA = Math.sin(rotationAngle);
    var cA = Math.cos(rotationAngle);

    var rotationMatrix =
    [
      1, 0, 0,
      0, cA, -sA,
      0, sA, cA
    ];

    var minXOffset = isConvex ? 0 : Math.sin(Math.PI / (maxUnitsPerColumn + 1));

    if (props.desiredHeight)
    {
      var averageHeight = image.height * (maxUnitsPerColumn / 2 * props.scalingFactor);
      var spaceToFill = props.desiredHeight - (averageHeight * maxUnitsPerColumn);
      zDistance = spaceToFill / maxUnitsPerColumn * 1.35;
    }

    for (var i = unitsToDraw - 1; i >= 0; i--)
    {
      var column = Math.floor(i / maxUnitsPerColumn);
      var isLastColumn = column === Math.floor(unitsToDraw / maxUnitsPerColumn);

      var zPos: number;
      if (isLastColumn)
      {
        var maxUnitsInThisColumn = unitsToDraw % maxUnitsPerColumn;
        if (maxUnitsInThisColumn === 1)
        {
          zPos = (maxUnitsPerColumn - 1) / 2;
        }
        else
        {
          var positionInLastColumn = i % maxUnitsInThisColumn;
          zPos = positionInLastColumn * ((maxUnitsPerColumn - 1) / (maxUnitsInThisColumn - 1));
        }
      }
      else
      {
        zPos = i % maxUnitsPerColumn;
      }

      var xOffset = Math.sin(Math.PI / (maxUnitsPerColumn + 1) * (zPos + 1));
      if (isConvex)
      {
        xOffset = 1 - xOffset;
      }

      xOffset -= minXOffset;

      var scale = 1 - zPos * props.scalingFactor;
      var scaledWidth = image.width * scale;
      var scaledHeight = image.height * scale;
      

      var x = xOffset * scaledWidth * degree + column * (scaledWidth + xDistance * scale);
      var y = (scaledHeight + zDistance * scale) * (maxUnitsPerColumn - zPos);

      var translated = transformMat3({x: x, y: y}, rotationMatrix);

      x = Math.round(translated.x);
      y = Math.round(translated.y);

      xMin = isFinite(xMin) ? Math.min(x, xMin) : x;
      xMax = isFinite(xMax) ? Math.max(x + scaledWidth, xMax) : x + scaledWidth;
      yMin = isFinite(yMin) ? Math.min(y, yMin) : y;
      yMax = isFinite(yMax) ? Math.max(y + scaledHeight, yMax) : y + scaledHeight;


      ctx.drawImage(image, x, y, scaledWidth, scaledHeight);
    }

    var resultCanvas = document.createElement("canvas");

    resultCanvas.width = xMax - xMin;
    if (props.maxWidth)
    {
      resultCanvas.width = Math.min(props.maxWidth, resultCanvas.width)
    }

    resultCanvas.height = yMax - yMin;
    if (props.maxHeight)
    {
      resultCanvas.height = Math.min(props.maxHeight, resultCanvas.height)
    }

    var resultCtx = resultCanvas.getContext("2d");

    // flip horizontally
    if (props.facesRight)
    {
      resultCtx.translate(resultCanvas.width, 0);
      resultCtx.scale(-1, 1);
    }
    resultCtx.drawImage(canvas, -xMin, -yMin);


    return resultCanvas;
  }
}
