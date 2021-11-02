import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { CombatEffectEditor } from "./CombatEffectEditor";
import { Unit } from "core/src/unit/Unit";
import { UnitEditor } from "./UnitEditor";
import { DebugBattle } from "./DebugBattle";
import { Battle } from "core/src/battle/Battle";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{

}

type TabInfo =
{
  key: string;
  label: string;
  render: () => React.ReactElement<any>;
};

const CombatTesterComponent: React.FunctionComponent<PropTypes> = props =>
{
  const [selectedUnit, setSelectedUnit] = React.useState<Unit | null>(null);
  const battle = React.useRef<Battle | null>(null);

  const tabs: TabInfo[] =
  [
    {
      key: "units",
      label: "Units",
      render: () => UnitEditor(
      {
        unit: selectedUnit,
      }),
    },
    {
      key: "effects",
      label: "Effects",
      render: () => CombatEffectEditor(),
    },
  ];

  const [selectedTab, setSelectedTab] = React.useState<TabInfo>(tabs[0]);

  function makeTab(tabInfo: TabInfo): React.ReactHTMLElement<HTMLButtonElement>
  {
    const isSelected = selectedTab === tabInfo;

    return ReactDOMElements.button(
    {
      className: `combat-tester-editor-tab ${isSelected ? "selected" : ""}`,
      onClick: (e) => setSelectedTab(tabInfo),
      key: tabInfo.key,
    },
      tabInfo.label,
    );
  }

  return(
    ReactDOMElements.div(
    {
      className: "combat-tester",
    },
      ReactDOMElements.div(
      {
        className: "combat-tester-battle-container",
      },
        DebugBattle(
        {
          battle: battle.current,
          onClickUnit: (unit) => setSelectedUnit(unit),
        }),
      ),
      ReactDOMElements.div(
      {
        className: "combat-tester-editor",
      },
        ReactDOMElements.ol(
        {
          className: "combat-tester-editor-tabs",
        },
          tabs.map(tabInfo => makeTab(tabInfo)),
        ),
        selectedTab.render(),
      ),
    )
  );
};

export const CombatTester: React.FunctionComponentFactory<PropTypes> = React.createFactory(CombatTesterComponent);
