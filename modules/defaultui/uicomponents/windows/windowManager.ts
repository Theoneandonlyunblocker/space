import {IdDictionary} from "../../../../src/IdDictionary";
import {Rect} from "../../../../src/Rect";

import {WindowContainerComponent} from "./WindowContainer";


const baseZIndex = 10000;
const windowCascadeMargin = 20;

let zIndex = baseZIndex;

const byId = new IdDictionary<WindowContainerComponent, WindowContainerComponent>();


export function getNewZIndex(component: WindowContainerComponent): number
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

export function getWindowsByZIndex(): WindowContainerComponent[]
{
  return byId.sort((a, b) =>
  {
    return b.state.zIndex - a.state.zIndex;
  });
}

export function getDefaultInitialPosition(rect: Rect, container: HTMLElement): Rect
{
  const windowsByZIndex = getWindowsByZIndex();

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

export function handleMount(component: WindowContainerComponent): void
{
  if (byId.has(component))
  {
    throw new Error(`Duplicate window id ${component.id} in window ${component}`);
  }

  byId.set(component, component);
}

export function handleUnount(component: WindowContainerComponent): void
{
  byId.delete(component);
}
