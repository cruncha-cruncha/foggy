import { Graphical } from "../types/Graphical";
import { Snapshot } from "../types/Snapshot";

export const snapshotToGraphical = (snap: Snapshot): Graphical => {
    return {
        time: snap.time,
        fog: snap.fog,
        temperatureDifference: snap.temperature - snap.dewPoint,
        windSpeed: snap.windSpeed,
        gusts: snap.gusts,
        visibility: snap.visibility,
    }
}

export const kphToKnots = (kph: number) => kph * 0.539957;