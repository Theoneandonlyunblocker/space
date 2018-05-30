import * as React from "react";

import {localize} from "../../../localization/localize";


interface PropTypes extends React.Props<any>
{
  saveNames: string[];
}

interface StateType
{
}

export class ConfirmDeleteSavesContentComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "ConfirmDeleteSavesContent";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  render()
  {
    return(
      React.DOM.div(
      {
        className: "confirm-delete-saves-content",
      },
        React.DOM.span(
        {
          className: "confirm-delete-saves-content-title",
        },
          localize("confirmSaveDeletion")(
          {
            count: this.props.saveNames.length
          }),
        ),
        React.DOM.ol(
        {
          className: "confirm-delete-saves-content-saves-list",
        },
          this.props.saveNames.map(saveName =>
          {
            return(
              React.DOM.li(
              {
                className: "confirm-delete-saves-content-save-name",
                key: saveName,
              },
                saveName,
              )
            );
          }),
        ),
      )
    );
  }
}

const factory: React.Factory<PropTypes> = React.createFactory(ConfirmDeleteSavesContentComponent);
export default factory;
