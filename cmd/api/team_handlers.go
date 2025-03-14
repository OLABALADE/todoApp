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

type MemberRequest struct {
	UserId int `json:"user_id"`
}

func (app *application) CreateTeam(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value(middleware.ContextKey("userID")).(int)
	nt := &models.Team{}
	err := json.NewDecoder(r.Body).Decode(nt)
	if err != nil {
		http.Error(w, "Could not create team", http.StatusBadRequest)
		return
	}

	id, err := app.teams.Insert(nt.Name, nt.Description, userId)
	if err != nil {
		log.Println(err)
		http.Error(w, "Error occured while creating team", http.StatusInternalServerError)
		return
	}

	team, err := app.teams.GetTeam(id)
	if err != nil {
		log.Println("Could not get newly created team:", err)
		http.Error(w, "Could not get newly created team", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(&team)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to send team details", http.StatusInternalServerError)
		return
	}
}

func (app *application) GetTeam(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := vars["teamID"]

	teamId, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	team, err := app.teams.GetTeam(teamId)
	if err != nil {
		log.Println("Failed to get team:", err)
		http.Error(w, "Failed to get team", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(team)
}

func (app *application) GetUserTeams(w http.ResponseWriter, r *http.Request) {
	userId, _ := r.Context().Value(middleware.ContextKey("userId")).(int)

	teams, err := app.teams.GetTeams(userId)
	if err != nil {
		log.Println("Failed to get Teams:", err)
		http.Error(w, "Error while getting team", http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(teams)
	if err != nil {
		log.Println("Failed to encode json:", err)
		http.Error(w, "Error while getting teams", http.StatusInternalServerError)
		return
	}
}

func (app *application) UpdateTeam(w http.ResponseWriter, r *http.Request) {
}

func (app *application) DeleteTeam(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := vars["teamID"]
	teamId, err := strconv.Atoi(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Id parameter should be a number", http.StatusBadRequest)
		return
	}

	err = app.teams.Delete(teamId)
	if err != nil {
		log.Println("Failed to delete team:", err)
		http.Error(w, "Failed to delete team", http.StatusInternalServerError)
		return
	}
	w.Write([]byte("Team successfully deleted"))
}

func (app *application) AddMemberToTeam(w http.ResponseWriter, r *http.Request) {
	mr := &MemberRequest{}
	err := json.NewDecoder(r.Body).Decode(mr)

	if err != nil {
		log.Println(err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	id, _ := vars["teamID"]
	teamId, err := strconv.Atoi(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Invalid request, id parameter is not a number", http.StatusBadRequest)
		return
	}

	err = app.teams.AddMember(teamId, mr.UserId)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to add member to group", http.StatusInternalServerError)
		return
	}
	w.Write([]byte("Member added successfully"))
}

func (app *application) GetTeamMembers(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := vars["teamID"]
	teamId, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	members, err := app.teams.GetMembers(teamId)
	if err != nil {
		log.Println("Failed to get team members")
		http.Error(w, "Error while getting team members", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(members)
}

func (app *application) RemoveMemberFromTeam(w http.ResponseWriter, r *http.Request) {
	mr := &MemberRequest{}
	err := json.NewDecoder(r.Body).Decode(mr)

	if err != nil {
		log.Println(err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	vars := mux.Vars(r)
	id, _ := vars["teamID"]
	teamId, err := strconv.Atoi(id)
	if err != nil {
		log.Println(err)
		http.Error(w, "Invalid request, id parameter is not a number", http.StatusBadRequest)
		return
	}

	err = app.teams.RemoveMember(teamId, mr.UserId)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to remove member to group", http.StatusInternalServerError)
		return
	}
	w.Write([]byte("Member removed successfully"))
}
