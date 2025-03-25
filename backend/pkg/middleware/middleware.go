package middleware

import (
	"context"
	"errors"
	"github.com/OLABALADE/todoApp/backend/internal/auth"
	"github.com/dgrijalva/jwt-go"
	"log"
	"net/http"
)

type Middleware struct{}
type ContextKey string

var idKey ContextKey = "userID"

func (m Middleware) Auth(next http.HandlerFunc) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenCookie, err := r.Cookie("token")
		if err != nil {
			if errors.Is(err, http.ErrNoCookie) {
				w.WriteHeader(http.StatusUnauthorized)
				log.Println("Missing token")
				return
			}
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		tokenString := tokenCookie.Value
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			log.Println("Validation failed")
			if errors.Is(err, jwt.ErrSignatureInvalid) {
				http.Error(w, "Unexpected signing signature", http.StatusUnauthorized)
				return
			} else {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
		}

		r = r.WithContext(context.WithValue(r.Context(), idKey, claims.UserId))

		next.ServeHTTP(w, r)
	})
}
