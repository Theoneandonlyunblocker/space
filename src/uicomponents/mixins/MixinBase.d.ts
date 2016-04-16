/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

declare interface MixinBase<T extends React.Component<any, any>>
{
  componentDidMount?: () => void;
  componentDidUpdate?: () => void;
  componentWillUnmount?: () => void;
  
  onRender?: () => void;
}

export default MixinBase;
