/// <reference path="../../../lib/react-global.d.ts" />

interface PropTypes extends React.Props<any>
{
  handleClose: () => void;
  contentConstructor: React.Factory<any>;
  contentProps: any;
}

interface StateType
{
}

export class TopMenuPopupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopMenuPopup";
  state: StateType;
  ref_TODO_content: React.ReactElement<any>;

  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    var contentProps = this.props.contentProps;
    contentProps.ref = (component: React.ReactElement<any>) =>
    {
      this.ref_TODO_content = component;
    };

    return(
      React.DOM.div(
      {
        className: "top-menu-popup-container draggable-container"
      },
        React.DOM.button(
        {
          className: "light-box-close",
          onClick: this.props.handleClose
        }, "X"),
        React.DOM.div(
        {
          className: "light-box-content"
        },
          this.props.contentConstructor(contentProps)
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopupComponent);
export default Factory;
