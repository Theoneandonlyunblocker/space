import * as React from "react";
import * as ReactDOMElements from "react-dom-factories";

import {RaceTemplate} from "core/src/templateinterfaces/RaceTemplate";


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
  public override state: StateType;

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
      return raceTemplate.key === target.value;
    })[0];

    this.props.changeRace(newRace);
  }

  public override render()
  {
    return(
      ReactDOMElements.select(
      {
        className: "race-picker",
        value: this.props.selectedRace.key,
        onChange: this.handleChangeRace,
        title: this.props.selectedRace.description,
      },
        this.props.availableRaces.map(race =>
        {
          return ReactDOMElements.option(
          {
            key: race.key,
            value: race.key,
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
