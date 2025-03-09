package models

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Id       int
	Name     string
	Email    string
	Password []byte
	Created  time.Time
}

type UserModel struct {
	DB *pgxpool.Pool
}

func (m *UserModel) GetUser(email string) (*User, error) {
	stmt := "SELECT * FROM users WHERE email = $1"
	row := m.DB.QueryRow(context.Background(), stmt, email)
	user := &User{}
	err := row.Scan(&user.Id, &user.Name, &user.Email, &user.Password, &user.Created)
	if err != nil {
		return &User{}, err
	}

	return user, nil
}

func (m *UserModel) Insert(name, email, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)

	if err != nil {
		return err
	}
	stmt := `INSERT INTO users(name, email, password, created) 
  VALUES($1, $2, $3, current_timestamp)`

	_, err = m.DB.Exec(context.Background(), stmt, name, email, string(hashedPassword))
	if err != nil {
		return err
	}

	return nil
}

func (m *UserModel) Authenticate(email, password string) (string, error) {
	var hashed_password []byte
	username := ""
	stmt := `SELECT name, password from users WHERE email = $1`

	err := m.DB.QueryRow(context.Background(), stmt, email).Scan(&username, &hashed_password)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrInvalidCredential
		} else {
			return "", err
		}
	}

	err = bcrypt.CompareHashAndPassword(hashed_password, []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return "", ErrInvalidCredential
		} else {
			return "", err
		}
	}
	return username, nil
}
