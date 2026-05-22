package api

import (
	"fmt"
	"net/mail"
	"net/url"
)

func ValidateEmail(email string) error {
	if email == "" {
		return fmt.Errorf("email is required")
	}

	if len(email) > 255 {
		return fmt.Errorf("email is too long (max 255 chars)")
	}

	_, err := mail.ParseAddress(email)
	if err != nil {
		return fmt.Errorf("invalid email format")
	}

	return nil
}

func ValidatePassword(password string) error {
	if password == "" {
		return fmt.Errorf("password is required")
	}

	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	if len(password) > 128 {
		return fmt.Errorf("password is too long (max 128 chars)")
	}

	hasNumber := false
	for _, char := range password {
		if char >= '0' && char <= '9' {
			hasNumber = true
			break
		}
	}

	if !hasNumber {
		return fmt.Errorf("password must contain at least one number")
	}

	return nil
}

func ValidateURL(urlString string) error {
	if urlString == "" {
		return fmt.Errorf("URL is required")
	}

	if len(urlString) > 2048 {
		return fmt.Errorf("URL is too long (max 2048 chars)")
	}

	_, err := url.ParseRequestURI(urlString)
	if err != nil {
		return fmt.Errorf("invalid URL format")
	}

	return nil
}
