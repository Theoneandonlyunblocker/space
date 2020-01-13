import * as React from "react";
import { activeModuleData } from "core/src/app/activeModuleData";
import { ResourceTemplate } from "core/src/templateinterfaces/ResourceTemplate";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  resourceTypes: string[];
  renderResource: (resource: ResourceTemplate) => React.ReactElement<any>;
}

const ResourceListComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    React.createElement(React.Fragment, null,
      props.resourceTypes.map(resourceType =>
      {
        const resourceTemplate = activeModuleData.templates.resources[resourceType];
        if (!resourceTemplate)
        {
          throw new Error(`Tried to display resource with key '${resourceType}', but resource was not included in active game modules.`);
        }

        return resourceTemplate;
      }).sort((a, b) =>
      {
        const displayOrderSort = a.displayOrder - b.displayOrder;
        if (displayOrderSort)
        {
          return displayOrderSort;
        }

        const displayNameSort = a.displayName.localeCompare(b.displayName);

        return displayNameSort;
      }).map(resource =>
      {
        return props.renderResource(resource);
      })
    )
  );
};

export const ResourceList: React.FunctionComponentFactory<PropTypes> = React.createFactory(ResourceListComponent);
