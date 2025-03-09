package main

import (
	"github.com/OLABALADE/todoApp/backend/pkg/middleware"
	"github.com/gorilla/mux"
)

func (app *application) routes() *mux.Router {
	mid := middleware.Middleware{}
	mux := mux.NewRouter()
	mux.HandleFunc("/", app.home).Methods("GET")

	//Tasks
	mux.HandleFunc("/user/dashboard", mid.Auth(app.dashboard)).Methods("GET")
	mux.HandleFunc("/task/delete", mid.Auth(app.deleteTask)).Methods("DELETE")
	mux.HandleFunc("/task/update", mid.Auth(app.updateTask))
	mux.HandleFunc("/task/create", mid.Auth(app.createTask)).Methods("POST")

	//User
	mux.HandleFunc("/user/signup", app.signup)
	mux.HandleFunc("/user/login", app.login).Methods("POST")
	mux.HandleFunc("/user/logout", app.logout)
	return mux
}
