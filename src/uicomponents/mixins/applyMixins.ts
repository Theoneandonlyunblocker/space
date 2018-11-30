import * as React from "react";

import MixinBase from "./MixinBase";


type LifeCycleFunction = "componentDidMount" |
  "componentDidUpdate" | "componentWillUnmount";
const lifeCycleFunctions: LifeCycleFunction[] =
[
  "componentDidMount" ,
  "componentDidUpdate" , "componentWillUnmount",
];

function wrapLifeCycleFunction(base: React.Component<any, any>, functionName: LifeCycleFunction, mixins: MixinBase<any>[])
{
  const originalFunction = base[functionName];
  const mixinsWithFunction = mixins.filter(mixin => Boolean(mixin[functionName]));

  base[functionName] = (...args: any[]) =>
  {
    mixinsWithFunction.forEach(mixin =>
    {
      // @ts-ignore 2345
      mixin[functionName].apply(mixin, args);
    });

    if (originalFunction)
    {
      // @ts-ignore 2684
      originalFunction.apply(base, args);
    }
  };
}
function wrapRenderFunction(base: React.Component<any, any>, mixins: MixinBase<any>[])
{
  const originalFunction = base.render;
  const mixinsWithFunction = mixins.filter(mixin => Boolean(mixin.onRender));

  base.render = (...args: any[]) =>
  {
    mixinsWithFunction.forEach(mixin =>
    {
      mixin.onRender!.call(mixin);
    });

    // @ts-ignore 2345
    return originalFunction.apply(base, args);
  };
}

export default function applyMixins(base: React.Component<any, any>, ...mixins: MixinBase<any>[])
{
  lifeCycleFunctions.forEach((functionName: LifeCycleFunction) =>
  {
    wrapLifeCycleFunction(base, functionName, mixins);
  });

  wrapRenderFunction(base, mixins);
}
