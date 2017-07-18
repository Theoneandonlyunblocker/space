/*
// TODO 2017.07.18 | dont think any of these are implemented
global macros:
  {subj_pronoun}       i, you
  {obj_pronoun}        me, you
  {poss_determiner}    my, your

// TODO 2017.07.18 | not how localization function currently works or data is stored
// see localization folder in project root for up to date examples
custom macros can be passed where the translation function is called, ex:
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
