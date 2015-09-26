module Rance
{
  export module UIComponents
  {
    export var FlagMaker = React.createClass(
    {
      makeFlags: function(delay: number = 0)
      {
        var flags: Flag[] = [];
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
            width: 46, // FLAG_SIZE
            mainColor: colorScheme.main,
            secondaryColor: colorScheme.secondary
          });

          flag.generateRandom();

          var canvas = flag.draw(360, 320, true);

          flags.push(flag);
        }

        function makeHslStringFromHex(hex: number)
        {
          var hsl = hexToHsv(hex);

          hsl = colorFromScalars(hsl);
          var hslString = hsl.map(function(v){return v.toFixed()});

          return hslString.join(", ");
        }

        window.setTimeout(function()
        {
          for (var i = 0; i < flags.length; i++)
          {
            var canvas = flags[i].draw(360, 320, true);
            parent.appendChild(canvas);

            canvas.setAttribute("title",
              "bgColor: " + makeHslStringFromHex(flags[i].mainColor) + "\n" +
              "emblemColor: " + makeHslStringFromHex(flags[i].secondaryColor) + "\n"
            );

            canvas.onclick = function(e: MouseEvent)
            {
              console.log(hexToHusl(this.mainColor));
              console.log(hexToHusl(this.secondaryColor))
            }.bind(flags[i]);
          }
        }, delay);
      },
      componentDidMount: function()
      {
        this.makeFlags();
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