import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {TutorialPage} from "../../../../src/tutorials/Tutorial";
import {tutorialStatus} from "../../../../src/tutorials/TutorialStatus";
import {TutorialVisibility} from "../../../../src/tutorials/TutorialVisibility";
import
{
  clamp,
  splitMultilineText,
} from "../../../../src/generic/utility";

import {DontShowAgain} from "./DontShowAgain";


export interface PropTypes extends React.Props<any>
{
  pages: TutorialPage[];

  tutorialId: string;
}

interface StateType
{
  currentPageIndex: number;
}

export class TutorialComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "Tutorial";

  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.state = this.getInitialStateTODO();

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleEnterPage = this.handleEnterPage.bind(this);
    this.flipPage = this.flipPage.bind(this);
    this.handleLeavePage = this.handleLeavePage.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  private getInitialStateTODO(): StateType
  {
    return(
    {
      currentPageIndex: 0,
    });
  }

  componentDidMount()
  {
    this.handleEnterPage(this.props.pages[this.state.currentPageIndex]);
  }

  componentWillUnmount()
  {
    this.handleLeavePage(this.props.pages[this.state.currentPageIndex]);
    this.handleClose();
  }

  handleEnterPage(page: TutorialPage)
  {
    if (page.onOpen)
    {
      page.onOpen();
    }

    if (page.desiredSize)
    {

    }
  }

  handleLeavePage(page: TutorialPage)
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
    const lastPage = this.props.pages.length - 1;
    let newPage = this.state.currentPageIndex + amount;
    newPage = clamp(newPage, 0, lastPage);

    this.handleLeavePage(this.props.pages[this.state.currentPageIndex]);

    this.setState(
    {
      currentPageIndex: newPage,
    }, this.handleEnterPage.bind(this, this.props.pages[newPage]));
  }

  handleClose()
  {
    if (tutorialStatus[this.props.tutorialId] === TutorialVisibility.Show)
    {
      tutorialStatus[this.props.tutorialId] = TutorialVisibility.DontShowThisSession;
    }
  }

  render()
  {
    const hasBackArrow = this.state.currentPageIndex > 0;
    let backElement: React.ReactHTMLElement<any>;
    if (hasBackArrow)
    {
      backElement = ReactDOMElements.div(
      {
        className: "tutorial-flip-page tutorial-flip-page-back",
        onClick: this.flipPage.bind(this, -1),
      });
    }
    else
    {
      backElement = ReactDOMElements.div(
      {
        className: "tutorial-flip-page disabled",
      });
    }

    const hasForwardArrow = this.state.currentPageIndex < this.props.pages.length - 1;
    let forwardElement: React.ReactHTMLElement<any>;
    if (hasForwardArrow)
    {
      forwardElement = ReactDOMElements.div(
      {
        className: "tutorial-flip-page tutorial-flip-page-forward",
        onClick: this.flipPage.bind(this, 1),
      });
    }
    else
    {
      forwardElement = ReactDOMElements.div(
      {
        className: "tutorial-flip-page disabled",
      });
    }

    return(
      ReactDOMElements.div(
      {
        className: "tutorial",
      },
        ReactDOMElements.div(
        {
          className: "tutorial-inner",
        },
          backElement,

          ReactDOMElements.div(
          {
            className: "tutorial-content",
          }, splitMultilineText(this.props.pages[this.state.currentPageIndex].content)),

          forwardElement,
        ),
        DontShowAgain(
        {
          tutorialId: this.props.tutorialId,
        }),
      )
    );
  }
}

export const Tutorial: React.Factory<PropTypes> = React.createFactory(TutorialComponent);
