package server

import (
	"fmt"
	"net/http"
	"time"
)

// func Log(r *http.Request, code int) {
// 	fmt.Printf("[%s] %s %s - Status Code: %d\n", r.Method, r.Host, r.URL.Path, code)
// }

// ANSI color escape codes
type TerminalColor string

const (
	RedForeground    TerminalColor = "\033[31m"
	GreenForeground  TerminalColor = "\033[32m"
	YellowForeground TerminalColor = "\033[33m"
	WhiteForeground  TerminalColor = "\033[37m"
	CyanForeground   TerminalColor = "\033[36m"

	RedBackground    TerminalColor = "\033[41m"
	GreenBackground  TerminalColor = "\033[42m"
	YellowBackground TerminalColor = "\033[43m"
	WhiteBackground  TerminalColor = "\033[47m"
	CyanBackground   TerminalColor = "\033[46m"

	Reset TerminalColor = "\033[0m"
)

func Log(r *http.Request, code int) {
	// Get current time
	time := time.Now().Format("2006-01-02 15:04:05")

	// Define color
	var color string
	switch {
	case code >= 200 && code < 300:
		color = "\033[42m"
	case code >= 400 && code < 500:
		color = "\033[43m"
	case code >= 500:
		color = "\033[41m"
	default:
		color = ""
	}

	// Format and print log with color
	fmt.Printf(
		"[LOG] %s |%s %3d %s| %6s %s\n",
		time,
		color,
		code,
		"\033[0m",
		r.Method,
		r.URL.Path,
	)
}
