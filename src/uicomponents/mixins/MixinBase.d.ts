/// <reference path="../../../lib/react-0.13.3.d.ts" />
import * as React from "react/addons";

declare interface MixinBase<T extends React.Component<any, any>>
{
  componentDidMount?: () => void;
  componentDidUpdate?: () => void;
}

export default MixinBase;
