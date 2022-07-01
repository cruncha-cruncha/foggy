package providers

import (
	"fmt"
	"os"
	"net/http"
	"strings"
	"time"
	"strconv"
	"regexp"
	"foggy/helpers"
	"foggy/types"
	"foggy/constants"
)

type WeatherApi struct {}

func (api WeatherApi) GetName() string {
	return "WeatherApi"
}

func (api WeatherApi) GetTomorrowMorningData() types.ProviderDataResponse {
	url := getUrl()

	resp, err := http.Get(url)
	if err != nil {
		return types.ProviderDataResponse{
			Ok: false,
			Error: err,
		}
	}

	data, err := helpers.ReadToMap(resp.Body)
	if err != nil {
		return types.ProviderDataResponse{
			Ok: false,
			Error: err,
		}
	}

	tomorrow := helpers.GetVal(data, []string{"forecast", "forecastday", "1"}, make(map[string]any))

	return types.ProviderDataResponse{
		Ok: true,
		SunriseTomorrow: parseSunriseTomorrow(tomorrow),
		Snaps: parseSnaps(tomorrow),
		Name: api.GetName(),
	}
}

func getUrl() string {
	return "" +
		"https://api.weatherapi.com/v1/forecast.json?key=" +
		os.Getenv("WEATHER_API_KEY") + 
		"&q=" + 
		os.Getenv("WEATHER_API_LOCATION") + 
		"&days=2&aqi=no&alerts=no"
}

func parseSunriseTomorrow(tomorrow map[string]any) time.Time {
	_, offset := time.Now().Zone()
	epochTomorrow := helpers.GetVal(tomorrow, []string{"date_epoch"}, 0.0) + 1
	timeTomorrow := time.Unix(int64(epochTomorrow - float64(offset)), 0)

	sunriseTomorrow := helpers.GetVal(tomorrow, []string{"astro", "sunrise"}, "00:00")

	r := regexp.MustCompile("(?P<hour>[0-9][0-9]):(?P<minute>[0-9][0-9])")
	matches := r.FindStringSubmatch(sunriseTomorrow)

	sunriseHour := 0
	sunriseMinute := 0

	if len(matches) == 3 {
		var err error
		sunriseHour, err = strconv.Atoi(matches[1])
		if err != nil {
			sunriseHour = 0
		}

		sunriseMinute, err = strconv.Atoi(matches[2])
		if err != nil {
			sunriseMinute = 0
		}
	}

	return time.Date(
		timeTomorrow.Year(),
		timeTomorrow.Month(),
		timeTomorrow.Day(),
		sunriseHour,
		sunriseMinute,
		0,
		0,
		timeTomorrow.Location())
}

func parseSnaps(tomorrow map[string]any) []types.WeatherSnapshot {
	lower := constants.StartHour
	upper := constants.EndHour

	snaps := make([]types.WeatherSnapshot, upper - lower)

	for i := lower; i < upper; i += 1 {
		hour := helpers.GetVal(tomorrow, []string{"hour", fmt.Sprint(i)}, make(map[string]any))
		snaps[i] = makeSnapshot(hour)
	}

	return snaps
}

func makeSnapshot(hour map[string]any) types.WeatherSnapshot {
	time := int64(helpers.GetVal(hour, []string{"time_epoch"}, 0.0))

	// https://www.weatherapi.com/docs/weather_conditions.json
	conditions := strings.ToLower(helpers.GetVal(hour, []string{"condition", "text"}, "<unknown>"))
	fog := strings.Contains(conditions, "fog") || strings.Contains(conditions, "mist")

	temperature := helpers.GetVal(hour, []string{"temp_f"}, -99.0)
	temperature = helpers.FahrenheitToCelsius(temperature)

	windSpeed := helpers.GetVal(hour, []string{"wind_kph"}, -1.0)

	gusts := helpers.GetVal(hour, []string{"gust_kph"}, -1.0)

	pressure := helpers.GetVal(hour, []string{"pressure_mb"}, -1.0)

	humidity := helpers.GetVal(hour, []string{"humidity"}, -1.0)

	dewPoint := helpers.GetVal(hour, []string{"dewpoint_f"}, 0.0)
	dewPoint = helpers.FahrenheitToCelsius(dewPoint)

	cloudCover := helpers.GetVal(hour, []string{"cloud"}, -1.0)

	visibility := helpers.GetVal(hour, []string{"vis_km"}, -1.0)

	return types.WeatherSnapshot{
		Fog: fog,
		Time: time,
		Temperature: temperature,
		WindSpeed: windSpeed,
		Gusts: gusts,
		Pressure: pressure,
		Humidity: humidity,
		DewPoint: dewPoint,
		CloudCover: cloudCover,
		Visibility: visibility,
	}
}