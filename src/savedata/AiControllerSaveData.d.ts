import {Personality} from "../Personality";

export interface AiControllerSaveData<TemplateSaveData>
{
  templateType: string;
  personality: Personality;

  templateData: TemplateSaveData;
}
