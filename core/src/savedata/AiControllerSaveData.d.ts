import {Personality} from "../ai/Personality";

export interface AiControllerSaveData<TemplateSaveData>
{
  template: string;
  personality: Personality;

  templateData: TemplateSaveData;
}
