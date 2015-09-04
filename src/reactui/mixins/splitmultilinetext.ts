module Rance
{
  export module UIComponents
  {

    export var SplitMultilineText =
    {
      splitMultilineText: function(text: any)
      {
        if (Array.isArray(text))
        {
          var returnArr: any[] = [];
          for (var i = 0; i < text.length; i++)
          {
            returnArr.push(text[i]);
            returnArr.push(React.DOM.br(null));
          }
          return returnArr;
        }
        else
        {
          return text;
        }
      }
    }
  }
}
