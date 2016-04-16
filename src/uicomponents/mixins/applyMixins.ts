/// <reference path="../../../lib/react-global-0.13.3.d.ts" />

import MixinBase from "./MixinBase";

type LifeCycleFunction = "componentWillMount" | "componentDidMount" |
  "componentWillReceiveProps" | "componentWillUpdate" |
  "componentDidUpdate" | "componentWillUnmount";
const lifeCycleFunctions =
[
  "componentWillMount" , "componentDidMount" ,
  "componentWillReceiveProps" , "componentWillUpdate" ,
  "componentDidUpdate" , "componentWillUnmount"
];

function wrapLifeCycleFunction(base: React.Component<any, any>, functionName: LifeCycleFunction, mixins: MixinBase<any>[])
{
  const originalFunction = base[functionName];
  const mixinsWithFunction = mixins.filter(m => Boolean(m[functionName]));
  
  base[functionName] = function(...args: any[])
  {
    mixinsWithFunction.forEach(m =>
    {
      m[functionName].call(m, args);
    });
    if (originalFunction)
    {
      originalFunction.call(base, args);
    }
  }
}
function wrapRenderFunction(base: React.Component<any, any>, mixins: MixinBase<any>[])
{
  const originalFunction = base.render;
  const mixinsWithFunction = mixins.filter(m => Boolean(m.onRender));
  
  base.render = function(...args: any[])
  {
    mixinsWithFunction.forEach(m =>
    {
      m.onRender.call(m);
    });
    return originalFunction.apply(base, args);
  }
}

export default function applyMixins(base: React.Component<any, any>, ...mixins: MixinBase<any>[])
{
  lifeCycleFunctions.forEach((functionName: LifeCycleFunction) =>
  {
    wrapLifeCycleFunction(base, functionName, mixins);
  });
  
  wrapRenderFunction(base, mixins);
}
