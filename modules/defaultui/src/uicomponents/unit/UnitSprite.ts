import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import * as PIXI from "pixi.js";
import { Unit } from "core/src/unit/Unit";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  unit: Unit;
}

const UnitSpriteComponent: React.FunctionComponent<PropTypes> = props =>
{
  const containerElement = React.useRef<HTMLDivElement>(null);
  const renderer = React.useRef<PIXI.Renderer>(null);

  React.useLayoutEffect(function createRenderer()
  {
    renderer.current = new PIXI.Renderer(
    {
      width: 800,
      height: 600,
      autoDensity: false,
      antialias: true,
      transparent: true,
    });

    return function cleanUpUnitSpriteRenderer()
    {
      renderer.current.destroy(false);
      renderer.current = null;
    };
  }, []);

  React.useLayoutEffect(function updateUnitSprite()
  {
    const w = Math.floor(containerElement.current.offsetWidth * window.devicePixelRatio);
    const h = Math.floor(containerElement.current.offsetHeight * window.devicePixelRatio);

    renderer.current.resize(w, h);
    containerElement.current.appendChild(renderer.current.view);

    props.unit.drawBattleScene(
    {
      user: props.unit,
      userOffset: {x: 0, y: 0},
      width: w,
      height: h,
      duration: Infinity,
      facingRight: true,
      renderer: renderer.current,
      triggerStart: (unitSpriteContainer) =>
      {
        const stage = new PIXI.Container();
        stage.addChild(unitSpriteContainer);
        renderer.current.render(stage);
      },
      triggerEnd: () => {},
    });

    return function removeUnitSpriteView()
    {
      containerElement.current.removeChild(containerElement.current.firstChild);
    };
  }, [props.unit]);

  return(
    ReactDOMElements.div(
    {
      className: "unit-sprite",
      ref: containerElement,
    })
  );
};

export const UnitSprite: React.FunctionComponentFactory<PropTypes> = React.createFactory(UnitSpriteComponent);
