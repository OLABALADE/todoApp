package main

import (
	"encoding/json"
	"github.com/OLABALADE/todoApp/backend/pkg/middleware"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
)

type ProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (app *application) CreateProject(w http.ResponseWriter, r *http.Request) {
	userId, _ := r.Context().Value(middleware.ContextKey("userID")).(int)
	vars := mux.Vars(r)
	id, _ := vars["teamID"]
	teamId, err := strconv.Atoi(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	pr := &ProjectRequest{}
	err = json.NewDecoder(r.Body).Decode(pr)
	if err != nil {
		http.Error(w, "Invalid Request body", http.StatusBadRequest)
		return
	}

	projectId, err := app.projects.Insert(pr.Name, pr.Description, teamId, userId)
	if err != nil {
		log.Println("Failed to Create Project:", err)
		http.Error(w, "Failed to Create Project", http.StatusInternalServerError)
		return
	}

	project, err := app.projects.GetProject(teamId, projectId)
	if err != nil {
		log.Println("Failed to get project details:", err)
		http.Error(w, "Failed to send project details", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(project)
}

func (app *application) GetProject(w http.ResponseWriter, r *http.Request) {
	tId, _ := mux.Vars(r)["teamID"]
	pId, _ := mux.Vars(r)["projectID"]

	teamId, err1 := strconv.Atoi(tId)
	projectId, err2 := strconv.Atoi(pId)
	if err1 != nil && err2 != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	project, err := app.projects.GetProject(teamId, projectId)
	if err != nil {
		log.Println("Failed to get projects:", err)
		http.Error(w, "Failed to fetch project details", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(project)
}

func (app *application) GetProjects(w http.ResponseWriter, r *http.Request) {
	tId, _ := mux.Vars(r)["teamID"]

	teamId, err := strconv.Atoi(tId)
	if err != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	projects, err := app.projects.GetProjects(teamId)
	if err != nil {
		log.Println("Failed to get team projects:", err)
		http.Error(w, "Failed to fetch team projects", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(projects)
}

func (app *application) UpdateProject(w http.ResponseWriter, r *http.Request) {}
func (app *application) DeleteProject(w http.ResponseWriter, r *http.Request) {
	tId, _ := mux.Vars(r)["teamID"]
	pId, _ := mux.Vars(r)["projectID"]

	teamId, err1 := strconv.Atoi(tId)
	projectId, err2 := strconv.Atoi(pId)
	if err1 != nil && err2 != nil {
		http.Error(w, "Invalid URL", http.StatusBadRequest)
		return
	}

	err := app.projects.DeleteProject(teamId, projectId)
	if err != nil {
		log.Println("Failed to delete project:", err)
		http.Error(w, "Project failed to delete", http.StatusInternalServerError)
		return
	}
}
