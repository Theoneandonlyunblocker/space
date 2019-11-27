import { useEffect, RefObject, InputIdentityList } from "react";


// not 100% sure if this wouldn't be done better (or could be done at all) by setting element tabindex and using native blur/focusout events
export function useOnClickOutside(
  props:
  {
    parentElementRef: RefObject<HTMLElement>;
    onClickOutside: () => void;
  },
  inputs?: InputIdentityList,
)
{
  function handleDocumentClick(e: MouseEvent): void
  {
    const parent = props.parentElementRef.current;
    const target = <HTMLElement> e.target;

    if (target === parent || parent.contains(target))
    {
      return;
    }
    else
    {
      props.onClickOutside();
    }
  }

  useEffect(function registerOnClickOutsideListener()
  {
    document.addEventListener("click", handleDocumentClick, false);

    return function unregisterOnClickOutsideListener()
    {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, inputs);
}
