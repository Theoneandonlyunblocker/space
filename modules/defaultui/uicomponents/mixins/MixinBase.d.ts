import * as React from "react";

declare interface MixinBase<T extends React.Component<any, any>>
{
  componentDidMount?: () => void;
  componentDidUpdate?: () => void;
  componentWillUnmount?: () => void;

  onRender?: () => void;
}

export default MixinBase;
