/// <reference path="../../../lib/react-global.d.ts" />

import {RaceTemplate} from "../../templateinterfaces/RaceTemplate";

interface PropTypes extends React.Props<any>
{
  availableRaces: RaceTemplate[];
  selectedRace: RaceTemplate;
  changeRace: (race: RaceTemplate) => void;
}

interface StateType
{
}

export class RacePickerComponent extends React.PureComponent<PropTypes, StateType>
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
    const newRace = this.props.availableRaces.filter(raceTemplate =>
    {
      return raceTemplate.type === target.value;
    })[0];

    this.props.changeRace(newRace);
  }

  render()
  {
    return(
      React.DOM.select(
      {
        className: "race-picker",
        value: this.props.selectedRace.type,
        onChange: this.handleChangeRace,
        title: this.props.selectedRace.description,
      },
        this.props.availableRaces.map(race =>
        {
          return React.DOM.option(
          {
            key: race.type,
            value: race.type,
            title: race.description,
          },
            race.displayName.toString(),
          )
        }),
      )
    );
  }
}

const Factory: React.Factory<PropTypes> = React.createFactory(RacePickerComponent);
export default Factory;
