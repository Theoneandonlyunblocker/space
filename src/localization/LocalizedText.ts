/*

custom macros can be defined by '{}'
see string-format.js for details
  s =
  {
    CONFIRM_EQUIP: "Equip {item_name} on {unit_name}?",
    CONFIRM_WAR_DECLARATION: "Declare war on {0}",
  }

  tr(s.CONFIRM_EQUIP).format(
  {
    item_name: item.template.displayName,
    unit_name: unit.name,
  });

  tr(s.CONFIRM_WAR_DECLARATION).format(targetPlayer.name);


include other localized text with '[]'
  s =
  {
    unit:
    {
      1: "unit",
      "2..": "units",
    },
    wasWere:
    {
      1: "was",
      "2..": "were",
    },
    unitDestroyed: "{n} [unit] [wasWere] destroyed.",
  }

  tr(s.unitDestroyed, 1) => "1 unit was destroyed"
  tr(s.unitDestroyed, 69) => "69 units were destroyed"

*/

export interface LocalizedTextByQuantity
{
  // "2..5", "..5", "2.."
  [quantity: string]: string;

  // 0, 1, -2
  [quantity: number]: string;

  other?: string;
}

export type LocalizedText = string | LocalizedTextByQuantity;
