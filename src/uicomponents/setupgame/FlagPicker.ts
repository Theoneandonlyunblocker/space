/// <reference path="../../../lib/react-global.d.ts" />

import
{
  AutoPositionerProps,
  default as AutoPositioner
} from "../mixins/AutoPositioner";
import applyMixins from "../mixins/applyMixins";
import EmblemPicker from "./EmblemPicker";

import SubEmblemTemplate from "../../templateinterfaces/SubEmblemTemplate";

import Color from "../../Color";
import Emblem from "../../Emblem";

export interface PropTypes extends React.Props<any>
{
  handleSelectEmblem: (selectedEmblemTemplate: SubEmblemTemplate | null, color: Color) => void;
  triggerParentUpdate: () => void;
  uploadFiles: (files: FileList) => void;
  failMessage: React.ReactElement<any>;
  customImageFileName: string | null;

  emblemData:
  {
    emblem: Emblem | null;
    template: SubEmblemTemplate | null;
    color: Color | null;
  }[];
  mainColor: Color | null;

  autoPositionerProps?: AutoPositionerProps;
}

interface StateType
{
}

export class FlagPickerComponent extends React.PureComponent<PropTypes, StateType>
{
  displayName: string = "FlagPicker";
  state: StateType;
  imageUploader: HTMLInputElement;

  constructor(props: PropTypes)
  {
    super(props);

    if (this.props.autoPositionerProps)
    {
      applyMixins(this, new AutoPositioner(this));
    }

    this.bindMethods();
  }
  private bindMethods()
  {
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentWillReceiveProps(newProps: PropTypes): void
  {
    if (this.props.customImageFileName && !newProps.customImageFileName)
    {
      this.clearImageUploader();
    }
  }

  handleUpload(e: React.FormEvent)
  {
    const imageUploader = <HTMLInputElement> e.target;

    this.props.uploadFiles(imageUploader.files);
  }
  private clearImageUploader(): void
  {
    this.imageUploader.value = "";
  }

  render()
  {
    var imageInfoMessage: React.ReactElement<any>;
    if (this.props.failMessage)
    {
      imageInfoMessage = this.props.failMessage;
    }
    else
    {
      imageInfoMessage = React.DOM.div({className: "image-info-message"},
        "Upload or drag image here to set it as your flag"
      );
    }

    return(
      React.DOM.div(
      {
        className: "flag-picker"
      },
        React.DOM.div(
        {
          className: "flag-image-uploader"
        },
          React.DOM.div({className: "flag-picker-title"},
            "Upload image"
          ),
          React.DOM.div(
          {
            className: "flag-image-uploader-content"
          },
            React.DOM.input(
            {
              className: "flag-image-upload-button",
              type: "file",
              accept: "image/*",
              onChange: this.handleUpload,
              ref: (element: HTMLInputElement) =>
              {
                this.imageUploader = element;
              }
            }),
            imageInfoMessage
          )
        ),
        this.props.emblemData.map((emblemData, i) =>
        {
          return EmblemPicker(
          {
            key: i,
            backgroundColor: this.props.mainColor,
            color: emblemData.color,
            selectedEmblemTemplate: emblemData.template,

            setEmblemTemplate: this.props.handleSelectEmblem,
            setEmblemColor: (color) =>
            {
              emblemData.emblem.colors = [color];
              this.props.triggerParentUpdate();
            }
          });
        })
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(FlagPickerComponent);
export default Factory;
