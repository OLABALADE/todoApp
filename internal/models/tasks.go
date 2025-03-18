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
	Description string    `json:"description"`
	Type        string    `json:"taskType"`
	Status      string    `json:"status"`
	Priority    string    `json:"priority"`
	DueDate     time.Time `json:"dueDate"`
	CreatorId   int       `json:"creatorId"`
	TeamId      int       `json:"teamId"`
	ProjectId   int       `json:"projectId"`
	Created     time.Time `json:"created"`
	Updated     time.Time `json:"updated"`
}

type TaskModel struct {
	DB *pgxpool.Pool
}

func (m *TaskModel) InsertPersonalTask(task *Task) (int, error) {
	stmt := `insert into tasks
  (title, description, task_type, status, priority, due_date, creator_id) 
  values($1, $2, $3, $4, $5, $6, $7) returning id;`

	rows, err := m.DB.Query(context.Background(), stmt,
		task.Title,
		task.Description,
		task.Type,
		task.Status,
		task.Priority,
		task.DueDate,
		task.CreatorId,
	)

	if err != nil {
		return 0, err
	}

	rowsId, err := pgx.CollectRows(rows, pgx.RowTo[int])
	if err != nil {
		return 0, err
	}
	return rowsId[0], nil
}

func (m *TaskModel) GetPersonalTask(taskId int) (*Task, error) {
	stmt := `select id, title, description, task_type, status, priority, due_date,
  creator_id from tasks where id = $1 and task_type = $2`
	row := m.DB.QueryRow(context.Background(), stmt, taskId, "personal")
	t := &Task{}
	err := row.Scan(
		&t.ID,
		&t.Title,
		&t.Description,
		&t.Type,
		&t.Status,
		&t.Priority,
		&t.DueDate,
		&t.CreatorId,
	)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (m *TaskModel) GetPersonalTasks(userId int) ([]*Task, error) {
	stmt := `select id, title, description, task_type, status,
  priority, due_date, creator_id, created_at from tasks where creator_id = $1 and 
  task_type = $2 order by id`
	rows, err := m.DB.Query(context.Background(), stmt, userId, "personal")
	if err != nil {
		return nil, err
	}

	tasks := []*Task{}
	for rows.Next() {
		t := &Task{}
		err = rows.Scan(
			&t.ID,
			&t.Title,
			&t.Description,
			&t.Type,
			&t.Status,
			&t.Priority,
			&t.DueDate,
			&t.CreatorId,
			&t.Created,
		)
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

func (m *TaskModel) Update(id int) error {
	stmt := "UPDATE tasks SET completed = true WHERE id = $1"
	_, err := m.DB.Exec(context.Background(), stmt, id)
	if err != nil {
		return err
	}
	return nil
}

func (m *TaskModel) DeletePersonalTask(taskId int) error {
	stmt := "DELETE FROM tasks WHERE id = $1 and task_type = $2"
	_, err := m.DB.Exec(context.Background(), stmt, taskId, "personal")
	if err != nil {
		return err
	}
	return nil
}

// ////////////////// Team Task ///////////////////
func (m *TaskModel) InsertTeamTask(task *Task) (int, error) {
	stmt := `insert into tasks(
  title, description, task_type, status, priority ,due_date, creator_id, team_id)
  values($1, $2, $3, $4, $5, $6, $7, $8) returning id`

	rows, err := m.DB.Query(context.Background(), stmt,
		task.Title,
		task.Description,
		task.Type,
		task.Status,
		task.Priority,
		task.DueDate,
		task.CreatorId,
		task.TeamId,
	)

	if err != nil {
		return 0, err
	}

	taskId, err := pgx.CollectExactlyOneRow(rows, pgx.RowTo[int])
	if err != nil {
		return 0, err
	}

	return taskId, nil
}

func (m *TaskModel) GetTeamTasks(teamId int) ([]*Task, error) {
	stmt := `select * from tasks where team_id = $1`
	rows, err := m.DB.Query(context.Background(), stmt, teamId)
	if err != nil {
		return nil, err
	}

	tasks := []*Task{}
	for rows.Next() {
		t := &Task{}
		err = rows.Scan(
			&t.ID,
			&t.Title,
			&t.Description,
			&t.Type,
			&t.Status,
			&t.Priority,
			&t.DueDate,
			&t.CreatorId,
			&t.TeamId,
			&t.Created,
		)
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

func (m *TaskModel) GetTeamTask(teamId, taskId int) (*Task, error) {
	stmt := `select id, title, description, task_type, status, priority, due_date, creator_id, team_id from tasks where 
  id = $1 and team_id = $2 and task_type = $3`
	row := m.DB.QueryRow(context.Background(), stmt, taskId, teamId, "team")
	t := &Task{}
	err := row.Scan(
		&t.ID,
		&t.Title,
		&t.Description,
		&t.Type,
		&t.Status,
		&t.Priority,
		&t.DueDate,
		&t.CreatorId,
		&t.TeamId,
	)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (m *TaskModel) UpdateTeamTask() {}
func (m *TaskModel) DeleteTeamTask(teamId, taskId int) error {
	stmt := `delete from tasks where id = $1 and team_id = $2`
	_, err := m.DB.Exec(context.Background(), stmt, taskId, teamId)
	if err != nil {
		return err
	}
	return nil
}

// ///////////////  Project Tasks ////////////////
func (m *TaskModel) InsertProjectTask(task *Task) (int, error) {
	stmt := `insert into tasks(
  title, description, task_type, status, priority, due_date, creator_id, team_id, project_id)
  values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning id`

	rows, err := m.DB.Query(context.Background(), stmt,
		task.Title,
		task.Description,
		task.Type,
		task.Status,
		task.Priority,
		task.DueDate,
		task.CreatorId,
		task.TeamId,
		task.ProjectId,
	)

	if err != nil {
		return 0, err
	}

	taskId, err := pgx.CollectExactlyOneRow(rows, pgx.RowTo[int])
	if err != nil {
		return 0, err
	}
	return taskId, nil
}

func (m *TaskModel) GetProjectTasks(teamId, projectId int) ([]*Task, error) {
	stmt := `select * from tasks where team_id = $1 and project_id = $2 `
	rows, err := m.DB.Query(context.Background(), stmt, teamId, projectId)
	if err != nil {
		return nil, err
	}

	tasks := []*Task{}
	for rows.Next() {
		t := &Task{}
		err = rows.Scan(
			&t.ID,
			&t.Title,
			&t.Description,
			&t.Type,
			&t.Status,
			&t.Priority,
			&t.DueDate,
			&t.CreatorId,
			&t.TeamId,
			&t.ProjectId,
			&t.Created,
		)
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

func (m *TaskModel) GetProjectTask(teamId, projectId, taskId int) (*Task, error) {
	stmt := `select id, title, description, task_type, status, priority, due_date, creator_id, team_id from tasks where 
  id = $1 and team_id = $2 and project_id = $3 and task_type = $4`
	row := m.DB.QueryRow(context.Background(), stmt, taskId, teamId, projectId, "team")
	t := &Task{}
	err := row.Scan(
		&t.ID,
		&t.Title,
		&t.Description,
		&t.Type,
		&t.Status,
		&t.Priority,
		&t.DueDate,
		&t.CreatorId,
		&t.TeamId,
		&t.ProjectId,
	)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (m *TaskModel) UpdateProjectTask(teamId, projectId, taskId int) error {
	return nil
}

func (m *TaskModel) DeleteProjectTask(teamId, projectId, taskId int) error {
	stmt := "DELETE FROM tasks WHERE id = $1 and team_id = $2 and project_id = $3"
	_, err := m.DB.Exec(context.Background(), stmt, taskId, teamId, projectId)
	if err != nil {
		return err
	}
	return nil
}
