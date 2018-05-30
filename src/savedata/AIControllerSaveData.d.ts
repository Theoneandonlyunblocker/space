import Personality from "../Personality";

interface AiControllerSaveData<TemplateSaveData>
{
  templateType: string;
  personality: Personality;

  templateData: TemplateSaveData;
}

export default AiControllerSaveData;
