module Rance
{
  export module UIComponents
  {
    export var FlagMaker = React.createClass(
    {
      makeFlags: function(delay: number = 0)
      {
        var flags = [];
        var parent = this.refs.flags.getDOMNode();

        while (parent.lastChild)
        {
          parent.removeChild(parent.lastChild);
        }

        for (var i = 0; i < 100; i++)
        {
          var genType;
          var color;
          var hexColor;
          if (Math.random() < 0.6)
          {
            color = makeRandomDeepColor();
            hexColor = hsvToHex.apply(null, color);
            genType = "deep"
          }
          else if (Math.random() < 0.6)
          {
            color = makeRandomVibrantColor();
            hexColor = hsvToHex.apply(null, color);
            genType = "vibrant"
          }
          else
          {
            color = makeRandomColor(
            {
              s: [{min: 1, max: 1}],
              l: [{min: 0.92, max: 1}]
            });
            hexColor = stringToHex(
              HUSL.toHex.apply(null, colorFromScalars(color)));

            genType = "husl"
          }

          var flag = new Flag(
          {
            width: 46,
            backgroundColor: hexColor
          });

          flag.generateRandom();
          flag["genType"] = genType;

          var canvas = flag.draw();

          flags.push(flag);
        }

        function makeHslStringFromHex(hex: number)
        {
          var hsl = hexToHsv(hex);

          hsl = colorFromScalars(hsl);
          hsl = hsl.map(function(v):number{return v.toFixed()});

          return hsl.join(", ");
        }

        window.setTimeout(function(e)
        {
          for (var i = 0; i < flags.length; i++)
          {
            var canvas = flags[i].draw();
            parent.appendChild(canvas);

            canvas.setAttribute("title",
              "bgColor: " + makeHslStringFromHex(flags[i].backgroundColor) + "\n" +
              "emblemColor: " + makeHslStringFromHex(flags[i].foregroundEmblem.color) + "\n" +
              "bgType: " + flags[i].genType + "\n" +
              "emblemType: " + flags[i].emblemType
            );

            canvas.onclick = function(e)
            {
              console.log(hexToHusl(this.backgroundColor));
              console.log(hexToHusl(this.foregroundEmblem.color))
            }.bind(flags[i]);
          }
        }, delay);
      },
      componentDidMount: function()
      {
        this.makeFlags(1000);
      },

      render: function()
      {
        
        return(
          React.DOM.div(null,
            React.DOM.div(
            {
              className: "flags",
              ref: "flags" 
            }),
            React.DOM.button(
            {
              onClick: this.makeFlags
            }, "make flags")
          )
        );
      }
    })
  }
}