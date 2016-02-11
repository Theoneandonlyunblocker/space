/// <reference path="tutorial.d.ts"/>

module Rance
{
  export module Tutorials
  {
    export var introTutorial =
    {
      pages:
      [
        {
          content: "This is a tutorial",
          onOpen: function(){console.log("tutorial page open")},
          onClose: function(){console.log("tutorial page close")}
        },
        {
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultricies condimentum ex eget consequat. Cras scelerisque vulputate libero consequat hendrerit. Sed ut mauris sed lorem mattis consectetur feugiat nec enim. Nulla metus magna, aliquam volutpat ornare nec, dictum non tellus. Curabitur quis massa egestas, congue massa at, malesuada velit. Sed ornare dui quam, nec vulputate ipsum blandit sed. Curabitur et consequat nulla. Cras lorem odio, varius ut diam ut, elementum fringilla nisi. In lobortis lectus eu libero volutpat, et viverra metus consectetur. Praesent cursus lacus vitae fermentum dapibus. Aliquam ac auctor eros. Praesent vel felis vel odio congue aliquam a et elit.\n\nDuis ac leo efficitur, lacinia libero at, vulputate lorem. Maecenas elementum aliquet tellus vitae tempus. Aliquam a lectus risus. Mauris porttitor, eros a faucibus vulputate, mauris libero ultricies lectus, eget consectetur orci diam id est. Integer eros nibh, lobortis ac iaculis ut, molestie at mi. Proin sit amet pulvinar ante. Curabitur a purus tempus velit varius sollicitudin. Nullam euismod felis eu elit consectetur tincidunt. Duis sed lobortis purus.\n\nMorbi sit amet sem blandit, cursus felis sit amet, accumsan turpis. Vivamus et facilisis enim. Duis vestibulum sodales neque, ut suscipit nulla ultrices vitae. In ac accumsan erat. Nunc consectetur massa non elit mollis bibendum. Nullam tincidunt augue mi. Vestibulum dapibus et nunc quis auctor. Etiam malesuada cursus purus, et gravida dolor vehicula vel. Nam scelerisque magna ut risus semper, eget iaculis ligula hendrerit. Donec ac varius mauris, a pulvinar diam. Sed elementum, ex molestie dictum suscipit, lectus nunc pellentesque turpis, ac scelerisque tellus odio vel nisi. Donec facilisis, purus id volutpat varius, mi ex accumsan diam, a viverra lectus dui vel turpis. Nam tellus est, volutpat id scelerisque at, auctor id arcu. Proin molestie lobortis tempor. Ut ultricies lectus tincidunt erat consequat, at vestibulum erat commodo.",
          desiredSize:
          {
            width: 400,
            height: 700
          }
        },
        {
          content: React.DOM.div(null,
            React.DOM.div(null, "Works with"),
            React.DOM.button(null, "react elements too")
          )
        }
      ]
    }
  }
}