package schemas

import "time"

type TaskRequest struct {
	Id          int    `json:"taskId,omitempty"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Type        string `json:"taskType"`
	Status      string `json:"status"`
	Priority    string `json:"priority"`
	SDueDate    string `json:"dueDate"`
	DueDate     time.Time
	CreatorId   int `json:"creatorId"`
	TeamId      int `json:"teamId,omitempty"`
	AssigneeId  int `json:"assigneeId,omitempty"`
	ProjectId   int `json:"projectId,omitempty"`
}

type TaskResponse struct {
	Id          int       `json:"taskId"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Type        string    `json:"taskType"`
	Status      string    `json:"status"`
	Priority    string    `json:"priority"`
	DueDate     time.Time `json:"dueDate"`
	TeamId      int       `json:"teamId,omitempty"`
	CreatorId   int       `json:"creatorId"`
	Created     time.Time `json:"created_at"`
	Assignee    struct {
		Id   int    `json:"userId"`
		Name string `json:"username"`
	} `json:"assignee,omitempty"`
}
