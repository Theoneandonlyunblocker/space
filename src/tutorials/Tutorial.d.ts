/// <reference path="../../lib/react-0.13.3.d.ts" />
import {ReactType} from "react";

export declare interface TutorialPage
{
  content: ReactType | ReactType[]; // React component or string or array of these
  onOpen?: () => void;
  onClose?: () => void;
  desiredSize?:
  {
    width: number;
    height: number;
  }
}

declare interface Tutorial
{
  pages: TutorialPage[];
}

export default Tutorial;
