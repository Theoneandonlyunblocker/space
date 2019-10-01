import { Resources } from "core/src/player/PlayerResources";
import { Player } from "core/src/player/Player";
import { useEffect, useState, useRef } from "react";


let updaterIdGenerator: number = 0;
export function getUpdaterId(): number
{
  return updaterIdGenerator++;
}
export const updaters:
{
  [playerId: number]:
  {
    [updaterId: number]: () => void;
  }
} = {};

export function useResources(player: Player): Resources
{
  const [resources, setResources] = useState<Resources>(() =>
  {
    return {...player.resources};
  });
  const updaterId = useRef<number>(undefined);

  useEffect(function addUseResourcesListener()
  {
    updaterId.current = getUpdaterId();

    if (!updaters[player.id])
    {
      updaters[player.id] = {};
    }
    updaters[player.id][updaterId.current] = () =>
    {
      setResources({...player.resources});
    };

    return function removeUseResourcesListener()
    {
      updaters[player.id][updaterId.current] = null;
      delete updaters[player.id][updaterId.current];
    };
  }, []);

  return resources;
}

export function updateResources(player: Player): void
{
  if (updaters[player.id])
  {
    for (const updaterId in updaters[player.id])
    {
      updaters[player.id][updaterId]();
    }
  }
}
