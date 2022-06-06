package types

// TODO: make immutable? (all private fields, define constructor, getter funcs)

type WeatherSnapshot struct {
	Fog         bool    `json:"fog"`         // if data explicitly indicates that there will be fog
	Time        int64   `json:"time"`        // epoch, start of the Duration
	Temperature float64 `json:"temperature"` // celsius
	WindSpeed   float64 `json:"windSpeed"`   // kph
	Gusts       float64 `json:"gusts"`       // kph
	Pressure    float64 `json:"pressure"`    // millibars
	Humidity    float64 `json:"humidity"`    // %
	DewPoint    float64 `json:"dewPoint"`    // celsius
	CloudCover  float64 `json:"cloudCover"`  // %
	Visibility  float64 `json:"visibility"`  // km
}
