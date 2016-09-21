/// <reference path="../../../../lib/react-global.d.ts" />

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import Vec2Base from "./Vec2Base";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any, any>;
  onValueChange: () => void;

  x: number;
  y: number;
}

export class SFXFragmentPropPointComponent extends Vec2Base<PropTypes>
{
  displayName = "SFXFragmentPropPoint";
  
  value1Key = "x";
  value2Key = "y";

  value1Label = "X";
  value2Label = "Y";

  constructor(props: PropTypes)
  {
    super(props);
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropPointComponent);
export default Factory;
