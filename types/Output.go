package types

import (
	"time"
)

type Output struct {
	Tomorrow time.Time              `json:"tomorrow"`
	City     string                 `json:"city"`
	Data     []ProviderDataResponse `json:"data"`
}
