/// <reference path="../../../lib/react-global.d.ts" />


import OptionsGroup from "../galaxymap/OptionsGroup";
import NotificationFilterListItem from "./NotificationFilterListItem";
import NotificationFilter from "../../NotificationFilter";
import eventManager from "../../eventManager";


export interface PropTypes extends React.Props<any>
{
  filter: NotificationFilter;
  highlightedOptionKey?: string;
}

interface StateType
{
}

export class NotificationFilterListComponent extends React.Component<PropTypes, StateType>
{
  displayName: string = "NotificationFilterList";
  state: StateType;
  ref_TODO_body: HTMLElement;

  constructor(props: PropTypes)
  {
    super(props);
    
    this.bindMethods();
  }
  private bindMethods()
  {
    this.scrollToHighlighted = this.scrollToHighlighted.bind(this);
    this.handleResetCategory = this.handleResetCategory.bind(this);    
  }
  
  private handleResetCategory(category: string): void
  {
    var filter = this.props.filter;
    filter.setDefaultFilterStatesForCategory(category);
    filter.save();
    this.forceUpdate();
    eventManager.dispatchEvent("updateNotificationLog");
  }
  public scrollToHighlighted(): void
  {
    if (this.props.highlightedOptionKey)
    {
      var bodyNode = <HTMLElement> ReactDOM.findDOMNode(this.ref_TODO_body);
      var highlightedNode = <HTMLElement> bodyNode.getElementsByClassName("highlighted")[0];
      bodyNode.scrollTop = highlightedNode.offsetTop - bodyNode.offsetHeight / 3;
    }
  }
  public parentPopupDidMount(): void
  {
    this.scrollToHighlighted();
  }

  render()
  {
    var filter = this.props.filter;

    var filtersByCategory = filter.getFiltersByCategory();
    var filterGroupElements: React.ReactElement<any>[] = [];

    for (let category in filtersByCategory)
    {
      var filtersForCategory = filtersByCategory[category];
      var filterElementsForCategory:
      {
        key: string;
        content: React.ReactElement<any>;
      }[] = [];
      for (let i = 0; i < filtersForCategory.length; i++)
      {
        var notificationTemplate = filtersForCategory[i].notificationTemplate
        var isHighlighted = Boolean(this.props.highlightedOptionKey &&
          this.props.highlightedOptionKey === notificationTemplate.key);

        filterElementsForCategory.push(
        {
          key: notificationTemplate.key,
          content: NotificationFilterListItem(
          {
            displayName: notificationTemplate.displayName,
            filter: filter,
            filterState: filtersForCategory[i].filterState,
            keyTODO: notificationTemplate.key,
            isHighlighted: isHighlighted
          })
        });
      }
      filterGroupElements.push(OptionsGroup(
      {
        header: category,
        options: filterElementsForCategory,
        key: category,
        resetFN: this.handleResetCategory.bind(this, category)
      }));
    }

    return(
      React.DOM.div(
      {
        className: "notification-filter-list"
      },
        React.DOM.div(
        {
          className: "notification-filter-list-header"
        },
          React.DOM.div(
          {
            className: "notification-filter-list-item-label"
          },
            "Show"
          ),
          React.DOM.div(
          {
            className: "notification-filter-list-item-filters"
          },
            "Always",
            "Involved",
            "Never"
          )
        ),
        React.DOM.div(
        {
          className: "notification-filter-list-body",
          ref: (component: HTMLElement) =>
          {
            this.ref_TODO_body = component;
          }
        },
          filterGroupElements
        )
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(NotificationFilterListComponent);
export default Factory;
