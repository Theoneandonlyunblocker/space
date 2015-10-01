/// <reference path="abilitylist.ts" />
/// <reference path="unititemwrapper.ts"/>
/// <reference path="unitexperience.ts" />

module Rance
{
  export module UIComponents
  {
    export var MenuUnitInfo = React.createClass(
    {
      displayName: "MenuUnitInfo",
      render: function()
      {
        var unit: Unit = this.props.unit;
        if (!unit) return(
          React.DOM.div({className: "menu-unit-info"})
        )

        var itemSlots: ReactComponentPlaceHolder[] = [];

        for (var slot in unit.items)
        {
          itemSlots.push(UIComponents.UnitItemWrapper(
          {
            key: slot,
            slot: slot,
            item: unit.items[slot],
            onMouseUp: this.props.onMouseUp,

            isDraggable: this.props.isDraggable,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            currentDragItem: this.props.currentDragItem
          }));
        }

        return(
          React.DOM.div(
          {
            className: "menu-unit-info"
          },
            React.DOM.div(
            {
              className: "menu-unit-info-name"
            }, unit.name),
            React.DOM.div(
            {
              className: "menu-unit-info-image unit-image" // UNIT IMAGE TODO
            },
              null
            ),
            React.DOM.div(
            {
              className: "menu-unit-info-abilities"
            },
              UIComponents.AbilityList(
              {
                abilities: unit.getAllAbilities(),
                listPassiveSkills: false
              }),
              UIComponents.AbilityList(
              {
                abilities: unit.getAllPassiveSkills(),
                listPassiveSkills: true
              })
            ),
            UIComponents.UnitExperience(
            {
              experienceForCurrentLevel: unit.experienceForCurrentLevel,
              experienceToNextLevel: unit.getExperienceToNextLevel(),
              unit: unit
            }),
            React.DOM.div(
            {
              className: "menu-unit-info-items-wrapper"
            },
              itemSlots
            )
          )
        );
      }
    });
  }
}