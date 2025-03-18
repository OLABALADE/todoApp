package main

import (
	"github.com/OLABALADE/todoApp/backend/pkg/middleware"
	"github.com/gorilla/mux"
)

func (app *application) routes() *mux.Router {
	mid := middleware.Middleware{}
	mux := mux.NewRouter()
	mux.HandleFunc("/", app.home).Methods("GET")
	mux.HandleFunc("/api/auth/verify-token", app.VerifyToken).Methods("GET")

	mux.HandleFunc("/api/users/register", app.CreateUser).Methods("POST")
	mux.HandleFunc("/api/users/login", app.Login).Methods("POST")

	mux.HandleFunc("/api/users/me", mid.Auth(app.GetUser)).Methods("GET")
	mux.HandleFunc("/api/users", mid.Auth(app.GetUsers)).Methods("GET")
	mux.HandleFunc("/api/users/{userID}", mid.Auth(app.DeleteUser)).Methods("DELETE")
	mux.HandleFunc("/api/users/{userID}", mid.Auth(app.UpdateUser)).Methods("PATCH")

	mux.HandleFunc("/api/tasks", mid.Auth(app.CreatePersonalTask)).Methods("POST")
	mux.HandleFunc("/api/tasks", mid.Auth(app.GetPersonalTasks)).Methods("GET")
	mux.HandleFunc("/api/tasks/{taskID}", mid.Auth(app.GetPersonalTask)).Methods("GET")
	mux.HandleFunc("/api/tasks/{taskID}", mid.Auth(app.UpdatePersonalTask)).Methods("PATCH")
	mux.HandleFunc("/api/tasks/{taskID}", mid.Auth(app.DeletePersonalTask)).Methods("DELETE")

	mux.HandleFunc("/api/teams", mid.Auth(app.CreateTeam)).Methods("POST")
	mux.HandleFunc("/api/teams", mid.Auth(app.GetUserTeams)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}", mid.Auth(app.GetTeam)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}", mid.Auth(app.UpdateTeam)).Methods("PATCH")
	mux.HandleFunc("/api/teams/{teamId}", mid.Auth(app.DeleteTeam)).Methods("DELETE")

	mux.HandleFunc("/api/teams/{teamID}/members", mid.Auth(app.AddMemberToTeam)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamID}/members", mid.Auth(app.GetTeamMembers)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/members/{userID}", mid.Auth(app.RemoveMemberFromTeam)).Methods("DELETE")

	mux.HandleFunc("/api/teams/{teamID}/tasks", mid.Auth(app.CreateTeamTask)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamID}/tasks", mid.Auth(app.GetTeamTasks)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/tasks/{taskID}", mid.Auth(app.GetTeamTask)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/tasks/{taskID}", mid.Auth(app.UpdateTeamTask)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/tasks/{taskID}", mid.Auth(app.DeleteTeamTask)).Methods("GET")

	mux.HandleFunc("/api/teams/{teamID}/projects", mid.Auth(app.CreateProject)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamID}/projects", mid.Auth(app.GetProjects)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}", mid.Auth(app.GetProject)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}", mid.Auth(app.UpdateProject)).Methods("PATCH")
	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}", mid.Auth(app.DeleteProject)).Methods("DELETE")

	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}/tasks", mid.Auth(app.CreateProjectTask)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}/tasks", mid.Auth(app.GetProjectTasks)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}/tasks/{taskID}", mid.Auth(app.GetProjectTask)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}/tasks/{taskID}", mid.Auth(app.UpdateProjectTask)).Methods("PATCH")
	mux.HandleFunc("/api/teams/{teamID}/projects/{projectID}/tasks/{taskID}", mid.Auth(app.DeleteProjectTask)).Methods("DELETE")

	return mux
}
