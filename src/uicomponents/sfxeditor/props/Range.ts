/// <reference path="../../../../lib/react-global.d.ts" />

import SFXFragment from "../../../../modules/common/battlesfxfunctions/sfxfragments/SFXFragment";

import Vec2Base from "./Vec2Base";

interface PropTypes extends React.Props<any>
{
  propName: string;
  fragment: SFXFragment<any, any>;
  onValueChange: () => void;

  min: number;
  max: number;
}

export class SFXFragmentPropRangeComponent extends Vec2Base<PropTypes>
{
  displayName = "SFXFragmentPropRange";

  value1Key = "min";
  value2Key = "max";

  value1Label = "Min";
  value2Label = "Max";

  constructor(props: PropTypes)
  {
    super(props);
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(SFXFragmentPropRangeComponent);
export default Factory;
