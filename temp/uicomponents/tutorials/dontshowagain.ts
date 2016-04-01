/// <reference path="../../tutorials/tutorialstatus.ts" />

export interface PropTypes
{
  tutorialId: string;
}

export default class DontShowAgain extends React.Component<PropTypes, {}>
{
  displayName: string = "DontShowAgain";


  getInitialState: function()
  {
    return(
    {
      isChecked: this.getTutorialState() === tutorialStatus.neverShow
    });
  }
  
  getTutorialState: function()
  {
    return Rance.TutorialState[this.props.tutorialId];
  }

  toggleState: function()
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

  render: function()
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
