package main

import (
	"context"
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/OLABALADE/TodoApp/internal/models"
	"github.com/jackc/pgx/v5"
	"github.com/rs/cors"
)

type application struct {
	tasks *models.TaskModel
}

func main() {
	addr := flag.String("addr", ":3000", "Port Number")
	flag.Parse()

	conn, err := pgx.Connect(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer conn.Close(context.Background())

	app := application{
		tasks: &models.TaskModel{DB: conn},
	}

	server := http.Server{
		Addr:    *addr,
		Handler: cors.Default().Handler(app.routes()),
	}

	fmt.Println("Listening at port", server.Addr)
	http.ListenAndServe(*addr, server.Handler)
}
