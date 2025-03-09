package main

import (
	"encoding/json"
	"github.com/OLABALADE/todoApp/backend/internal/models"
	"log"
	"net/http"
)

func (app *application) createTask(w http.ResponseWriter, r *http.Request) {
	tf := &models.TaskForm{}
	err := json.NewDecoder(r.Body).Decode(tf)
	if err != nil {
		log.Println("Could not decode json request:", err)
		http.Error(w, "400 - Bad Request", http.StatusBadRequest)
		return
	}

	id, err := app.tasks.Insert(tf.Title, tf.Desc, tf.Author)
	if err != nil {
		log.Println("Task not created:", err)
		http.Error(w, "Task not created", http.StatusNotImplemented)
		return
	}

	lastTask, err := app.tasks.Get(id)
	if err != nil {
		log.Println("Failed to fetch newly created task")
		http.Error(w, "Failed to fetch newly created task", http.StatusInternalServerError)
	}

	err = json.NewEncoder(w).Encode(lastTask)
	if err != nil {
		log.Println("Failed to send newly created task")
		http.Error(w, "Failed to send newly created task", http.StatusInternalServerError)
	}
}

func (app *application) deleteTask(w http.ResponseWriter, r *http.Request) {
	oldTask := &models.Task{}
	err := json.NewDecoder(r.Body).Decode(oldTask)
	if err != nil {
		log.Println("Unable to decode json request:", err)
		http.Error(w, "Unable to decode json request", http.StatusBadRequest)
	}

	err = app.tasks.Delete(oldTask.ID)
	if err != nil {
		log.Println("Error occured when deleting task", err)
		http.Error(w, "Error occured when deleting task", http.StatusInternalServerError)
		return
	}
}

func (app *application) updateTask(w http.ResponseWriter, r *http.Request) {
	oldTask := &models.Task{}
	err := json.NewDecoder(r.Body).Decode(oldTask)
	if err != nil {
		http.Error(w, "400 - Bad Request", http.StatusBadRequest)
		return
	}

	err = app.tasks.Update(oldTask.ID)
	if err != nil {
		log.Println("Error occured while creating task:", err)
		http.Error(w, "Error occured while creating task", http.StatusInternalServerError)
		return
	}
}
