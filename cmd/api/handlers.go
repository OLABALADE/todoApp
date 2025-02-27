package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jackc/pgx/v5"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	tasks, err := app.tasks.Undone()
	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func (app *application) createTask(w http.ResponseWriter, r *http.Request) {
	err := r.ParseForm()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
	}

	title := r.PostForm.Get("title")
	desc := r.PostForm.Get("desc")
	author := r.PostForm.Get("author")

	err = app.tasks.Insert(title, desc, author)

	if err != nil {
		log.Println(err)
		return
	}
}

func (app *application) deleteTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])
	err := app.tasks.Delete(id)

	if err != nil {
		log.Println(err)
		return
	}
}

func (app *application) updateTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	vals := r.URL.Query()
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("400 - Bad Request"))
		return
	}

	_, ok := vals["completed"]
	if ok {
		err := app.tasks.Update(id)
		if err != nil {
			log.Println("Error occured when executing query", err)
			return
		}
	} else {
		w.Write([]byte("Error occured while updating task"))
		return
	}

}

func (app *application) viewTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil || id < 1 {
		w.WriteHeader(http.StatusNotFound)
		w.Write([]byte("404 - Page not found."))
	}

	task, err := app.tasks.Get(id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			w.WriteHeader(http.StatusNotFound)
			w.Write([]byte("404 - Page not found."))
			return
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("500 - Internal Server Error."))
			log.Println(err)
			return
		}
	}

	json.NewEncoder(w).Encode(task)
}
