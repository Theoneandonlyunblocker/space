/// <reference path="../mixins/focustimer.ts" />

/// <reference path="colorpicker.ts" />

export interface PropTypes
{
  // TODO refactor | add prop types
}

export default class ColorSetter extends React.Component<PropTypes, {}>
{
  displayName: reactTypeTODO_any = "ColorSetter";
  mixins: reactTypeTODO_any = [FocusTimer];
  getInitialState: function()
  {
    return(
    {
      hexColor: this.props.color || 0xFFFFFF,
      isNull: true,
      active: false
    });
  }

  componentWillUnmount: function()
  {
    document.removeEventListener("click", this.handleClick);
    this.clearFocusTimerListener();
  }

  componentWillReceiveProps: function(newProps: any)
  {
    if (newProps.color !== this.state.hexColor)
    {
      this.setState(
      {
        hexColor: newProps.color,
        isNull: newProps.color === null
      });
    }
  }

  handleClick: function(e: MouseEvent)
  {
    var focusGraceTime = 500;
    if (Date.now() - this.lastFocusTime <= focusGraceTime) return;

    var node = this.refs.main.getDOMNode();
    if (e.target === node || node.contains(e.target))
    {
      return;
    }
    else
    {
      this.setAsInactive();
    }
  }

  toggleActive: function()
  {
    if (this.state.isActive)
    {
      this.setAsInactive();
    }
    else
    {
      if (this.props.setActiveColorPicker)
      {
        this.props.setActiveColorPicker(this);
      }
      this.setState({isActive: true});
      document.addEventListener("click", this.handleClick, false);
      this.registerFocusTimerListener();
    }
  }
  setAsInactive: function()
  {
    if (this.isMounted() && this.state.isActive)
    {
      this.setState({isActive: false});
      document.removeEventListener("click", this.handleClick);
      this.clearFocusTimerListener();
    }
  }
  updateColor: function(hexColor: number, isNull: boolean)
  {
    if (isNull)
    {
      this.setState({isNull: isNull});
    }
    else
    {
      this.setState({hexColor: hexColor, isNull: isNull});
    }

    if (this.props.onChange)
    {
      this.props.onChange(hexColor, isNull);
    }
  }

  getClientRect: function()
  {
    return this.getDOMNode().firstChild.getBoundingClientRect();
  }

  render: function()
  {
    var displayElement = this.state.isNull ?
      React.DOM.img(
      {
        className: "color-setter-display",
        src: "img\/icons\/nullcolor.png",
        onClick: this.toggleActive
      }) :
      React.DOM.div(
      {
        className: "color-setter-display",
        style:
        {
          backgroundColor: "#" + hexToString(this.state.hexColor)
        },
        onClick: this.toggleActive
      });

    return(
      React.DOM.div({className: "color-setter", ref: "main"},
        displayElement,
        this.props.isActive || this.state.isActive ?
          UIComponents.ColorPicker(
          {
            hexColor: this.state.hexColor,
            generateColor: this.props.generateColor,
            onChange: this.updateColor,
            setAsInactive: this.setAsInactive,
            flagHasCustomImage: this.props.flagHasCustomImage,
            getParentPosition: this.getClientRect
          }) : null
      )
    );
  }
}
