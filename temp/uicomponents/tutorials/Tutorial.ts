/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../mixins/splitmultilinetext.ts" />
/// <reference path="dontshowagain.ts" />

export interface PropTypes
{
  pages: reactTypeTODO_node[]; // React.PropTypes.node

  tutorialId: string;
}

interface StateType
{
  // TODO refactor | add state type
}

class Tutorial extends React.Component<PropTypes, StateType>
{
  displayName: string = "Tutorial";
  mixins: reactTypeTODO_any = [SplitMultilineText];


  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = this.getInitialState();
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  private getInitialState(): StateType
  {
    return(
    {
      currentPage: 0
    });
  }

  componentDidMount()
  {
    this.handleEnterPage(this.props.pages[this.state.currentPage]);
  }

  componentWillUnmount()
  {
    this.handleLeavePage(this.props.pages[this.state.currentPage]);
    this.handleClose();
  }

  handleEnterPage(page: ITutorialPage)
  {
    if (page.onOpen)
    {
      page.onOpen();
    }

    if (page.desiredSize)
    {

    }
  }

  handleLeavePage(page: ITutorialPage)
  {
    if (page.onClose)
    {
      page.onClose();
    }

    if (page.desiredSize)
    {
      
    }
  }

  flipPage(amount: number)
  {
    var lastPage = this.props.pages.length - 1;
    var newPage = this.state.currentPage + amount;
    newPage = clamp(newPage, 0, lastPage);

    this.handleLeavePage(this.props.pages[this.state.currentPage]);

    this.setState(
    {
      currentPage: newPage
    }, this.handleEnterPage.bind(this, this.props.pages[newPage]));
  }

  handleClose()
  {
    if (TutorialState[this.props.tutorialId] === tutorialStatus.show)
    {
      TutorialState[this.props.tutorialId] = tutorialStatus.dontShowThisSession;
    }
  }

  render()
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
          }, this.splitMultilineText(this.props.pages[this.state.currentPage].content)),

          forwardElement
        ),
        DontShowAgain(
        {
          tutorialId: this.props.tutorialId
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(Tutorial);
export default Factory;
