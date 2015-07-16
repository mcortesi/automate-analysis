(ns clj-api.mongo
  (:require
            [monger.json]
            [monger.core :as mg]
            [monger.collection :as mc])
  (:import [com.mongodb MongoOptions ServerAddress]
           [org.bson.types ObjectId]))

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


(defn get-bot [^String botId & [fields]]
  (if (empty? fields)
    (mc/find-map-by-id db bot-col (ObjectId. botId))
    (mc/find-map-by-id db bot-col (ObjectId. botId) fields)))

(defn get-bots [& [fields]]
  (if (empty? fields)
    (mc/find-maps db bot-col)
    (mc/find-maps db bot-col nil fields)))

(defn get-bots-short [] (get-bots [:_id :name]))


(defn get-bot-transitions [botId]
  (let
    [bot (get-bot botId [:transitions])]
    (map #(select-keys % [:date :to]) (:transitions bot))))

(get-bot-transitions "5466504d305858020006c7bd")

(defn extract-processing-intervals [bots]
  "Given a seq of bots with their transitions, it returns a sorted list of intervals [from to]
   showing when there was a bot in processing state"
  (let
    [augment-transitions
       (fn [transitions]
         (map #(assoc % :end-date (:date %2)) transitions (rest transitions)))
     transitions (flatten (map (comp augment-transitions :transitions) bots))
     is-processing #(#{"processing" "processing_with_f2u"} (:to %))
     sorted-processing (sort-by :date (filter is-processing transitions))
     ]
    (map #(vector (:date %) (:end-date %)) sorted-processing)))

(defn extract-active-bots-intervals
  "Given a seq of bots with ther transitions, it returns a sorted list of [start-date active-bots]
   showing how many active bots where a that starting date."
  [bots]
  (let
    [processing-intervals (extract-processing-intervals bots)
     starts (map #(vector % 1) (map first processing-intervals)) ; list of [start-date 1]
     ends (map #(vector % -1) (sort (map second processing-intervals))) ; list of [end-date -1]
     all-changes (sort-by first (concat starts ends))
    ]
    (loop [active 0 changes all-changes result []]
      (if (seq changes)
        (let [[from diff] (first changes)
              new-active (+ active diff)]
          (recur new-active (rest changes) (conj result [from new-active])))
        result))
  ))


(defn get-active-bots-intervals [] (extract-active-bots-intervals (get-bot-transitions)))

;; (apply max (map second (extract-active-bots-intervals (get-bot-transitions))))


;; (keys  (mc/find-one-as-map db bot-col nil))

;; (get-bots)
