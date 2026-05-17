package user

import (
	"fmt"
	"math/rand"

	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	store UserStore
	jwt   *JWTService
}

func NewUserService(store UserStore, jwt *JWTService) *UserService {
	return &UserService{
		store: store,
		jwt:   jwt,
	}
}

func (us *UserService) Register(email string, password string) (string, error) {
	if email == "" || password == "" {
		return "", fmt.Errorf("email and password required")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return "", err
	}

	user := User{
		ID:       generateUserID(),
		Email:    email,
		Password: string(hashedPassword),
	}

	err = us.store.SaveUser(user)
	if err != nil {
		return "", err
	}

	return user.ID, nil
}

func (us *UserService) Login(email string, password string) (string, error) {
	user, err := us.store.GetUserByEmail(email)
	if err != nil {
		return "", fmt.Errorf("invalid email or password")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", err
	}

	token, err := us.jwt.GenerateToken(user.ID, user.Email)
	if err != nil {
		return "", err
	}
	return token, nil
}

func generateUserID() string {
	const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	b := make([]byte, 10)
	for i := range b {
		b[i] = chars[rand.Intn(len(chars))]
	}
	return string(b)
}
