/// <reference path="buildqueueitem.ts" />

/// <reference path="../../manufactory.ts" />

module Rance
{
  export module UIComponents
  {
    export var BuildQueue = React.createClass(
    {
      displayName: "BuildQueue",

      propTypes:
      {
        manufactory: React.PropTypes.instanceOf(Manufactory).isRequired
      },

      render: function()
      {
        var manufactory: Manufactory = this.props.manufactory;
        var buildQueue = manufactory.buildQueue;

        var buildQueueItems: ReactComponentPlaceHolder[] = [];
        var keyByTemplateType:
        {
          [templateType: string]: number;
        } = {};

        for (var i = 0; i < buildQueue.length; i++)
        {
          if (!keyByTemplateType[buildQueue[i].template.type])
          {
            keyByTemplateType[buildQueue[i].template.type] = 0;
          }

          buildQueueItems.push(UIComponents.BuildQueueItem(
          {
            type: buildQueue[i].type,
            template: buildQueue[i].template,
            key: keyByTemplateType[buildQueue[i].template.type]++
          }));
        }

        return(
          React.DOM.div(
          {
            className: "build-queue"
          },
            React.DOM.div(
            {
              className: "build-queue-header"
            },
              "Build queue"
            ),
            React.DOM.ol(
            {
              className: "build-queue-items"
            },
              buildQueueItems
            )
          )
        );
      }
    })
  }
}
