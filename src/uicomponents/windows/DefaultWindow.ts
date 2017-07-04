/// <reference path="../../../lib/react-global.d.ts" />

import {default as BaseWindow} from "./BaseWindow";

interface PropTypes extends React.Props<any>
{
  title: string;
  handleClose: () => void;

  minWidth: number;
  minHeight: number;
  maxWidth?: number;
  maxHeight?: number;
}

interface StateType
{
}

export class DefaultWindowComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "DefaultWindow";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public render()
  {
    return(
      BaseWindow(
      {
        isResizable: true,
        containerElement: document.body,

        minWidth: this.props.minWidth,
        minHeight: this.props.minHeight,
        maxWidth: this.props.maxWidth || Infinity,
        maxHeight: this.props.maxHeight || Infinity,
      },
        React.DOM.div(
        {
          className: "window",
        },
          React.DOM.div(
          {
            className: "window-title-bar draggable-container",
          },
            React.DOM.div(
            {
              className: "window-title",
            },
              this.props.title,
            ),
            React.DOM.button(
            {
              className: "window-close-button",
              onClick: this.props.handleClose,
            }),
          ),
          React.DOM.div(
          {
            className: "window-content",
          },
            this.props.children,
          ),
        ),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(DefaultWindowComponent);
export default Factory;
