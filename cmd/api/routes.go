package main

import (
	"github.com/gorilla/mux"
)

func (app *application) routes() *mux.Router {
	mux := mux.NewRouter()
	mux.HandleFunc("/", app.home).Methods("GET")
	mux.HandleFunc("/task/create", app.createTask)
	mux.HandleFunc("/task/delete/{id}", app.deleteTask)
	mux.HandleFunc("/task/update/{id}", app.updateTask)
	mux.HandleFunc("/task/view/{id}", app.viewTask)

	return mux
}
