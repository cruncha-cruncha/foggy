export type Graphical = {
    time: number;

    fog: boolean;

    temperatureDifference: number; // between temperature and dewPoint

    windSpeed: number; // knots
    gusts: number; // knots

    visibility: number;
}