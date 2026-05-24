package user

import (
	"fmt"
	"testing"

	"golang.org/x/crypto/bcrypt"
)

type MockUserStore struct {
	users map[string]User
}

func NewMockUserStore() *MockUserStore {
	return &MockUserStore{
		users: make(map[string]User),
	}
}

func (m *MockUserStore) SaveUser(user User) error {
	for _, u := range m.users {
		if u.Email == user.Email {
			return fmt.Errorf("email already exists")
		}
	}

	m.users[user.ID] = user
	return nil
}

func (m *MockUserStore) GetUserByEmail(email string) (User, error) {
	for _, u := range m.users {
		if u.Email == email {
			return u, nil
		}
	}
	return User{}, fmt.Errorf("user not found")
}

func TestRegister(t *testing.T) {
	store := NewMockUserStore()
	jwtService := NewJWTService("test-secret")
	service := NewUserService(store, jwtService)

	userID, err := service.Register("test@example.com", "Password123")
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if userID == "" {
		t.Fatalf("Expected user ID, got empty")
	}
}

func TestRegisterDuplicateEmail(t *testing.T) {
	store := NewMockUserStore()
	jwtService := NewJWTService("test-secret")
	service := NewUserService(store, jwtService)

	service.Register("test@example.com", "Password123")

	_, err := service.Register("test@example.com", "Password456")
	if err == nil {
		t.Fatalf("Expected error for duplicate email")
	}
}

func TestLogin(t *testing.T) {
	store := NewMockUserStore()
	jwtService := NewJWTService("test-secret")
	service := NewUserService(store, jwtService)

	service.Register("test@example.com", "Password123")

	token, err := service.Login("test@example.com", "Password123")
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	if token == "" {
		t.Fatalf("Expected token, got empty")
	}
}

func TestLoginWrongPassword(t *testing.T) {
	store := NewMockUserStore()
	jwtService := NewJWTService("test-secret")
	service := NewUserService(store, jwtService)

	service.Register("test@example.com", "Password123")

	_, err := service.Login("test@example.com", "WrongPassword")
	if err == nil {
		t.Fatalf("Expected error for wrong password")
	}
}

func TestPasswordHashing(t *testing.T) {
	password := "TestPassword123"
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	err := bcrypt.CompareHashAndPassword(hash, []byte(password))

	if err != nil {
		t.Fatalf("Expected password to match hash")
	}

	err = bcrypt.CompareHashAndPassword(hash, []byte("WrongPassword"))
	if err == nil {
		t.Fatalf("Expected password mismatch")
	}
}
