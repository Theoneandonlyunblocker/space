import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {RaceTemplate} from "src/templateinterfaces/RaceTemplate";


export interface PropTypes extends React.Props<any>
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
  public displayName = "RacePicker";
  public state: StateType;

  constructor(props: PropTypes)
  {
    super(props);

    this.handleChangeRace = this.handleChangeRace.bind(this);
  }

  handleChangeRace(e: React.FormEvent<HTMLSelectElement>)
  {
    const target = e.currentTarget;
    const newRace = this.props.availableRaces.filter(raceTemplate =>
    {
      return raceTemplate.type === target.value;
    })[0];

    this.props.changeRace(newRace);
  }

  render()
  {
    return(
      ReactDOMElements.select(
      {
        className: "race-picker",
        value: this.props.selectedRace.type,
        onChange: this.handleChangeRace,
        title: this.props.selectedRace.description,
      },
        this.props.availableRaces.map(race =>
        {
          return ReactDOMElements.option(
          {
            key: race.type,
            value: race.type,
            title: race.description,
          },
            race.displayName.toString(),
          );
        }),
      )
    );
  }
}

export const RacePicker: React.Factory<PropTypes> = React.createFactory(RacePickerComponent);
