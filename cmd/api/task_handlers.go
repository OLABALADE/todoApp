package main

import (
	"encoding/json"
	"github.com/OLABALADE/todoApp/backend/internal/models"
	"github.com/OLABALADE/todoApp/backend/pkg/middleware"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

func (app *application) CreatePersonalTask(w http.ResponseWriter, r *http.Request) {
	userId, _ := r.Context().Value(middleware.ContextKey("id")).(int)

	tf := &models.Task{}
	err := json.NewDecoder(r.Body).Decode(tf)
	if err != nil {
		log.Println("Could not decode json request:", err)
		http.Error(w, "400 - Bad Request", http.StatusBadRequest)
		return
	}

	tf.CreatorId = userId
	taskId, err := app.tasks.InsertPersonalTask(tf)
	if err != nil {
		log.Println("Personal Task not created:", err)
		http.Error(w, "Personal Task not created", http.StatusNotImplemented)
		return
	}

	lastTask, err := app.tasks.GetPersonalTask(taskId)
	if err != nil {
		log.Println("Failed to fetch newly created task")
		http.Error(w, "Failed to fetch newly created task", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(lastTask)
	if err != nil {
		log.Println("Failed to send newly created task")
		http.Error(w, "Failed to send newly created task", http.StatusInternalServerError)
		return
	}
}

func (app *application) GetPersonalTasks(w http.ResponseWriter, r *http.Request) {
	userId, _ := r.Context().Value(middleware.ContextKey("id")).(int)

	personalTasks, err := app.tasks.GetPersonalTasks(userId)
	if err != nil {
		log.Println("Error while getting personal Tasks:", err)
		http.Error(w, "Could not get Personal tasks", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(personalTasks)
	if err != nil {
		log.Println("Error while encoding json:", err)
		http.Error(w, "Error occured while sending data", http.StatusInternalServerError)
		return
	}
}

func (app *application) GetPersonalTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := vars["taskID"]

	taskId, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	task, err := app.tasks.GetPersonalTask(taskId)
	if err != nil {
		log.Println("Could not get task:", err)
		http.Error(w, "Could not get task", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(task)
	if err != nil {
		log.Println("Error while encoding json:", err)
		http.Error(w, "Error occured while sending data", http.StatusInternalServerError)
		return
	}
}

func (app *application) UpdatePersonalTask(w http.ResponseWriter, r *http.Request) {
}

func (app *application) DeletePersonalTask(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := vars["taskID"]

	taskId, err := strconv.Atoi(id)
	if err != nil {
		log.Println("Error in converting id parameter:", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	err = app.tasks.DeletePersonalTask(taskId)
	if err != nil {
		log.Println("Error occured when deleting task", err)
		http.Error(w, "Error occured when deleting task", http.StatusInternalServerError)
		return
	}
}

// //////////////////// Project Tasks //////////////////////////
func (app *application) CreateProjectTask(w http.ResponseWriter, r *http.Request) {
	userId, _ := r.Context().Value(middleware.ContextKey("userID")).(int)
	tId, _ := mux.Vars(r)["teamID"]
	pId, _ := mux.Vars(r)["projectID"]

	teamId, err1 := strconv.Atoi(tId)
	projectId, err2 := strconv.Atoi(pId)
	if err1 != nil && err2 != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	task := &models.Task{}
	err := json.NewDecoder(r.Body).Decode(task)
	if err != nil {
		http.Error(w, "Invalid Request body", http.StatusBadRequest)
		return
	}

	task.TeamId = teamId
	task.ProjectId = projectId
	task.CreatorId = userId
	project, err := app.tasks.InsertProjectTask(task)
	if err != nil {
		log.Println("Failed to create project task:", err)
		http.Error(w, "Failed to create project tasks", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(project)

}

func (app *application) GetProjectTask(w http.ResponseWriter, r *http.Request) {
	tmId, _ := mux.Vars(r)["teamID"]
	pId, _ := mux.Vars(r)["projectID"]
	tkId, _ := mux.Vars(r)["taskID"]

	teamId, err1 := strconv.Atoi(tmId)
	projectId, err2 := strconv.Atoi(pId)
	taskId, err3 := strconv.Atoi(tkId)
	if err1 != nil && err2 != nil && err3 != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	task, err := app.tasks.GetProjectTask(teamId, projectId, taskId)
	if err != nil {
		log.Println("Failed to get Project task:", err)
		http.Error(w, "Error when gettint project task", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(task)

}

func (app *application) GetProjectTasks(w http.ResponseWriter, r *http.Request) {
	tId, _ := mux.Vars(r)["teamID"]
	pId, _ := mux.Vars(r)["projectID"]

	teamId, err1 := strconv.Atoi(tId)
	projectId, err2 := strconv.Atoi(pId)
	if err1 != nil && err2 != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	tasks, err := app.tasks.GetProjectTasks(teamId, projectId)
	if err != nil {
		log.Println("Failed to get project tasks:", err)
		http.Error(w, "Error while fetching project tasks", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(tasks)
}

func (app *application) DeleteProjectTask(w http.ResponseWriter, r *http.Request) {
	tmId, _ := mux.Vars(r)["teamID"]
	pId, _ := mux.Vars(r)["projectID"]
	tkId, _ := mux.Vars(r)["taskID"]

	teamId, err1 := strconv.Atoi(tmId)
	projectId, err2 := strconv.Atoi(pId)
	taskId, err3 := strconv.Atoi(tkId)
	if err1 != nil && err2 != nil && err3 != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	err := app.tasks.DeleteProjectTask(teamId, projectId, taskId)
	if err != nil {
		log.Println("Failed delete project task:", err)
		http.Error(w, "Error when deleting project task", http.StatusInternalServerError)
		return
	}
}

func (app *application) UpdateProjectTask(w http.ResponseWriter, r *http.Request) {}
