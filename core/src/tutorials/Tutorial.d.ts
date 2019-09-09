import * as React from "react";

export interface TutorialPage
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

export interface Tutorial
{
  pages: TutorialPage[];
}
