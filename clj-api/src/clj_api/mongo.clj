(ns clj-api.mongo
  (:require
            [monger.json]
            [monger.core :as mg]
            [monger.collection :as mc])
  (:import [com.mongodb MongoOptions ServerAddress]))

;; given host, given port
(def configuration
  {
   :connection {:host "localhost" :port 27017 }
   :database "automate-prod"
  }
)


(def conn (mg/connect (:connection configuration)))

(def db (mg/get-db conn (:database configuration)))

(def bot-col "actions")

;; disconnect example
;; (let [conn (mg/connect)]
;;   (mg/disconnect conn))

(defn get-bots-short
  []
  (mc/find-maps db bot-col nil [:_id :name])
)


;; (keys  (mc/find-one-as-map db bot-col nil))

;; (get-bots)
