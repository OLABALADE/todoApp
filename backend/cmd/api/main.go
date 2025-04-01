package main

import (
	"context"
	"crypto/tls"
	"flag"
	"fmt"
	"github.com/OLABALADE/todoApp/backend/internal/models"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/cors"
	"log"
	"net/http"
	"os"
	"time"
)

type application struct {
	tasks    *models.TaskModel
	users    *models.UserModel
	teams    *models.TeamModel
	projects *models.ProjectModel
}

var db *pgxpool.Pool

func main() {
	addr := flag.String("addr", ":3000", "Port Number")
	flag.Parse()

	poolConfig, err := pgxpool.ParseConfig(os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Fatal("Unable to parse DATABASE_URL:", err)
	}

	db, err = pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		log.Fatal("Could not connect to database:", err)
	}
	defer db.Close()

	tlsConfig := &tls.Config{
		CurvePreferences: []tls.CurveID{tls.X25519, tls.CurveP256},
	}

	App := application{
		tasks: &models.TaskModel{DB: db},
		users: &models.UserModel{DB: db},
		teams: &models.TeamModel{DB: db},
	}

	corsMid := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"},
		AllowedHeaders:   []string{"*"},
	})

	server := http.Server{
		Addr:         *addr,
		Handler:      corsMid.Handler(App.routes()),
		TLSConfig:    tlsConfig,
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Minute,
		WriteTimeout: 10 * time.Second,
	}

	fmt.Println("Listening at port", server.Addr)
	http.ListenAndServe(*addr, server.Handler)
}
