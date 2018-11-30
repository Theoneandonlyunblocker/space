import * as React from "react";

export declare interface TutorialPage
{
  content: React.ReactNode | React.ReactNode[];
  onOpen?: () => void;
  onClose?: () => void;
  desiredSize?:
  {
    width: number;
    height: number;
  };
}

declare interface Tutorial
{
  pages: TutorialPage[];
}

export default Tutorial;
