
// Gatsby will still compile with typescript errors, so do some validation?
// https://stackoverflow.com/questions/62854637/how-to-check-type-of-a-json-object-against-typescript-interface-in-react
// https://engineering.udacity.com/why-you-should-be-doing-schema-validation-in-react-projects-ce3c4b1df02f
// definitely go with ajv
// YES, skip Gatsby's GraphQL, go with ajv

export type Snapshot = {
    time: number;

    // all snapshots are:
    // - one hour in duration
    // - starting on the hours

    // start at midnight
    // end at ten AM

    // x-axis is always time

    // have buttons for different sources
    // sticky to bottom of screen

    // display as 0 or 1, fixed font size lol
    fog: boolean;

    // take difference (always temperature - dewpoint)
    // display bar graph with maximum of 5 celsius
    // looking for difference below 3 degrees
    // y-axis ticks: 5, 3, 0
    temperature: number; // temperature
    dewPoint: number; // temperature

    // display in knots,
    // above 10 -> fog will dissipate
    // 5-10 -> dense fog
    // below 5 -> light fog
    // so display with max 15 knots
    // windspeed bargraph
    // on same graph, scatter plot (with diamond-shaped points) for gusts
    // y-axis ticks: 15, 10, 5, 0
    windSpeed: number; // kph
    gusts: number; // kph

    // display in bargraph with max 5km
    // y-axis ticks: 5, 2, 0
    visibility: number; // km

    // ignore
    humidity: number; // %
    cloudCover: number; // %
    pressure: number; // mb???
}