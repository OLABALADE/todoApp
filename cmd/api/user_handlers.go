package main

import (
	"encoding/json"
	"errors"
	"github.com/OLABALADE/todoApp/backend/internal/auth"
	"github.com/OLABALADE/todoApp/backend/internal/models"
	"github.com/OLABALADE/todoApp/backend/pkg/middleware"
	"log"
	"net/http"
	"time"
)

func (app *application) home(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		w.WriteHeader(http.StatusNotFound)
		return
	}
}

func (app *application) dashboard(w http.ResponseWriter, r *http.Request) {
	email, ok := r.Context().Value(middleware.ContextKey("email")).(string)
	if !ok {
		log.Println("No email present")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	user, err := app.users.GetUser(email)

	if err != nil {
		log.Println("No user found with such email:", email, err)
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	tasks, err := app.tasks.CurrentTasks(user.Name)
	if err != nil {
		log.Println(err)
		http.Error(w, "Unauthorized ", http.StatusUnauthorized)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(tasks)

}

func (app *application) signup(w http.ResponseWriter, r *http.Request) {
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

	cred.Username, err = app.users.Authenticate(cred.Email, cred.Password)
	if err != nil {
		if errors.Is(err, models.ErrInvalidCredential) {
			http.Error(w, "Invalid Credentials", http.StatusBadRequest)
			log.Println("Invalid Credentials")
		} else {
			log.Println(err)
		}
		return
	}

	token, err := auth.GenerateToken(&cred)
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

func (app *application) logout(w http.ResponseWriter, r *http.Request) {}
