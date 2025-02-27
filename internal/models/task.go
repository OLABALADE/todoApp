package models

import (
	"context"
	"github.com/jackc/pgx/v5"
	"time"
)

type Task struct {
	ID          int
	Title       string
	Description string
	Author      string
	Created     time.Time
	Completed   bool
}

type TaskModel struct {
	DB *pgx.Conn
}

func (m *TaskModel) Get(id int) (*Task, error) {
	stmt := "SELECT * FROM tasks WHERE id = $1"
	row := m.DB.QueryRow(context.Background(), stmt, id)
	t := &Task{}
	err := row.Scan(&t.ID, &t.Title, &t.Description, &t.Author, &t.Created, &t.Completed)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (m *TaskModel) Insert(title, description, author string) error {
	stmt := `INSERT INTO tasks(title, description, author, created, completed) 
  VALUES($1, $2, $3,current_timestamp, false)`
	_, err := m.DB.Exec(context.Background(), stmt, title, description, author)
	if err != nil {
		return err
	}
	return nil
}

func (m *TaskModel) Delete(id int) error {
	stmt := "DELETE FROM tasks WHERE id = $1"
	_, err := m.DB.Exec(context.Background(), stmt, id)
	if err != nil {
		return err
	}
	return nil
}

func (m *TaskModel) Update(id int) error {
	stmt := "UPDATE tasks SET completed = true WHERE id = $1"
	_, err := m.DB.Exec(context.Background(), stmt, id)
	if err != nil {
		return err
	}
	return nil
}

func (m *TaskModel) Undone() ([]*Task, error) {
	stmt := `SELECT id, title, description, author, created ,completed 
  from tasks where completed = false order by id`
	rows, err := m.DB.Query(context.Background(), stmt)
	if err != nil {
		return nil, err
	}

	tasks := []*Task{}
	for rows.Next() {
		t := &Task{}
		err = rows.Scan(&t.ID, &t.Title, &t.Description, &t.Author, &t.Created, &t.Completed)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return tasks, nil
}
