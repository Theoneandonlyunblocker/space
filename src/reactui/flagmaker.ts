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
          var colorScheme = generateColorScheme();

          var flag = new Flag(
          {
            width: 46,
            mainColor: colorScheme.main,
            secondaryColor: colorScheme.secondary
          });

          flag.generateRandom();

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
              "bgColor: " + makeHslStringFromHex(flags[i].mainColor) + "\n" +
              "emblemColor: " + makeHslStringFromHex(flags[i].secondaryColor) + "\n"
            );

            canvas.onclick = function(e)
            {
              console.log(hexToHusl(this.mainColor));
              console.log(hexToHusl(this.secondaryColor))
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