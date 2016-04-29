import MapGenData from "./MapGenData";

declare interface MapGenDataByStarID
{
  [starID: number]: MapGenData;
}

export default MapGenDataByStarID;
