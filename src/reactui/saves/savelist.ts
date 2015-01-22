/// <reference path="savelistitem.ts"/>

module Rance
{
  export module UIComponents
  {
    export var SaveList = React.createClass(
    {
      displayName: "SaveList",
      render: function()
      {
        var rows = [];

        var allKeys = Object.keys(localStorage);

        var saveKeys = allKeys.filter(function(key)
        {
          return (key.indexOf("Rance.Save") > -1);
        });

        for (var i = 0; i < saveKeys.length; i++)
        {
          var saveData = JSON.parse(localStorage.getItem(saveKeys[i]));
          var date = new Date(saveData.date);

          rows.push(
          {
            key: saveKeys[i],
            data:
            {
              name: saveData.name,
              date: prettifyDate(date),
              accurateDate: saveData.date,
              rowConstructor: UIComponents.SaveListItem,
              handleDelete: this.props.onDelete ?
                this.props.onDelete.bind(null, saveKeys[i]) :
                null
            }
          });
        }

        var columns: any =
        [
          {
            label: "Name",
            key: "name",
            defaultOrder: "asc"
          },
          {
            label: "Date",
            key: "date",
            defaultOrder: "desc",
            propToSortBy: "accurateDate"
          }
        ];

        if (this.props.allowDelete)
        {
          columns.push(
          {
            label: "Del",
            key: "delete",
            notSortable: true
          });
        }

        return(
          React.DOM.div({className: "save-list"},
            UIComponents.List(
            {
              listItems: rows,
              initialColumns: columns,
              initialSortOrder: [columns[1]], //date
              onRowChange: this.props.onRowChange,
              autoSelect: this.props.autoSelect
            })
          )
        );
      }
    });
  }
}