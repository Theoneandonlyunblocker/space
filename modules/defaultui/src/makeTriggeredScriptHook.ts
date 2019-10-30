import { useState, useRef, useEffect } from "react";

type TriggeredScriptHook<Args, T> =
{
  hook: (args: Args) => T;
  updateHooks: (args: Args) => void;
  // vvv legacy to maintain compat with mixin stuff vvv
  updaters:
  {
    [updaterId: number]:
    {
      update: () => void;
      shouldUpdate?: (args: Args) => boolean;
    };
  };
  getUpdaterId: () => number;
  // ^^^ legacy ^^^
};

export function makeTriggeredScriptHook<Args, T>(
  getValue: (args: Args) => T,
): TriggeredScriptHook<Args, T>
{
  let updaterIdGenerator: number = 0;
  const updaters:
  {
    [updaterId: number]:
    {
      update: () => void;
      shouldUpdate?: (args: Args) => boolean;
    };
  } = {};

  const hook = (args: Args, shouldUpdate?: (args: Args) => boolean) =>
  {
    const [value, setValue] = useState<T>(() =>
    {
      return getValue(args);
    });
    const updaterId = useRef<number>(undefined);

    useEffect(function addTriggeredScriptHookListener()
    {
      updaterId.current = updaterIdGenerator++;

      updaters[updaterId.current] = {
        update: () => setValue(getValue(args)),
        shouldUpdate: shouldUpdate,
      };

      return function removeTriggeredScriptHooklistener()
      {
        updaters[updaterId.current] = null;
        delete updaters[updaterId.current];
      };
    }, []);

    return value;
  };

  const updateHooks = (args: Args) =>
  {
    for (const updaterId in updaters)
    {
      const updater = updaters[updaterId];
      const shouldUpdate = !updater.shouldUpdate || updater.shouldUpdate(args);
      if (shouldUpdate)
      {
        updater.update();
      }
    }
  };

  return {
    hook: hook,
    updateHooks: updateHooks,
    updaters: updaters,
    getUpdaterId: () => updaterIdGenerator++,
  };
}
