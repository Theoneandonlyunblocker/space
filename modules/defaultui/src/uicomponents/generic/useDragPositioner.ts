// dumb and hacky
// the dragpositioner mixin is used in so many places i'd rather not switch. it works ok(?) anyway

import { DragPositioner, DragPositionerProps } from "../mixins/DragPositioner";
import { useEffect, useRef, useReducer } from "react";


export function useDragPositioner(props:
{
  ownerElementRef: React.RefObject<HTMLElement>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  props?: DragPositionerProps;
}
): (() => DragPositioner<any>)
{
  const forceUpdateDummyReducer = useReducer(x => x + 1, 0);
  const forceUpdate = <() => void>forceUpdateDummyReducer[1];

  const ref = useRef<DragPositioner<any>>(null);

  function getDragPositioner(): DragPositioner<any>
  {
    if (!ref.current)
    {
      ref.current = new DragPositioner(<any>{forceUpdate: forceUpdate}, props.ownerElementRef, props.props);
      ref.current.onDragStart = props.onDragStart;
      ref.current.onDragEnd = props.onDragEnd;
    }

    return ref.current;
  }

  useEffect(function mountDragPositioner()
  {
    getDragPositioner().componentDidMount();

    return function unmountDragPositioner()
    {
      getDragPositioner().componentWillUnmount();
    };
  }, []);

  return getDragPositioner;
}
