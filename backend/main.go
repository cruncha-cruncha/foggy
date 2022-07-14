package main

import (
	"fmt"
	"encoding/json"
	"foggy/providers"
	"foggy/types"
	"io/ioutil"
	"os"
	"time"
)

const FILE_PATH = "output.json"

func main() {
	providerList := []types.WeatherProvider{
		new(providers.WeatherApi),
	}

	data := make([]types.ProviderDataResponse, len(providerList))
	for i := range providerList {
		data[i] = providerList[i].GetTomorrowMorningData()
	}

	err := writeToFile(data)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func writeToFile(data []types.ProviderDataResponse) error {
	output := types.Output{
		Tomorrow:  getTomorrow(),
		City: os.Getenv("CITY"),
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
