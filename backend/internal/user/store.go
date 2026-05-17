package user

type UserStore interface {
	SaveUser(user User) error
	GetUserByEmail(email string) (User, error)
}
