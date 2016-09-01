import Personality from "../Personality";

interface AIControllerSaveData<ObjectSaveData>
{
  templateType: string;
  personality: Personality;
  
  objectData: ObjectSaveData;
}

export default AIControllerSaveData;
