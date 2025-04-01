package models

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"time"
)

type Team struct {
	Id          int       `json:"teamId"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	Members     []*Member `json:"members"`
	Creator     string    `json:"creator"`
	Created     time.Time `json:"created"`
}

type Member struct {
	Id   int    `json:"userId"`
	Name string `json:"name"`
	Role string `json:"role"`
}

type TeamModel struct {
	DB *pgxpool.Pool
}

func (m *TeamModel) Insert(name, desc string, creatorId int) (int, error) {
	stmt := `insert into teams(name, description, creator_id) 
  values($1, $2, $3) returning id`

	results, err := m.DB.Query(context.Background(), stmt, name, desc, creatorId)
	if err != nil {
		return 0, err
	}

	rowIds, err := pgx.CollectRows(results, pgx.RowTo[int])
	if err != nil {
		return 0, err
	}

	return rowIds[0], nil
}

func (m *TeamModel) GetTeams(userId int) ([]*Team, error) {
	stmt := `select t.id, t.name, t.description from teams t
  join team_members tm on t.id = tm.team_id where tm.user_id = $1`

	rows, err := m.DB.Query(context.Background(), stmt, userId)
	if err != nil {
		return nil, err
	}

	teams := []*Team{}
	for rows.Next() {
		t := &Team{}
		err = rows.Scan(&t.Id, &t.Name, &t.Description)
		if err != nil {
			return nil, err
		}
		teams = append(teams, t)
	}

	return teams, nil
}

func (m *TeamModel) GetTeam(id int) (*Team, error) {
	stmt := `select t.id, t.name, t.description, u.name, t.created_at from teams t
  join users u on u.id = creator_id where t.id = $1`
	row := m.DB.QueryRow(context.Background(), stmt, id)

	t := &Team{}
	err := row.Scan(&t.Id, &t.Name, &t.Description, &t.Creator, &t.Created)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (m *TeamModel) Update(id int, name, description string) (*Team, error) {
	stmt := `update teams set name = $1,
  description = $2 
  where id = $3 returning id, name, description`

	t := &Team{}
	err := m.DB.QueryRow(context.Background(),
		stmt,
		name,
		description,
		id).Scan(&t.Id, &t.Name, &t.Description)

	if err != nil {
		return nil, err
	}
	return t, nil
}

func (m *TeamModel) Delete(id int) error {
	stmt := `delete from teams where id = $1`
	_, err := m.DB.Exec(context.Background(), stmt, id)
	if err != nil {
		return err
	}

	return nil
}

func (m *TeamModel) GetMembers(teamId int) ([]*Member, error) {
	stmt := `select u.id, u.name, tm.role from users u 
  join team_members tm on u.id = tm.user_id
  where tm.team_id = $1`

	rows, err := m.DB.Query(context.Background(), stmt, teamId)
	if err != nil {
		return nil, err
	}

	members := []*Member{}
	for rows.Next() {
		tm := &Member{}
		err = rows.Scan(&tm.Id, &tm.Name, &tm.Role)
		if err != nil {
			return nil, err
		}
		members = append(members, tm)
	}
	return members, nil
}

func (m *TeamModel) AddMember(team_id, userId int, role string) error {
	stmt := `insert into team_members (user_id, team_id, role, joined_at)
  values($1, $2, $3, current_timestamp)`
	_, err := m.DB.Exec(context.Background(), stmt, userId, team_id, role)
	if err != nil {
		return err
	}

	return nil
}

func (m *TeamModel) RemoveMember(team_id, userId int) error {
	stmt := `delete from team_members tm where tm.user_id = $1
  and tm.team_id = $2`
	_, err := m.DB.Exec(context.Background(), stmt, userId, team_id)
	if err != nil {
		return err
	}

	return nil
}
