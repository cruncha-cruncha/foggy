package helpers

func GetVal[T any](data map[string]any, path []string, defaultVal T) T {
	val, _ := GetValKnowing(data, path, defaultVal)
	return val
}