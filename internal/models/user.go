package models

import (
	"database/sql"
	"time"
)

type User struct {
	Id      int
	Name    string
	Email   string
	Created time.Time
}

type UserModel struct {
	DB *sql.DB
}

func (m *UserModel) Insert(name, email string) error {
	return nil
}

func (m *UserModel) Authenticate() {}
func (m *UserModel) Exists(id int) bool {
	return false
}
