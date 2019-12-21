import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { EditableLanguageSpecificTagSelectData } from "./EditableLanguageSpecificTagData";
import { EnglishName } from "../EnglishName";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  name: EnglishName;
  data: EditableLanguageSpecificTagSelectData<EnglishName>;
  onChange?: () => void;
}

const LanguageSpecificTagSelectComponent: React.FunctionComponent<PropTypes> = props =>
{
  const [displayedValue, setDisplayedValue] = React.useState<string>(props.data.getDisplayedText(props.name));

  return(
    ReactDOMElements.select(
    {
      className: "language-specific-tag-select",
      value: displayedValue,
      onChange: e =>
      {
        const newValue = e.currentTarget.value;
        setDisplayedValue(newValue);
        props.data.onChange(props.name, newValue);
        if (props.onChange)
        {
          props.onChange();
        }
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
