import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ResourceIcon } from "../resources/ResourceIcon";
import { ResourceTemplate } from "core/src/templateinterfaces/ResourceTemplate";
import { NumberInput } from "../generic/NumberInput";
import { ResourceAmount } from "../resources/ResourceAmount";
import { useDragPositioner } from "../generic/useDragPositioner";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resource: ResourceTemplate;
  amount: number;
  maxAvailable: number | undefined;
  onClick: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  adjustAmount: ((newAmount: number) => void) | undefined;
}

function captureEvent(e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>): void
{
  e.stopPropagation();
}

const TradeResourceComponent: React.FunctionComponent<PropTypes> = props =>
{
  const ownDOMNode = React.createRef<HTMLDivElement>();
  const getDragPositioner = useDragPositioner(
  {
    ownerElementRef: ownDOMNode,
    onDragStart: props.onDragStart,
    onDragEnd: props.onDragEnd,
  });

  const amountElement = !props.adjustAmount ?
    ResourceAmount(
    {
      resource: props.resource,
      amount: props.amount,
    }) :
    NumberInput(
    {
      value: props.amount,
      onChange: props.adjustAmount,
      min: 0,
      max: props.maxAvailable,
      step: 1,
      attributes:
      {
        onClick: captureEvent,
        onMouseDown: captureEvent,
        onTouchStart: captureEvent,
      }
    });

  const dragPositioner = getDragPositioner();
  const mainProps: React.HTMLAttributes<HTMLDivElement> & React.ClassAttributes<HTMLDivElement> =
  {
    className: "trade-resource",
    ref: ownDOMNode,
    onClick: props.onClick,
  };

  if (props.onDragStart)
  {
    mainProps.className += " draggable";
    mainProps.onMouseDown = mainProps.onTouchStart = dragPositioner.handleReactDownEvent;

    if (dragPositioner.isDragging)
    {
      mainProps.style = dragPositioner.getStyleAttributes();
      mainProps.className += " dragging";
    }
  }

  return(
    ReactDOMElements.div(mainProps,
      ReactDOMElements.div(
      {
        className: "trade-resource-display-name",
      },
        props.resource.displayName,
      ),
      ReactDOMElements.div(
      {
        className: "trade-resource-amount",
      },
        amountElement,
      ),
      ResourceIcon({resource: props.resource}),
    )
  );
};

export const TradeResource: React.FunctionComponentFactory<PropTypes> = React.createFactory(TradeResourceComponent);
