package models

import (
	"context"
	"fmt"
	"github.com/OLABALADE/todoApp/backend/internal/schemas"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"strings"
	"time"
)

type TaskModel struct {
	DB *pgxpool.Pool
}

type DashboardTask struct {
	Id       string    `json:"id"`
	Title    string    `json:"title"`
	Status   string    `json:"status"`
	DueDate  time.Time `json:"dueDate"`
	TeamID   string    `json:"teamId,omitempty"`
	TeamName string    `json:"teamName,omitempty"`
}

func (m *TaskModel) InsertPersonalTask(tr *schemas.TaskRequest) (int, error) {
	stmt := `insert into tasks
  (title, description, task_type, status, priority, due_date, creator_id) 
  values($1, $2, $3, $4, $5, $6, $7) returning id;`

	rows, err := m.DB.Query(context.Background(), stmt,
		tr.Title,
		tr.Description,
		tr.Type,
		tr.Status,
		tr.Priority,
		tr.DueDate,
		tr.CreatorId,
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

func (m *TaskModel) GetPersonalTask(taskId int) (*schemas.TaskResponse, error) {
	stmt := `select id, title, description, task_type, status, priority, due_date,
  creator_id from tasks where id = $1 and task_type = $2`
	row := m.DB.QueryRow(context.Background(), stmt, taskId, "personal")
	t := &schemas.TaskResponse{}
	err := row.Scan(
		&t.Id,
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

func (m *TaskModel) GetPersonalTasks(userId int) ([]*schemas.TaskResponse, error) {
	stmt := `select id, title, description, task_type, status,
  priority, due_date, creator_id, created_at from tasks where creator_id = $1 and 
  task_type = $2 order by id`
	rows, err := m.DB.Query(context.Background(), stmt, userId, "personal")
	if err != nil {
		return nil, err
	}

	tasks := []*schemas.TaskResponse{}
	for rows.Next() {
		t := &schemas.TaskResponse{}
		err = rows.Scan(
			&t.Id,
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

func (m *TaskModel) UpdatePersonalTask(tr *schemas.TaskRequest) (*schemas.TaskResponse, error) {
	stmt := ` UPDATE tasks SET
  title = $1, description = $2,
  status = $3, priority = $4, due_date = $5
  WHERE id = $6 AND task_type = $7
  `
	_, err := m.DB.Exec(context.Background(), stmt,
		tr.Title,
		tr.Description,
		tr.Status,
		tr.Priority,
		tr.DueDate,
		tr.Id,
		tr.Type,
	)

	if err != nil {
		return nil, err
	}

	updatedTask, err := m.GetPersonalTask(tr.Id)
	if err != nil {
		return nil, err
	}
	return updatedTask, nil
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
func (m *TaskModel) InsertTeamTask(tr *schemas.TaskRequest) (*schemas.TaskResponse, error) {
	stmt := `insert into tasks(
  title, description, task_type, status, priority ,due_date, creator_id, team_id)
  values($1, $2, $3, $4, $5, $6, $7, $8) returning id`

	taskId := 0
	err := m.DB.QueryRow(context.Background(), stmt,
		tr.Title,
		tr.Description,
		tr.Type,
		tr.Status,
		tr.Priority,
		tr.DueDate,
		tr.CreatorId,
		tr.TeamId,
	).Scan(&taskId)

	if err != nil {
		return nil, err
	}

	stmt = `insert into task_assignments(task_id, user_id) values($1, $2)`
	_, err = m.DB.Exec(context.Background(), stmt, taskId, tr.AssigneeId)
	if err != nil {
		return nil, err
	}

	newTask, err := m.GetTeamTask(tr.TeamId, taskId)

	return newTask, nil
}

func (m *TaskModel) GetTeamTasks(teamId int) ([]*schemas.TaskResponse, error) {
	stmt := `select
  tk.id, 
  tk.title, 
  tk.description, 
  tk.task_type, 
  tk.status, 
  tk.priority, 
  tk.due_date, 
  tk.creator_id, 
  tk.team_id, 
  tk.created_at,
  u.id,
  u.name
  from tasks tk join task_assignments ta on tk.id = ta.task_id
  join users u on u.id = ta.user_id where tk.team_id = $1 order by tk.id`

	rows, err := m.DB.Query(context.Background(), stmt, teamId)
	if err != nil {
		return nil, err
	}

	tasks := []*schemas.TaskResponse{}
	for rows.Next() {
		t := &schemas.TaskResponse{}
		err = rows.Scan(
			&t.Id,
			&t.Title,
			&t.Description,
			&t.Type,
			&t.Status,
			&t.Priority,
			&t.DueDate,
			&t.CreatorId,
			&t.TeamId,
			&t.Created,
			&t.Assignee.Id,
			&t.Assignee.Name,
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

func (m *TaskModel) GetTeamTask(teamId, taskId int) (*schemas.TaskResponse, error) {
	stmt := `select 
  tk.id,
  tk.title,
  tk.description,
  tk.task_type,
  tk.status, 
  tk.priority, 
  tk.due_date, 
  tk.creator_id, 
  tk.team_id,
  u.id,
  u.name from tasks tk 
  join task_assignments ta on tk.id = ta.task_id 
  join users u on u.id = ta.user_id where 
  tk.id = $1 and tk.team_id = $2`

	row := m.DB.QueryRow(context.Background(), stmt, taskId, teamId)
	t := &schemas.TaskResponse{}
	err := row.Scan(
		&t.Id,
		&t.Title,
		&t.Description,
		&t.Type,
		&t.Status,
		&t.Priority,
		&t.DueDate,
		&t.CreatorId,
		&t.TeamId,
		&t.Assignee.Id,
		&t.Assignee.Name,
	)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (m *TaskModel) UpdateTeamTask(tr *schemas.TaskRequest) (*schemas.TaskResponse, error) {
	updateFields := []string{}
	args := []interface{}{}
	argIndex := 1
	if tr.Title != "" {
		updateFields = append(updateFields, fmt.Sprintf("title = $%d", argIndex))
		args = append(args, tr.Title)
		argIndex++
	}

	if tr.Description != "" {
		updateFields = append(updateFields, fmt.Sprintf("description = $%d", argIndex))
		args = append(args, tr.Description)
		argIndex++
	}

	if tr.Type != "" {
		updateFields = append(updateFields, fmt.Sprintf("task_type = $%d", argIndex))
		args = append(args, tr.Type)
		argIndex++
	}

	if tr.Status != "" {
		updateFields = append(updateFields, fmt.Sprintf("status = $%d", argIndex))
		args = append(args, tr.Status)
		argIndex++
	}

	if tr.Priority != "" {
		updateFields = append(updateFields, fmt.Sprintf("priority = $%d", argIndex))
		args = append(args, tr.Priority)
		argIndex++
	}

	if !tr.DueDate.IsZero() {
		updateFields = append(updateFields, fmt.Sprintf("due_date = $%d", argIndex))
		args = append(args, tr.DueDate)
		argIndex++
	}

	args = append(args, tr.Id)
	stmt := fmt.Sprintf(`update tasks set %s where id = $%d`, strings.Join(updateFields, ","), argIndex)

	_, err := m.DB.Exec(context.Background(), stmt, args...)

	if err != nil {
		return nil, err
	}

	if tr.AssigneeId != 0 {
		stmt = `UPDATE task_assignments
  SET user_id = $1
  WHERE task_id = $2`

		_, err = m.DB.Exec(context.Background(), stmt, tr.AssigneeId, tr.Id)
		if err != nil {
			return nil, err
		}
	}

	updatedTask, err := m.GetTeamTask(tr.TeamId, tr.Id)
	if err != nil {
		return nil, err
	}

	return updatedTask, nil
}

func (m *TaskModel) DeleteTeamTask(teamId, taskId int) error {
	stmt := `delete from tasks where id = $1 and team_id = $2`
	_, err := m.DB.Exec(context.Background(), stmt, taskId, teamId)
	if err != nil {
		return err
	}
	return nil
}

func (m *TaskModel) GetRecentTasks(userId int) (*[]DashboardTask, error) {
	var teamIds []string
	stmt := `select team_id from team_members where user_id = $1`
	rows, err := m.DB.Query(context.Background(), stmt, userId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var id string
		rows.Scan(&id)
		teamIds = append(teamIds, id)
	}

	stmt = `SELECT 
    t.id, 
    t.title, 
    t.status, 
    t.due_date, 
    t.team_id,
    teams.name AS team_name
    FROM tasks t
    INNER JOIN task_assignments ta ON t.id = ta.task_id
    LEFT JOIN teams ON t.team_id = teams.id
    WHERE ta.user_id = $1
      AND t.status != 'completed'
    ORDER BY t.due_date ASC
    LIMIT 10;
`
	var tasks []DashboardTask
	rows, err = m.DB.Query(context.Background(), stmt, userId)
	for rows.Next() {
		var t DashboardTask
		err := rows.Scan(&t.Id, &t.Title, &t.Status, &t.DueDate, &t.TeamID, &t.TeamName)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return &tasks, nil
}

func (m *TaskModel) GetUrgentTasks(userId int) (*[]DashboardTask, error) {
	var teamIds []string
	stmt := `select team_id from team_members where user_id = $1`
	rows, err := m.DB.Query(context.Background(), stmt, userId)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var id string
		rows.Scan(&id)
		teamIds = append(teamIds, id)
	}

	daysLeft := time.Now().Add(time.Hour * 24 * 2 * -1).Format("2006-01-02")
	stmt = `SELECT 
    t.id, 
    t.title, 
    t.status, 
    t.due_date, 
    t.team_id,
    teams.name AS team_name
    FROM tasks t
    INNER JOIN task_assignments ta ON t.id = ta.task_id
    LEFT JOIN teams ON t.team_id = teams.id
    WHERE ta.user_id = $1
      AND t.status != 'completed' AND t.due_date <= $2
    ORDER BY t.due_date ASC
    LIMIT 10;
`
	var tasks []DashboardTask
	rows, err = m.DB.Query(context.Background(), stmt, userId, daysLeft)
	for rows.Next() {
		var t DashboardTask
		err := rows.Scan(&t.Id, &t.Title, &t.Status, &t.DueDate, &t.TeamID, &t.TeamName)
		if err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return &tasks, nil
}

// ///////////////  Project Tasks ////////////////
/* func (m *TaskModel) InsertProjectTask(task *Task) (int, error) {
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
} */
