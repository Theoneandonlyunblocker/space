import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";
import { EnglishName } from "../EnglishName";
import { LanguageSpecificTagInput } from "./LanguageSpecificTagInput";
import { englishNameTagsData } from "./englishNameTagsData";
import { LanguageSpecificTagSelect } from "./LanguageSpecificTagSelect";


// tslint:disable-next-line:no-any
export interface PropTypes extends React.Props<any>
{
  name: EnglishName;
  onChange?: () => void;
}

const EnglishPlayerNameEditorComponent: React.FunctionComponent<PropTypes> = props =>
{
  return(
    ReactDOMElements.div(
    {
      className: "english-player-name-editor",
    },
      LanguageSpecificTagInput(
      {
        name: props.name,
        data: englishNameTagsData.baseName,
        onChange: props.onChange,
      }),
      " ",
      LanguageSpecificTagSelect(
      {
        name: props.name,
        data: englishNameTagsData.isPlural,
        onChange: props.onChange,
      }),
      " attacked, but ",
      LanguageSpecificTagInput(
      {
        name: props.name,
        data: englishNameTagsData.thirdPersonPronoun,
        onChange: props.onChange,
      }),
      " defended succesfully.",
    )
  );
};

export const EnglishPlayerNameEditor: React.FunctionComponentFactory<PropTypes> = React.createFactory(EnglishPlayerNameEditorComponent);
