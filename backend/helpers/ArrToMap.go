package helpers

import (
	"fmt"
)

func ArrToMap(arr []any) map[string]any {
	out := make(map[string]any)
	for i := range arr {
		out[fmt.Sprint(i)] = arr[i]
	}
	return out
}