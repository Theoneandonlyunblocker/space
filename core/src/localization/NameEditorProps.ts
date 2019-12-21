import { Name } from "./Name";


export interface NameEditorProps<N extends Name = Name>
{
  name: N;
  onChange?: () => void;
}
