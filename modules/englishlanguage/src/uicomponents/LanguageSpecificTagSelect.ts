import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { EditableLanguageSpecificTagSelectData } from "./EditableLanguageSpecificTagData";
import { EnglishName } from "../EnglishName";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  name: EnglishName;
  data: EditableLanguageSpecificTagSelectData<EnglishName>;
}

const LanguageSpecificTagSelectComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.select(
    {
      className: "language-specific-tag-select",
      value: props.data.getDisplayedText(props.name),
      onChange: e =>
      {
        const newValue = e.currentTarget.value;
        props.data.onChange(props.name, newValue);
      },
    },
      props.data.choices.map(choice => ReactDOMElements.option(
      {
        className: "language-specific-tag-select-option",
        key: choice.displayedText,
        value: choice.displayedText,
      },
        choice.displayedText,
      )),
    )
  );
};

export const LanguageSpecificTagSelect: React.FunctionComponentFactory<PropTypes> = React.createFactory(LanguageSpecificTagSelectComponent);
