import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {localize} from "../../../localization/localize";


export interface PropTypes extends React.Props<any>
{
  saveNames: string[];
}

interface StateType
{
}

export class ConfirmDeleteSavesContentComponent extends React.PureComponent<PropTypes, StateType>
{
  public displayName = "ConfirmDeleteSavesContent";
  public override state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
  }

  public override render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "confirm-delete-saves-content",
      },
        ReactDOMElements.span(
        {
          className: "confirm-delete-saves-content-title",
        },
          localize("confirmSaveDeletion").format(
          {
            count: this.props.saveNames.length
          }),
        ),
        ReactDOMElements.ol(
        {
          className: "confirm-delete-saves-content-saves-list",
        },
          this.props.saveNames.map(saveName =>
          {
            return(
              ReactDOMElements.li(
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

export const ConfirmDeleteSavesContent: React.Factory<PropTypes> = React.createFactory(ConfirmDeleteSavesContentComponent);
