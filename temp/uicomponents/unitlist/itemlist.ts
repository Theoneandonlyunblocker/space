/// <reference path="list.ts" />
/// <reference path="itemlistitem.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class ItemList extends React.Component<PropTypes, {}>
{
  displayName: string = "ItemList";

  getSlotIndex: function(slot: string)
  {
    if (slot === "high")
    {
      return 2;
    }
    else if (slot === "mid")
    {
      return 1;
    }
    else return 0;
  }

  render: function()
  {
    var rows: IListItem[] = [];
    var items: Item[] = this.props.items;

    for (var i = 0; i < items.length; i++)
    {
      var item = items[i];

      var ability: any = null;
      var abilityIsPassive = false;
      if (item.template.ability)
      {
        ability = item.template.ability;
      }
      else if (item.template.passiveSkill)
      {
        ability = item.template.passiveSkill;
        abilityIsPassive = true;
      }

      var data: any =
      {
        item: item,
        key: item.id,
        keyTODO: item.id,
        id: item.id,
        typeName: item.template.displayName,
        slot: item.template.slot,
        slotIndex: this.getSlotIndex(item.template.slot),
        unit: item.unit ? item.unit : null,
        unitName: item.unit ? item.unit.name : "",
        techLevel: item.template.techLevel,
        cost: item.template.buildCost,

        ability: ability,
        abilityName: ability ? ability.displayName : "",
        abilityIsPassive: abilityIsPassive,

        isReserved: Boolean(item.unit),

        makeClone: true,
        forcedDragOffset: {x: 32, y: 32},
        rowConstructor: UIComponents.ItemListItem,
        isDraggable: this.props.isDraggable,
        onDragStart: this.props.onDragStart,
        onDragEnd: this.props.onDragEnd
      };

      ["maxActionPoints", "attack", "defence",
        "intelligence", "speed"].forEach(function(stat)
      {
        if (!item.template.attributes) data[stat] = null;
        else data[stat] = item.template.attributes[stat] || null;
      });

      rows.push(
      {
        key: item.id,
        data: data
      });
    }

    var columns: IListColumn[];

    if (this.props.isItemPurchaseList)
    {
      columns =
      [
        {
          label: "Type",
          key: "typeName",
          defaultOrder: "asc"
        },
        {
          label: "Slot",
          key: "slot",
          propToSortBy: "slotIndex",
          defaultOrder: "desc"
        },
        {
          label: "Tech",
          key: "techLevel",
          defaultOrder: "asc"
        },
        {
          label: "Cost",
          key: "cost",
          defaultOrder: "asc"
        }
      ]
    }
    else
    {
      columns =
      [
        {
          label: "Type",
          key: "typeName",
          defaultOrder: "asc"
        },
        {
          label: "Slot",
          key: "slot",
          propToSortBy: "slotIndex",
          defaultOrder: "desc"
        },
        {
          label: "Unit",
          key: "unitName",
          defaultOrder: "desc"
        },
        {
          label: "Act",
          key: "maxActionPoints",
          defaultOrder: "desc"
        },
        {
          label: "Atk",
          key: "attack",
          defaultOrder: "desc"
        },
        {
          label: "Def",
          key: "defence",
          defaultOrder: "desc"
        },
        {
          label: "Int",
          key: "intelligence",
          defaultOrder: "desc"
        },
        {
          label: "Spd",
          key: "speed",
          defaultOrder: "desc"
        },
        {
          label: "Ability",
          key: "abilityName",
          defaultOrder: "desc"
        }
      ];
    }

   

    return(
      React.DOM.div({className: "item-list fixed-table-parent"},
        UIComponents.List(
        {
          listItems: rows,
          initialColumns: columns,
          initialSortOrder: [columns[1], columns[2]], // slot, unit
          onRowChange: this.props.onRowChange,
          tabIndex: 2,
          keyboardSelect: true
        })
      )
    );
  }
}
