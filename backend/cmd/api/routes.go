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
	mux.HandleFunc("/api/users/logout", app.Logout).Methods("POST")

	mux.HandleFunc("/api/users/me", mid.Auth(app.GetUser)).Methods("GET")
	mux.HandleFunc("/api/users", mid.Auth(app.GetUsers)).Methods("GET")
	mux.HandleFunc("/api/users/{userId}", mid.Auth(app.DeleteUser)).Methods("DELETE")
	mux.HandleFunc("/api/users/{userId}", mid.Auth(app.UpdateUser)).Methods("PATCH")

	mux.HandleFunc("/api/tasks", mid.Auth(app.CreatePersonalTask)).Methods("POST")
	mux.HandleFunc("/api/tasks", mid.Auth(app.GetPersonalTasks)).Methods("GET")
	mux.HandleFunc("/api/tasks/{taskId}", mid.Auth(app.GetPersonalTask)).Methods("GET")
	mux.HandleFunc("/api/tasks/{taskId}", mid.Auth(app.UpdatePersonalTask)).Methods("PUT")
	mux.HandleFunc("/api/tasks/{taskId}", mid.Auth(app.DeletePersonalTask)).Methods("DELETE")

	mux.HandleFunc("/api/teams", mid.Auth(app.CreateTeam)).Methods("POST")
	mux.HandleFunc("/api/teams", mid.Auth(app.GetUserTeams)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}", mid.Auth(app.GetTeam)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}", mid.Auth(app.UpdateTeam)).Methods("PATCH", "PUT")
	mux.HandleFunc("/api/teams/{teamId}", mid.Auth(app.DeleteTeam)).Methods("DELETE")

	mux.HandleFunc("/api/teams/{teamId}/members", mid.Auth(app.AddMemberToTeam)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamId}/members", mid.Auth(app.GetTeamMembers)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}/members/{userId}", mid.Auth(app.RemoveMemberFromTeam)).Methods("DELETE")

	mux.HandleFunc("/api/teams/{teamId}/tasks", mid.Auth(app.CreateTeamTask)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamId}/tasks", mid.Auth(app.GetTeamTasks)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}/tasks/{taskId}", mid.Auth(app.GetTeamTask)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}/tasks/{taskId}", mid.Auth(app.UpdateTeamTask)).Methods("PUT")
	mux.HandleFunc("/api/teams/{teamId}/tasks/{taskId}", mid.Auth(app.DeleteTeamTask)).Methods("DELETE")

	mux.HandleFunc("/api/teams/{teamId}/projects", mid.Auth(app.CreateProject)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamId}/projects", mid.Auth(app.GetProjects)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}", mid.Auth(app.GetProject)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}", mid.Auth(app.UpdateProject)).Methods("PATCH")
	mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}", mid.Auth(app.DeleteProject)).Methods("DELETE")

	/* mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}/tasks", mid.Auth(app.CreateProjectTask)).Methods("POST")
	mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}/tasks", mid.Auth(app.GetProjectTasks)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}/tasks/{taskId}", mid.Auth(app.GetProjectTask)).Methods("GET")
	mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}/tasks/{taskId}", mid.Auth(app.UpdateProjectTask)).Methods("PATCH")
	mux.HandleFunc("/api/teams/{teamId}/projects/{projectId}/tasks/{taskId}", mid.Auth(app.DeleteProjectTask)).Methods("DELETE") */

	return mux
}
