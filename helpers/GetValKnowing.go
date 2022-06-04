package helpers

func GetValKnowing[T any](data map[string]any, path []string, defaultVal T) (T, bool) {
	if len(path) <= 0 {
		return defaultVal, false
	}

	if val, found := data[path[0]]; found {
		if len(path) > 1 {
			if subData, ok := val.(map[string]any); ok {
				return GetValKnowing(subData, path[1:], defaultVal)
			} else if subData, ok := val.([]any); ok {
				return GetValKnowing(ArrToMap(subData), path[1:], defaultVal)
			}
		} else {
			if typedVal, ok := val.(T); ok {
				return typedVal, true
			}
		}
	}

	return defaultVal, false
}