/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react";

/// <reference path="../../tutorials/tutorialstatus.ts" />

export interface PropTypes
{
  tutorialId: string;
}

export default class DontShowAgain extends React.Component<PropTypes, {}>
{
  displayName: string = "DontShowAgain";


  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getInitialState()
  {
    return(
    {
      isChecked: this.getTutorialState() === tutorialStatus.neverShow
    });
  }
  
  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  getTutorialState()
  {
    return Rance.TutorialState[this.props.tutorialId];
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  toggleState()
  {
    if (this.state.isChecked)
    {
      Rance.TutorialState[this.props.tutorialId] = tutorialStatus.show;
    }
    else
    {
      Rance.TutorialState[this.props.tutorialId] = tutorialStatus.neverShow;
    }

    saveTutorialState();

    this.setState(
    {
      isChecked: !this.state.isChecked
    });
  }

  constructor(props: PropTypes)
  {
    super(props);
    
    this.state = 
    {
    
    };
    
    this.bindMethods();
  }
  private bindMethods()
  {
    
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "dont-show-again-wrapper"
      },
        React.DOM.label(null,
          React.DOM.input(
          {
            type: "checkBox",
            ref: "dontShowAgain",
            className: "dont-show-again",
            checked: this.state.isChecked,
            onChange: this.toggleState
          }),
          "Don't show again"
        )
      )
    );
  }
}
