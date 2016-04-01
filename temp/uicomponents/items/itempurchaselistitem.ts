export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class ItemPurchaseListItem extends React.Component<PropTypes, {}>
{
  displayName: string = "ItemPurchaseListItem";
  makeCell(type: string)
  {
    var cellProps: any = {};
    cellProps.key = type;
    cellProps.className = "item-purchase-list-item-cell " +
      "item-purchase-list-" + type;

    var cellContent: any;

    switch (type)
    {
      case ("buildCost"):
      {
        if (this.props.playerMoney < this.props.buildCost)
        {
          cellProps.className += " negative";
        }
      }
      default:
      {
        cellContent = this.props[type];
        if (isFinite(cellContent))
        {
          cellProps.className += " center-text"
        }

        break;
      }
    }

    return(
      React.DOM.td(cellProps, cellContent)
    );
  }

  render()
  {
    var cells: ReactDOMPlaceHolder[] = [];
    var columns = this.props.activeColumns;

    for (var i = 0; i < columns.length; i++)
    {
      cells.push(
        this.makeCell(columns[i].key)
      );
    }

    var props: any =
    {
      className: "item-purchase-list-item",
      onClick: this.props.handleClick
    }
    if (this.props.playerMoney < this.props.buildCost)
    {
      props.onClick = null;
      props.disabled = true;
      props.className += " disabled";
    }

    return(
      React.DOM.tr(props,
        cells
      )
    );
  }
}
