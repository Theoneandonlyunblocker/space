import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { ProbabilityDistributions, ProbabilityItems, FlatProbabilityDistribution, WeightedProbabilityDistribution } from "core/src/templateinterfaces/ProbabilityDistribution";
import { probabilityDistributionsAreWeighted, probabilityItemsAreTerminal, flatten2dArray } from "core/src/generic/utility";


// tslint:disable-next-line:no-any
export interface PropTypes<T> extends React.Props<any>
{
  distributions: ProbabilityDistributions<T>;
  renderListItem: (item: T) => React.ReactElement<any>;
  sortListItems: (a: T, b: T) => number;
}

const ProbabilityDistributionsListComponent = <T>(props: PropTypes<T>) =>
{
  function renderTerminalItems(items: T[]): React.ReactNode
  {
    return ReactDOMElements.ol(
    {
      className: "probability-distribution-items terminal-probability-distribution-items",
    },
      items.sort(props.sortListItems).map(item => props.renderListItem(item)),
    );
  }
  function renderFlatProbabilityItems(items: FlatProbabilityDistribution<T>[]): React.ReactNode
  {
    const guaranteedItems: (FlatProbabilityDistribution<T> | WeightedProbabilityDistribution<T>)[] = [];
    const probabilityItems: FlatProbabilityDistribution<T>[] = [];

    items.forEach(item =>
    {
      if (item.flatProbability >= 1)
      {
        guaranteedItems.push(item);
      }
      else
      {
        probabilityItems.push(item);
      }
    })

    return ReactDOMElements.div(
    {
      className: "probability-distribution-items flat-probability-distribution-items",
    },
      guaranteedItems.map(item =>
      {
        return renderProbabilityItems(item.probabilityItems);
      }),
      probabilityItems.sort((a, b) => b.flatProbability - a.flatProbability).map(item =>
      {
        return ReactDOMElements.div(
        {
          className: "probability-distribution-item flat-probability-distribution-item",
        },
          ReactDOMElements.div(
          {
            className: "probability-distribution-content flat-probability-distribution-content",
          },
            renderProbabilityItems(item.probabilityItems),
          ),
          ReactDOMElements.div(
          {
            className: "probability-distribution-item-chance flat-probability-distribution-item-chance",
          },
            `${Math.round(item.flatProbability * 100)}%`,
          ),
        );
      }),
    );
  }
  function renderWeightedProbabilityItems(items: WeightedProbabilityDistribution<T>[]): React.ReactNode
  {
    const totalWeight = items.map(item => item.weight).reduce((total, current) => total + current, 0);

    const sortedItems = items.sort((a, b) => a.weight - b.weight);
    const contentAndChanceElementPairs = sortedItems.map(item =>
    {
      const relativeWeight = item.weight / totalWeight;

      return [
        ReactDOMElements.div(
        {
          className: "probability-distribution-content weighted-probability-distribution-content",
        },
          renderProbabilityItems(item.probabilityItems),
        ),
        ReactDOMElements.div(
        {
          className: "probability-distribution-item-chance weighted-probability-distribution-item-chance",
        },
          `${Math.round(relativeWeight * 100)}%`,
        ),
      ];
    });
    const allElements = flatten2dArray(contentAndChanceElementPairs);

    return ReactDOMElements.div(
    {
      className: "weighted-probability-distributions",
    },
      ReactDOMElements.div(
      {
        className: "probability-distribution-items weighted-probability-distribution-items",
        style:
        {
          gridTemplateRows: `repeat(${items.length * 2}, auto)`
        }
      },
        allElements,
      ),
    );
  }

  function renderProbabilityItems(items: ProbabilityItems<T>): React.ReactNode
  {
    if (probabilityItemsAreTerminal(items))
    {
      return renderTerminalItems(items);
    }
    else if (probabilityDistributionsAreWeighted(items))
    {
      return renderWeightedProbabilityItems(items);
    }
    else
    {
      return renderFlatProbabilityItems(items);
    }
  }

  return(
    ReactDOMElements.div(
    {
      className: "probability-distributions-list",
    },
      renderProbabilityItems(props.distributions),
    )
  );
};

export function ProbabilityDistributionsList<T>(props?: React.Attributes & PropTypes<T>, ...children: React.ReactNode[]): React.ReactElement<PropTypes<T>>
{
  return React.createElement(ProbabilityDistributionsListComponent, props, ...children);
}
