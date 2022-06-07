import { Snapshot } from "./Snapshot";

export type WeatherProvider = {
    name: string;
    sunrise: string;
    snaps: Snapshot[];
}