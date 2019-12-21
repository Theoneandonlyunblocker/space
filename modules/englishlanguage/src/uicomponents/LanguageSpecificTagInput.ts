import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { EnglishName } from "../EnglishName";
import { EditableLanguageSpecificTagInputData } from "./EditableLanguageSpecificTagData";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  name: EnglishName;
  data: EditableLanguageSpecificTagInputData<EnglishName>;
  onChange?: () => void;
}

const LanguageSpecificTagInputComponent: React.FunctionComponent<PropTypes> = props =>
{
  const [displayedText, setDisplayedText] = React.useState<string>(props.data.getDisplayedText(props.name));

  return(
    ReactDOMElements.input(
    {
      className: "language-specific-tag-input",
      title: props.data.description,
      value: displayedText,
      size: displayedText.length || 1,
      onChange: e =>
      {
        const value = e.currentTarget.value;
        setDisplayedText(value);
        props.data.onChange(props.name, value);
        if (props.onChange)
        {
          props.onChange();
        }
      },
    })
  );
};

export const LanguageSpecificTagInput: React.FunctionComponentFactory<PropTypes> = React.createFactory(LanguageSpecificTagInputComponent);
