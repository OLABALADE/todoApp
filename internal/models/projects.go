package models

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Project struct {
	Name        string    `json:"name"`
	Description string    `json:"description"`
	TeamId      int       `json:"team_id"`
	CreatorId   int       `json:"creator_id"`
	Created     time.Time `json:"created_at"`
}

type ProjectModel struct {
	DB *pgxpool.Pool
}

func (m *ProjectModel) Insert(name, desc string, teamId, creatorId int) (int, error) {
	stmt := `insert into projects(name, description, team_id, creator_id)
  values($1, $2, $3, $4)`
	results, err := m.DB.Query(context.Background(), stmt, name, desc, teamId, creatorId)
	if err != nil {
		return 0, err
	}

	rows, err := pgx.CollectRows(results, pgx.RowTo[int])
	if err != nil {
		return 0, err
	}
	return rows[0], nil
}

func (m *ProjectModel) GetProject(teamId, projectId int) (*Project, error) {
	stmt := `select * from projects where team_id = $1 and project_id = $2`
	row := m.DB.QueryRow(context.Background(), stmt, teamId, projectId)

	p := &Project{}
	err := row.Scan(
		&p.Name,
		&p.Description,
		&p.TeamId,
		&p.CreatorId,
		&p.Created,
	)

	if err != nil {
		return &Project{}, err
	}

	return p, nil
}
func (m *ProjectModel) GetProjects(teamId int) ([]*Project, error) {
	stmt := `select * from projects where team_id = $1`
	rows, err := m.DB.Query(context.Background(), stmt, teamId)
	if err != nil {
		return nil, err
	}

	projects := []*Project{}
	for rows.Next() {
		p := &Project{}
		err = rows.Scan(
			&p.Name,
			&p.Description,
			&p.TeamId,
			&p.CreatorId,
			&p.Created,
		)
		if err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}

	return projects, nil
}

func (m *ProjectModel) DeleteProject(teamId, projectId int) error {
	stmt := `delete from projects where team_id = $1 and project_id = $2`
	_, err := m.DB.Exec(context.Background(), stmt, teamId, projectId)
	if err != nil {
		return err
	}
	return nil
}

func (m *ProjectModel) UpdateProject(teamId, projectId int) error {
	return nil
}
