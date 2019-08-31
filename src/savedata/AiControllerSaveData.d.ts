import {Personality} from "../ai/Personality";

export interface AiControllerSaveData<TemplateSaveData>
{
  templateType: string;
  personality: Personality;

  templateData: TemplateSaveData;
}
