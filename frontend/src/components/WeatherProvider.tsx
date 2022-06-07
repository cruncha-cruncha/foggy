import * as React from "react"
import { VictoryBar } from 'victory';
import { WeatherProvider as WeatherType } from '../types/WeatherProvider';

type Props = {
    data: WeatherType
}

export const WeatherProvider = ({ data }: Props) => {

    const snaps = data.snaps;

    const fake_data = [
        { quarter: 1, earnings: 13000 },
        { quarter: 2, earnings: 16500 },
        { quarter: 3, earnings: 14250 },
        { quarter: 4, earnings: 19000 }
    ]

    return (
        <div>
            <p>{data.name}</p>
            <p>Sunrise: {data.sunrise}</p>
            <div className="data">
                <VictoryBar
                    data={fake_data}
                    // data accessor for x values
                    x="quarter"
                    // data accessor for y values
                    y="earnings"
                />
            </div>
        </div>
    )
}