/// <reference path="../../../lib/react-global-0.13.3.d.ts" />
import ListColumn from "./ListColumn"; // TODO refactor | autogenerated
import ListItem from "./ListItem"; // TODO refactor | autogenerated

/// <reference path="list.ts" />
/// <reference path="itemlistitem.ts" />


import Unit from "../../Unit";
import List from "./List";
import ItemListItem from "./ItemListItem";
import Item from "../../Item";
import AbilityBase from "../../templateinterfaces/AbilityBase";


interface PropTypes extends React.Props<any>
{
  onDragEnd: (dropSuccesful?: boolean) => void;
  onDragStart: (item: Item) => void;
  isItemPurchaseList?: boolean;
  items: Item[];
  isDraggable: boolean;
  onRowChange: (row: ListItem) => void;
  
  selectedUnit?: Unit; // only used to trigger updates
}

interface StateType
{
}

export class ItemListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "ItemList";

  getSlotIndex(slot: string)
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

  state: StateType;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.getSlotIndex = this.getSlotIndex.bind(this);    
  }
  
  render()
  {
    var rows: ListItem[] = [];
    var items: Item[] = this.props.items;

    for (let i = 0; i < items.length; i++)
    {
      var item = items[i];

      var ability: AbilityBase = null;
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

      var data =
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
        rowConstructor: ItemListItem,

        dragPositionerProps:
        {
          shouldMakeClone: true,
          forcedDragOffset: {x: 32, y: 32},
        },
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

    var columns: ListColumn[];

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
        List(
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

const Factory: React.Factory<PropTypes> = React.createFactory(ItemListComponent);
export default Factory;
