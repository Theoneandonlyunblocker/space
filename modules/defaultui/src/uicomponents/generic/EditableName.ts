import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { Name } from "core/src/localization/Name";
import { DefaultWindow } from "../windows/DefaultWindow";
import { localize } from "modules/defaultui/localization/localize";
import { options } from "core/src/app/Options";
import { mergeReactAttributes } from "core/src/generic/utility";
import { Language } from "core/src/localization/Language";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  name: Name;
  usage: keyof Language["renderNameEditor"];
  inputAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
}

const EditableNameComponent: React.FunctionComponent<PropTypes> = props =>
{
  const renderNameEditorFN = options.display.language.renderNameEditor &&
    options.display.language.renderNameEditor[props.usage];

  const [displayedBaseName, setDisplayedBaseName] = React.useState<string>(props.name.baseName);
  const [inputHasFocus, setInputHasFocus] = React.useState<boolean>(false);
  const [detailsWindowIsOpen, setDetailsWindowIsOpen] = React.useState<boolean>(false);
  function toggleDetailsWindow(): void
  {
    if (detailsWindowIsOpen)
    {
      setDetailsWindowIsOpen(false);
    }
    else
    {
      setDetailsWindowIsOpen(true);
    }
  }

  const shouldRenderDetailsToggleButton = renderNameEditorFN && (inputHasFocus || detailsWindowIsOpen);

  const defaultInputAttributes: React.Attributes & React.InputHTMLAttributes<HTMLInputElement> =
  {
    className: "editable-name-input",
    type: "text",
    value: displayedBaseName,
    onChange: e =>
    {
      setDisplayedBaseName(e.target.value);
      props.name.customize(e.target.value);
    },
    onFocus: e =>
    {
      setInputHasFocus(true);
    },
    onBlur: e =>
    {
      setInputHasFocus(false);
    },
  };
  const customInputAttributes = props.inputAttributes || {};
  const inputAttributes = mergeReactAttributes(defaultInputAttributes, customInputAttributes);

  return(
    ReactDOMElements.div(
    {
      className: "editable-name",
    },
      ReactDOMElements.input(inputAttributes),
      !shouldRenderDetailsToggleButton ? null : ReactDOMElements.button(
      {
        className: "editable-name-toggle-details",
        onMouseDown: toggleDetailsWindow,
      }),
      !detailsWindowIsOpen ? null : DefaultWindow(
      {
        title: localize("customizeName").toString(),
        handleClose: () => setDetailsWindowIsOpen(false),
      },
        renderNameEditorFN(
        {
          name: props.name,
          onChange: () =>
          {
            if (props.name.baseName !== displayedBaseName)
            {
              setDisplayedBaseName(props.name.baseName);
            }
          },
        }),
      )
    )
  );
};

export const EditableName: React.FunctionComponentFactory<PropTypes> = React.createFactory(EditableNameComponent);
