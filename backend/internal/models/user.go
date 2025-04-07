package models

import (
	"context"
	"errors"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
	"time"
)

type User struct {
	Id       int       `json:"userId"`
	Name     string    `json:"username"`
	Email    string    `json:"email,omitempty"`
	Password []byte    `json:"password,omitempty"`
	Created  time.Time `json:"createdAt,omitempty"`
}

type UserModel struct {
	DB *pgxpool.Pool
}

func (m *UserModel) GetUser(id int) (*User, error) {
	stmt := "select * from users where id = $1"
	row := m.DB.QueryRow(context.Background(), stmt, id)
	user := &User{}
	err := row.Scan(
		&user.Id,
		&user.Name,
		&user.Email,
		&user.Password,
		&user.Created,
	)
	if err != nil {
		return &User{}, err
	}

	return user, nil
}

func (m *UserModel) GetUsers() ([]*User, error) {
	stmt := `select id, name from users`
	rows, err := m.DB.Query(context.Background(), stmt)
	if err != nil {
		return nil, err
	}

	users := []*User{}
	for rows.Next() {
		u := &User{}
		err = rows.Scan(&u.Id, &u.Name)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}

	return users, nil
}

func (m *UserModel) Insert(name, email, password string) (*User, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), 12)

	if err != nil {
		return nil, err
	}
	stmt := `insert into users(name, email, password) 
  values($1, $2, $3) returning id, name, email, created_at`

	user := &User{}
	err = m.DB.QueryRow(context.Background(), stmt, name, email, string(hashedPassword)).Scan(
		&user.Id,
		&user.Name,
		&user.Email,
		&user.Created,
	)

	if err != nil {
		return nil, err
	}

	return user, nil
}

func (m *UserModel) Delete(id int) error {
	stmt := `delete from users where id = $1`
	_, err := m.DB.Exec(context.Background(), stmt, id)
	if err != nil {
		return err
	}
	return nil
}

func (m *UserModel) Update(id int) error {
	return nil
}

func (m *UserModel) Authenticate(email, password string) (int, error) {
	var hashed_password []byte
	var userId int
	stmt := `select id, password from users where email = $1`

	err := m.DB.QueryRow(context.Background(), stmt, email).Scan(&userId, &hashed_password)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return 0, ErrInvalidCredential
		} else {
			return 0, err
		}
	}

	err = bcrypt.CompareHashAndPassword(hashed_password, []byte(password))
	if err != nil {
		if errors.Is(err, bcrypt.ErrMismatchedHashAndPassword) {
			return 0, ErrInvalidCredential
		} else {
			return 0, err
		}
	}
	return userId, nil
}
