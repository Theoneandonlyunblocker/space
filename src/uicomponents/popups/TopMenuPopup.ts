/// <reference path="../../../lib/react-global.d.ts" />

export interface PropTypes extends React.Props<any>
{
  handleClose: () => void;
  content: React.ReactElement<any>;
}

interface StateType
{
}

interface ContentComponent extends React.Component<any, any>
{
  parentPopupDidMount?: () => void;
}

export class TopMenuPopupComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "TopMenuPopup";
  state: StateType;
  ref_TODO_content: ContentComponent;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public parentPopupDidMount(): void
  {
    if (this.ref_TODO_content.parentPopupDidMount)
    {
      this.ref_TODO_content.parentPopupDidMount();
    }
  }
  
  render()
  {
    const contentProps =
    {
      ref: (component: ContentComponent) =>
      {
        this.ref_TODO_content = component;
      }
    }
    
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
          React.cloneElement(this.props.content, contentProps)
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(TopMenuPopupComponent);
export default Factory;
