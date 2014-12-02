module Rance
{
  export module UIComponents
  {
    export var FlagMaker = React.createClass(
    {
      componentDidMount: function()
      {
        var flags = [];
        var parent = this.refs.flags.getDOMNode();

        for (var i = 0; i < 100; i++)
        {
          var color = makeRandomColor(
          {
            s: [{min: 0.8, max: 1}],
            l: [{min: 0.3, max: 0.6}]
          });

          var flag = new Flag(
          {
            width: 46,
            backgroundColor: stringToHex(
              HUSL.toHex.apply(
                null, colorFromScalars(color)
              )
            )
          });

          flag.generateRandom();
          var canvas = flag.draw();

          flags.push(flag);

        }

        window.setTimeout(function(e)
        {
          for (var i = 0; i < flags.length; i++)
          {
            var canvas = flags[i].draw();
            parent.appendChild(canvas);
          }
        }, 1000);
      },

      render: function()
      {
        
        return(
          React.DOM.div(
          {
            className: "flags",
            ref: "flags" 
          })
        );
      }
    })
  }
}