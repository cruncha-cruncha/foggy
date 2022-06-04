package main

import (
	"encoding/json"
	"foggy/constants"
	"foggy/providers"
	"foggy/types"
	"io/ioutil"
	"time"
)

const FILE_PATH = "output.json"

const CITY = "Ottawa"

func main() {
	providerList := []types.WeatherProvider{
		new(providers.WeatherApi),
	}

	data := make([]types.ProviderDataResponse, len(providerList))
	for i := range providerList {
		data[i] = providerList[i].GetTomorrowMorningData()
	}

	writeToFile(data)
}

func writeToFile(data []types.ProviderDataResponse) error {
	output := types.Output{
		Tomorrow:  getTomorrow(),
		City: constants.City,
		Data: data,
	}

	file, err := json.MarshalIndent(output, "", "  ")
	if err != nil {
		return err
	}

	return ioutil.WriteFile(FILE_PATH, file, 0644)
}

func getTomorrow() time.Time {
	return time.Now().AddDate(0, 0, 1)
}
