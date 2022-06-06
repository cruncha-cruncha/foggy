package types

type WeatherProvider interface {
	GetName() string
	GetTomorrowMorningData() ProviderDataResponse
}