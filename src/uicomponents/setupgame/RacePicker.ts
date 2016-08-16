/// <reference path="../../../lib/react-global.d.ts" />

import RaceTemplate from "../../templateinterfaces/RaceTemplate";
import TemplateCollection from "../../templateinterfaces/TemplateCollection";

interface PropTypes extends React.Props<any>
{
  availableRaces: TemplateCollection<RaceTemplate>;
  selectedRace: RaceTemplate;
  changeRace: (race: RaceTemplate) => void;
}

interface StateType
{
}

export class RacePickerComponent extends React.Component<PropTypes, StateType>
{
  displayName = "RacePicker";
  state: StateType;
  
  constructor(props: PropTypes)
  {
    super(props);

    this.handleChangeRace = this.handleChangeRace.bind(this);
  }

  handleChangeRace(e: React.FormEvent)
  {
    const target = <HTMLInputElement> e.target;
    const newRace = this.props.availableRaces[target.value];

    this.props.changeRace(newRace);
  }
  
  render()
  {
    const raceTemplateOptions: React.ReactHTMLElement<any>[] = [];

    for (let key in this.props.availableRaces)
    {
      const race = this.props.availableRaces[key];

      raceTemplateOptions.push(React.DOM.option(
      {
        value: race.key,
        key: race.key,
        title: race.description
      },
        race.displayName
      ))
    }
    
    return(
      React.DOM.select(
      {
        className: "race-picker",
        value: this.props.selectedRace.key,
        onChange: this.handleChangeRace,
        title: this.props.selectedRace.description
      },
        raceTemplateOptions
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(RacePickerComponent);
export default Factory;
