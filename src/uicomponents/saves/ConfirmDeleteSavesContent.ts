/// <reference path="../../../lib/react-global.d.ts" />

interface PropTypes extends React.Props<any>
{
  saveNames: string[];
}

interface StateType
{
}

export class ConfirmDeleteSavesContentComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName = "ConfirmDeleteSavesContent";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);
  }
  
  render()
  {
    return(
      React.DOM.div(
      {
        className: "confirm-delete-saves-content"
      },
        React.DOM.span(
        {
          className: "confirm-delete-saves-content-title"
        },
          "Are you sure you want to delete the following saves?"
        ),
        React.DOM.ol(
        {
          className: "confirm-delete-saves-content-saves-list"
        },
          this.props.saveNames.map(saveName =>
          {
            return(
              React.DOM.li(
              {
                className: "confirm-delete-saves-content-save-name",
                key: saveName
              },
                saveName
              )
            );
          })
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(ConfirmDeleteSavesContentComponent);
export default Factory;
