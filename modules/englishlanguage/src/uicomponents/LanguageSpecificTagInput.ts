import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { EnglishName } from "../EnglishName";
import { EditableLanguageSpecificTagInputData } from "./EditableLanguageSpecificTagData";


// TODO 2019.12.21 | this & select need to pass more stuff as props so updates are triggered reactively
// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  name: EnglishName;
  data: EditableLanguageSpecificTagInputData<EnglishName>;
}

const LanguageSpecificTagInputComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.input(
    {
      className: "language-specific-tag-input",
      value: props.data.getDisplayedText(props.name),
      onChange: e =>
      {
        const value = e.currentTarget.value;
        props.data.onChange(props.name, value);
      },
    })
  );
};

export const LanguageSpecificTagInput: React.FunctionComponentFactory<PropTypes> = React.createFactory(LanguageSpecificTagInputComponent);
