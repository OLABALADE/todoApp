package models

import "errors"

var ErrInvalidCredential = errors.New("Invalid Credentials")
var ErrDuplicateEmail = errors.New("Duplicate Email")
