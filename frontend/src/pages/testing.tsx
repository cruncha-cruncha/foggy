import * as React from "react";
import dayjs from "dayjs";
import input from '../../content/weather.json';
import { WeatherProvider } from "../components/WeatherProvider";
import { validateInputData } from "../logic/validateInputData";

const Testing = () => {

    const inputData = validateInputData(input);

    return (
        <div>
            {inputData && (<>
                <div className="pre-amble">
                    <h1>Weather for {inputData.city}</h1>
                    <p>{formatTomorrow(inputData.tomorrow)}</p>
                </div>
                <div className="content">
                    {inputData.data.map((datum) => {
                        return (
                            <WeatherProvider key={datum.name} data={datum} tomorrow={inputData.tomorrow} />
                        )
                    })}
                </div>
            </>)}
            {!inputData && (
                <p>nope</p>
            )}
        </div>
    )
}

export default Testing;

const formatTomorrow = (tomorrow: string) => {
    return dayjs(tomorrow).format("YYYY-MM(MMMM)-DD");
}

