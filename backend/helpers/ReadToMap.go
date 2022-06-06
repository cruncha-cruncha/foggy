package helpers

import (
	"io"
	"encoding/json"
	"bytes"
)

func ReadToMap(reader io.Reader) (map[string]any, error) {
	var (
		m      map[string]any
		buf    bytes.Buffer
		_, err = io.Copy(&buf, reader)
	)

	if err != nil {
		return m, err
	}

	return m, json.Unmarshal(buf.Bytes(), &m)
}