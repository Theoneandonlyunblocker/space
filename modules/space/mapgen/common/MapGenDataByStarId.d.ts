import MapGenData from "./MapGenData";

declare interface MapGenDataByStarId
{
  [starId: number]: MapGenData;
}

export default MapGenDataByStarId;
