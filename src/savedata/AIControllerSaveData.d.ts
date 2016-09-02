import Personality from "../Personality";

interface AIControllerSaveData<TemplateSaveData>
{
  templateType: string;
  personality: Personality;
  
  templateData: TemplateSaveData;
}

export default AIControllerSaveData;
