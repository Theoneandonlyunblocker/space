import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { applyMixins } from "modules/defaultui/src/uicomponents/mixins/applyMixins";
import { AutoPositioner, AutoPositionerProps } from "modules/defaultui/src/uicomponents/mixins/AutoPositioner";
import { TitanComponentSelection } from "./TitanComponentSelection";
import { TitanComponentTemplate } from "../TitanComponentTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  slot: string;
  index: number;
  availableComponents: TitanComponentTemplate[];
  onSelect: (component: TitanComponentTemplate) => void;
  autoPositionerProps: AutoPositionerProps;
}

interface StateType
{
}

export class AutoPositionedTitanComponentSelectionComponent extends React.Component<PropTypes, StateType>
{
  public displayName = "AutoPositionedTitanComponentSelection";
  public override state: StateType;

  private readonly ownDOMNode = React.createRef<HTMLDivElement>();

  constructor(props: PropTypes)
  {
    super(props);

    applyMixins(this, new AutoPositioner(this, this.ownDOMNode));
  }

  public override render()
  {
    return(
      ReactDOMElements.div(
      {
        className: "titan-component-selection-positioner",
        ref: this.ownDOMNode,
      },
        TitanComponentSelection(
        {
          availableComponents: this.props.availableComponents,
          onSelect: this.props.onSelect,
        }),
      )
    );
  }
}

// tslint:disable-next-line:variable-name
export const AutoPositionedTitanComponentSelection: React.Factory<PropTypes> = React.createFactory(AutoPositionedTitanComponentSelectionComponent);
