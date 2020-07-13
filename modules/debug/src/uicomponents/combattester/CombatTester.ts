import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { CombatEffectEditor } from "./CombatEffectEditor";


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
const tabs: TabInfo[] =
[
  {
    key: "effects",
    label: "Effects",
    render: () => CombatEffectEditor(),
  },
];

const CombatTesterComponent: React.FunctionComponent<PropTypes> = props =>
{
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
        className: "temp",
        style: {border: "1px solid purple", flex: "0 0 50%"},
      },

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
