package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/jmoiron/sqlx"

	_ "github.com/lib/pq"
)

type SubjectData struct {
	AParam  float64    `json:"aValue"`
	Delays  [7]float64 `json:"delays"`
	Indiffs [7]float64 `json:"indiffVals"`
	KParam  float64    `json:"kValue"`
}

type StoredData struct {
	ID   int    `db:"id"`
	Data string `db:"data"`
}

func dataPost(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		log.Fatalln(err)
	}

	var s SubjectData

	err = json.Unmarshal(body, &s)
	if err != nil {
		log.Fatalln(err)
	}

	fmt.Println(s.KParam)

	db, err := sqlx.Connect("postgres", "user=travisjones dbname=json_test sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}

	sjson, _ := json.Marshal(s) // handle err dummy

	fmt.Println(sjson)

	_, err = db.Exec("insert into subject_data values (default, $1)", sjson)
	if err != nil {
		log.Fatalln(err)
	}

	sd := []StoredData{}
	err = db.Select(&sd, "select * from subject_data")
	if err != nil {
		log.Fatalln(err)
		return
	}

	fmt.Println(sd[0])
}

func main() {
	http.Handle("/", http.FileServer(http.Dir("./")))
	http.HandleFunc("/data", dataPost)
	http.ListenAndServe(":3000", nil)
}
