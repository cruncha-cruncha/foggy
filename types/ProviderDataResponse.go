package types

import (
	"time"
)

type ProviderDataResponse struct {
	Name            string            `json:"name"`
	Snaps           []WeatherSnapshot `json:"snaps"`
	SunriseTomorrow time.Time         `json:"sunrise"`
	Error           error             `json:"-"`
	Ok              bool              `json:"-"`
}
