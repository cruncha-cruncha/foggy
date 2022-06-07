import * as React from "react";
import Ajv from "ajv";
import input from '../../content/weather.json';
import snapshotSchema from '../../schemas/Snapshot.json';
import providerSchema from '../../schemas/WeatherProvider.json';
import inputSchema from '../../schemas/Input.json';
import { WeatherProvider } from "../components/WeatherProvider";

const Testing = () => {

    const ajv = new Ajv()

    ajv.addSchema(snapshotSchema);
    ajv.addSchema(providerSchema);
    const validate = ajv.compile(inputSchema);

    console.log("VALID", validate(input), validate.errors);

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