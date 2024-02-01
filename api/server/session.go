package server

import "github.com/Azpect3120/LookSee/api/model"

func GetSessionData(s *model.Server) map[interface{}]interface{} {
	return s.Session.Values
}

func SetSessionData(s *model.Server, session map[interface{}]interface{}) {
	s.Session.Values = session
}

func GetSessionKeyValue(s *model.Server, key interface{}) interface{} {
	return s.Session.Values[key]
}

func SetSessionKeyValue(s *model.Server, key, value interface{}) {
	s.Session.Values[key] = value
}
