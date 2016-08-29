import Personality from "../Personality";

interface AIControllerSaveData<ObjectSaveData>
{
  templateType: string;
  objectData: ObjectSaveData;
  personality: Personality;
}

export default AIControllerSaveData;
