package models

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Task struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"desc"`
	Author      string    `json:"author"`
	Created     time.Time `json:"created"`
	Completed   bool      `json:"completed"`
}

type TaskForm struct {
	Title  string `json:"title"`
	Desc   string `json:"desc"`
	Author string `json:"username"`
}

type TaskModel struct {
	DB *pgxpool.Pool
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

func (m *TaskModel) Insert(title, description, author string) (int, error) {
	stmt := `INSERT INTO tasks(title, description, author, created, completed) 
  VALUES($1, $2, $3,current_timestamp, false) returning id;`
	result, err := m.DB.Query(context.Background(), stmt, title, description, author)
	if err != nil {
		return 0, err
	}

	rows, err := pgx.CollectRows(result, pgx.RowTo[int])
	if err != nil {
		return 0, err
	}
	return rows[0], nil
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

func (m *TaskModel) CurrentTasks(author string) ([]*Task, error) {
	stmt := `SELECT id, title, description, author, created ,completed 
  from tasks where author = $1 order by id`
	rows, err := m.DB.Query(context.Background(), stmt, author)
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
