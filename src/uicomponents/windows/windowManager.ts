import {BaseWindowComponent} from "./BaseWindow";

import {IDDictionary} from "../../IDDictionary";
import {Rect} from "../../Rect";

const baseZIndex = 10000;
const windowCascadeMargin = 20;

let zIndex = baseZIndex;

export function getNewZIndex(component: BaseWindowComponent): number
{
  if (component.state && component.state.zIndex && component.state.zIndex === zIndex)
  {
    return zIndex;
  }
  else
  {
    return zIndex++;
  }
}

const byID = new IDDictionary<BaseWindowComponent, BaseWindowComponent>();

export function getDefaultInitialPosition(rect: Rect, container: HTMLElement): Rect
{
  const windowsByZIndex = byID.sort((a, b) =>
  {
    return b.state.zIndex - a.state.zIndex;
  });

  if (windowsByZIndex.length === 0)
  {
    return(
    {
      left: container.offsetWidth / 2.5 - rect.width / 2,
      top: container.offsetHeight / 2.5 - rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
  }
  else
  {
    const topMostWindowPosition = windowsByZIndex[0].dragPositioner.position;

    return(
    {
      left: topMostWindowPosition.left + windowCascadeMargin,
      top: topMostWindowPosition.top + windowCascadeMargin,
      width: rect.width,
      height: rect.height,
    });
  }
}

export function handleMount(component: BaseWindowComponent): void
{
  if (byID.has(component))
  {
    throw new Error(`Duplicate window ID ${component.id} in window ${component}`);
  }

  byID.set(component, component);
}

export function handleUnount(component: BaseWindowComponent): void
{
  byID.delete(component);
}
