import * as React from "react";

import NormalizedEvent from "./NormalizedEvent";


// TODO performance | performance might be pretty bad
// we should be able to use native event and fetch some flags
// using methods like wasTouchEvent(e) & didHaveButtonPressed(e)
function normalizeMouseEvent(nativeEvent: MouseEvent, reactEvent?: React.MouseEvent<any>): NormalizedEvent
{
  return(
  {
    wasTouchEvent: false,
    clientX: nativeEvent.clientX,
    clientY: nativeEvent.clientY,
    pageX: nativeEvent.pageX,
    pageY: nativeEvent.pageY,
    // https://github.com/Microsoft/TypeScript/issues/299
    target: <HTMLElement & EventTarget> nativeEvent.target,

    button: nativeEvent.button,

    preventDefault: (reactEvent ?
      reactEvent.preventDefault.bind(reactEvent) :
      nativeEvent.preventDefault.bind(nativeEvent)),
    stopPropagation: (reactEvent ?
      reactEvent.stopPropagation.bind(reactEvent) :
      nativeEvent.stopPropagation.bind(nativeEvent)),
  });
}
function normalizeTouchEvent(nativeEvent: TouchEvent, reactEvent?: React.TouchEvent<any>): NormalizedEvent
{
  const touch: Touch = nativeEvent.touches[0];

  return(
  {
    wasTouchEvent: true,
    clientX: touch.clientX,
    clientY: touch.clientY,
    pageX: touch.pageX,
    pageY: touch.pageY,
    target: <HTMLElement & EventTarget> touch.target,

    button: -1,

    preventDefault: (reactEvent ?
      reactEvent.preventDefault.bind(reactEvent) :
      nativeEvent.preventDefault.bind(nativeEvent)),
    stopPropagation: (reactEvent ?
      reactEvent.stopPropagation.bind(reactEvent) :
      nativeEvent.stopPropagation.bind(nativeEvent)),
  });
}

export default function normalizeEvent(sourceEvent: MouseEvent | TouchEvent | React.MouseEvent<any> | React.TouchEvent<any>): NormalizedEvent
{
  const castedEvent = <any> sourceEvent;
  const isReactEvent = Boolean(castedEvent.nativeEvent);
  const isTouchEvent = Boolean(castedEvent.touches);

  if (isTouchEvent)
  {
    if (isReactEvent)
    {
      return normalizeTouchEvent(<TouchEvent> castedEvent.nativeEvent, castedEvent);
    }
    else
    {
      return normalizeTouchEvent(<TouchEvent> sourceEvent);
    }
  }
  else
  {
    if (isReactEvent)
    {
      return normalizeMouseEvent(<MouseEvent> castedEvent.nativeEvent, castedEvent);
    }
    else
    {
      return normalizeMouseEvent(<MouseEvent> sourceEvent);
    }
  }
}
