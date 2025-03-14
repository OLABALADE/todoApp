package main

import (
	"encoding/json"
	"errors"
	"github.com/OLABALADE/todoApp/backend/internal/auth"
	"github.com/OLABALADE/todoApp/backend/internal/models"
	"github.com/OLABALADE/todoApp/backend/pkg/middleware"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"strconv"
	"time"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (app *application) CreateUser(w http.ResponseWriter, r *http.Request) {
	var cred auth.Credentials
	if err := json.NewDecoder(r.Body).Decode(&cred); err != nil {
		log.Println("Could not create user:", err)
		http.Error(w, "400 - Bad Request", http.StatusBadRequest)
		return
	}

	err := app.users.Insert(cred.Username, cred.Email, cred.Password)
	if err != nil {
		if errors.Is(err, models.ErrDuplicateEmail) {
			http.Error(w, "Email already used", http.StatusBadRequest)
		} else {
			log.Println(err)
			http.Error(w, "Error occured while creating user", http.StatusInternalServerError)
		}
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"message": "Signup Successful",
	})
}

func (app *application) login(w http.ResponseWriter, r *http.Request) {
	var cred auth.Credentials
	err := json.NewDecoder(r.Body).Decode(&cred)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		log.Println(err)
		return
	}

	userId, err := app.users.Authenticate(cred.Email, cred.Password)
	if err != nil {
		if errors.Is(err, models.ErrInvalidCredential) {
			http.Error(w, "Invalid Credentials", http.StatusBadRequest)
			log.Println("Invalid Credentials")
		} else {
			log.Println(err)
		}
		return
	}

	user, err := app.users.GetUser(userId)
	if err != nil {
		log.Println("Failed to get user:", err)
		http.Error(w, "Failed to login user", http.StatusInternalServerError)
		return
	}

	token, err := auth.GenerateToken(&cred, user.Id)
	if err != nil {
		http.Error(w, "Error generating token", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(5 * time.Minute),
		HttpOnly: true,
		Secure:   true,
		Path:     "/",
		SameSite: http.SameSiteNoneMode,
	})

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"username": cred.Username,
		"message":  "Login Successful",
	})
}

func (app *application) GetUser(w http.ResponseWriter, r *http.Request) {
	userId, _ := r.Context().Value(middleware.ContextKey("userID")).(int)

	user, err := app.users.GetUser(userId)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to get user details", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(user)
}

func (app *application) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := app.users.GetUsers()
	if err != nil {
		log.Println("Failed to get users:", err)
		http.Error(w, "Could not get Users", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(users)
}

func (app *application) DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := vars["userID"]

	userId, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	err = app.users.Delete(userId)
	if err != nil {
		log.Println("Failed to delete user:", err)
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}
	w.Write([]byte("User successfully deleted"))
}

func (app *application) UpdateUser(w http.ResponseWriter, r *http.Request) {}
