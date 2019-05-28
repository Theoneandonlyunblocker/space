declare interface NormalizedEvent
{
  wasTouchEvent: boolean;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  target: HTMLElement & EventTarget;

  button: number;

  preventDefault: () => void;
  stopPropagation: () => void;
}

export default NormalizedEvent;
