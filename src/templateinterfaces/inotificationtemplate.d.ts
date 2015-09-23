declare module Rance
{
  module Templates
  {
    interface INotificationTemplate
    {
      key: string;
      iconSrc: string;
      eventListeners: string[];
      contentConstructor: UIComponents.ReactComponentPlaceHolder;
      messageConstructor: (props: any) => string;

      serializeProps: (props: any) => any;
      deserializeProps: (dataProps: any, gameLoader: GameLoader) => any;
    }
  }
}
