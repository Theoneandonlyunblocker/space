import Tutorial from "./Tutorial";


const introTutorial: Tutorial =
{
  pages:
  [
    {
      content:
      [
        "Thanks for checking out spacegame!",
        "",
        "This game is still heavily in development. Many things are unfinished or unimplemented, including a proper tutorial.",
      ],
    },
    {
      content:
      [
        "To get started, click on \"Production\" in the top menu. ",
        "",
        "Click on a ship type on the right of the production window to add it to your build queue. ",
        "Units in the queue are built at the end of each turn. ",
        "",
        "You can end your turn by clicking the \"End turn\" button at the bottom right of the main window.",
      ],
    },
    {
      content:
      [
        "Built units are assigned to fleets on the map. ",
        "",
        "To select fleets, drag a rectangle over them on the map or click on the fleet icon. ",
        "Selected fleets can be moved by right-clicking.",
        "",
        "To move the camera, drag the map while holding down middle mouse button or while holding down ctrl/cmd + right click.",
        "Touchscreen devices aren't supported yet, sorry.",
      ],
    },
    {
      content:
      [
        "To start a battle, move your fleet to a star containing hostile fleets and click on \"attack\" button in the bottom left of the main window.",
        "",
        "In the battle setup screen, drag units from the unit list on the right into the formation on the bottom left or click the \"Auto formation\" button.",
        "",
        "To use abilities in battle, hover over the unit you want to target and select the ability to use.",
      ],
    },
    // {
    //   content: "This is a tutorial",
    //   onOpen: () =>{console.log("tutorial page open")},
    //   onClose: () =>{console.log("tutorial page close")}
    // },
    // {
    //   content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultricies condimentum ex eget consequat. Cras scelerisque vulputate libero consequat hendrerit. Sed ut mauris sed lorem mattis consectetur feugiat nec enim. Nulla metus magna, aliquam volutpat ornare nec, dictum non tellus. Curabitur quis massa egestas, congue massa at, malesuada velit. Sed ornare dui quam, nec vulputate ipsum blandit sed. Curabitur et consequat nulla. Cras lorem odio, varius ut diam ut, elementum fringilla nisi. In lobortis lectus eu libero volutpat, et viverra metus consectetur. Praesent cursus lacus vitae fermentum dapibus. Aliquam ac auctor eros. Praesent vel felis vel odio congue aliquam a et elit.\n\nDuis ac leo efficitur, lacinia libero at, vulputate lorem. Maecenas elementum aliquet tellus vitae tempus. Aliquam a lectus risus. Mauris porttitor, eros a faucibus vulputate, mauris libero ultricies lectus, eget consectetur orci diam id est. Integer eros nibh, lobortis ac iaculis ut, molestie at mi. Proin sit amet pulvinar ante. Curabitur a purus tempus velit varius sollicitudin. Nullam euismod felis eu elit consectetur tincidunt. Duis sed lobortis purus.\n\nMorbi sit amet sem blandit, cursus felis sit amet, accumsan turpis. Vivamus et facilisis enim. Duis vestibulum sodales neque, ut suscipit nulla ultrices vitae. In ac accumsan erat. Nunc consectetur massa non elit mollis bibendum. Nullam tincidunt augue mi. Vestibulum dapibus et nunc quis auctor. Etiam malesuada cursus purus, et gravida dolor vehicula vel. Nam scelerisque magna ut risus semper, eget iaculis ligula hendrerit. Donec ac varius mauris, a pulvinar diam. Sed elementum, ex molestie dictum suscipit, lectus nunc pellentesque turpis, ac scelerisque tellus odio vel nisi. Donec facilisis, purus id volutpat varius, mi ex accumsan diam, a viverra lectus dui vel turpis. Nam tellus est, volutpat id scelerisque at, auctor id arcu. Proin molestie lobortis tempor. Ut ultricies lectus tincidunt erat consequat, at vestibulum erat commodo.",
    //   desiredSize:
    //   {
    //     width: 400,
    //     height: 700
    //   }
    // },
    // {
    //   content: React.DOM.div(null,
    //     React.DOM.div(null, "Works with"),
    //     React.DOM.button(null, "react elements too")
    //   )
    // }
  ],
};

export default introTutorial;
