package schemas

import "time"

type TeamRequest struct {
	Id          int    `json:"teamId"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type TeamResponse struct {
	Id          int               `json:"teamId"`
	Name        string            `json:"name"`
	Description string            `json:"description"`
	Members     []*MemberResponse `json:"members"`
	Creator     string            `json:"creator"`
	Created     time.Time         `json:"createdAt"`
}

type MemberRequest struct {
	UserId int `json:"userId"`
}

type MemberResponse struct {
	Id   int    `json:"userId"`
	Name string `json:"username"`
	Role string `json:"role"`
}
