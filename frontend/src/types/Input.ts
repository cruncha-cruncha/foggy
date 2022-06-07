import { WeatherProvider } from "./WeatherProvider"

export type Input = {
    tomorrow: string;
    city: string;
    data: WeatherProvider[];
}