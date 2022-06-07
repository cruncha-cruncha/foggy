import * as React from "react"
import input from '../../content/weather.json';
import { WeatherProvider } from "../components/WeatherProvider";

const Testing = () => {

    // TODO: use Dayjs

    return (
        <div>
            <div className="pre-amble">
                <h1>Weather for {input.city}</h1>
                <p>{input.tomorrow}</p>
            </div>
            <div className="content">
                {input.data.map((d) => {
                    return (
                        <WeatherProvider key={d.name} data={d} />
                    )
                })}
            </div>
        </div>
    )
}

export default Testing;