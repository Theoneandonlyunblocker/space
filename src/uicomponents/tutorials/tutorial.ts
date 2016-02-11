module Rance
{
  export module UIComponents
  {
    export var Tutorial = React.createClass(
    {
      displayName: "Tutorial",

      propTypes:
      {
        pages: React.PropTypes.arrayOf(React.PropTypes.any).isRequired, // React.PropTypes.node
        cancelText: React.PropTypes.string
      },

      getInitialState: function()
      {
        return(
        {
          currentPage: 0
        });
      },

      componentDidMount: function()
      {
        this.handleEnterPage(this.props.pages[this.state.currentPage]);
      },

      componentWillUnmount: function()
      {
        this.handleLeavePage(this.props.pages[this.state.currentPage]);
      },

      handleEnterPage: function(page: ITutorialPage)
      {
        if (page.onOpen)
        {
          page.onOpen();
        }

        if (page.desiredSize)
        {

        }
      },

      handleLeavePage: function(page: ITutorialPage)
      {
        if (page.onClose)
        {
          page.onClose();
        }

        if (page.desiredSize)
        {
          
        }
      },

      flipPage: function(amount: number)
      {
        var lastPage = this.props.pages.length - 1;
        var newPage = this.state.currentPage + amount;
        newPage = clamp(newPage, 0, lastPage);

        this.handleLeavePage(this.props.pages[this.state.currentPage]);

        this.setState(
        {
          currentPage: newPage
        }, this.handleEnterPage.bind(this, this.props.pages[newPage]));
      },

      handleClose: function()
      {
        if (this.refs.dontShowAgain.getDOMNode().checked)
        {
          //do stuff
        }
      },

      render: function()
      {
        var hasBackArrow = this.state.currentPage > 0;
        var backElement: ReactDOMPlaceHolder;
        if (hasBackArrow)
        {
          backElement = React.DOM.div(
          {
            className: "tutorial-flip-page tutorial-flip-page-back",
            onClick: this.flipPage.bind(this, -1)
          }, "<")
        }
        else
        {
          backElement = React.DOM.div(
          {
            className: "tutorial-flip-page disabled"
          })
        }

        var hasForwardArrow = this.state.currentPage < this.props.pages.length - 1;
        var forwardElement: ReactDOMPlaceHolder;
        if (hasForwardArrow)
        {
          forwardElement = React.DOM.div(
          {
            className: "tutorial-flip-page tutorial-flip-page-forward",
            onClick: this.flipPage.bind(this, 1)
          }, ">")
        }
        else
        {
          forwardElement = React.DOM.div(
          {
            className: "tutorial-flip-page disabled"
          })
        }

        return(
          React.DOM.div(
          {
            className: "tutorial"
          },
            React.DOM.div(
            {
              className: "tutorial-inner"
            },
              backElement,

              React.DOM.div(
              {
                className: "tutorial-content"
              }, this.props.pages[this.state.currentPage].content),

              forwardElement
            )
            // React.DOM.div(
            // {
            //   className: "dont-show-again-wrapper"
            // },
            //   React.DOM.label(null,
            //     React.DOM.input(
            //     {
            //       type: "checkBox",
            //       ref: "dontShowAgain",
            //       className: "dont-show-again"
            //     }),
            //     "Disable tutorial"
            //   )
            // )
          )
        );
      }
    });
  }
}