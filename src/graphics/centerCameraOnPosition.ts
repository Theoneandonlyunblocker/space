import {Camera} from "./Camera";
import {Point} from "../math/Point";


let activeCamera: Camera | null;
let deferredPositionToCenterOn: Point | null;

export function centerCameraOnPosition(position: Point): void
{
  if (activeCamera)
  {
    activeCamera.centerOnPosition(position.x, position.y);
  }
  else
  {
    deferredPositionToCenterOn = {x: position.x, y: position.y};
  }
}

export function registerActiveCamera(camera: Camera | null): void
{
  activeCamera = camera;

  if (deferredPositionToCenterOn)
  {
    centerCameraOnPosition(deferredPositionToCenterOn);
  }

  deferredPositionToCenterOn = null;
}
