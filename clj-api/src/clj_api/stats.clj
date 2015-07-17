(ns clj-api.stats
  (:use [clj-api.utils :only [map-values]])
  (:require
     [taoensso.carmine :as car :refer (wcar)]
     [clj-time.core :as t]
     [clj-time.format :as tf]
     [clj-time.periodic :as tp])
)

; Default redis connection Data
(def redis-conn-data
  {
   :pool {}
   :spec {
          :host "127.0.0.1"
          :port 6380
          }
   }
  )

; Date Formater to create/interpret redis fields
(def to-field-formatter (tf/formatter "yyyyMMddHHmm"))


; Macro that uses default redis connection to call redis
(defmacro wcar* [& body] `(car/wcar redis-conn-data ~@body))


(defn redis-key-for
  "creates a stats redis key"
  [botId kind] (str "stats:" botId kind) )


(defn trucate-to-minutes
  "Returns a copy of the date truncated to minutes"
  [date]
  (-> date .minuteOfHour .roundFloorCopy)
  )

(defn redis-fields-for-interval [from to]
  "Returns a seq of all fields for a given from-to interval.
   It a close range for 'from' and open for 'to'"
  (let
    [from (trucate-to-minutes from)
     to (trucate-to-minutes to)
     minutes-in-interval (t/in-minutes (t/interval from to))
     to-field (partial tf/unparse to-field-formatter)]
    (->> (tp/periodic-seq from (t/minutes 1))
         (map to-field)
         (take minutes-in-interval))))

(defn redis-fetch-fields-for [redis-key fields]
  "Returns all the given fields for a redis-key"
  (let
    [zero-or-number
       (fn [x]
         (if (nil? x)
           0
           (Integer/parseInt x)))]
    (map zero-or-number
         (wcar* (apply (partial car/hmget redis-key) fields)))))


(defn agregate-stats
  [by-minute-stats aggregation]
  (let
    [step (case aggregation
            :minutes 1
            :hours 60
            :days (* 24 60))
     partitions (partition step step nil by-minute-stats)]

    (map (partial apply +) partitions)))


(defn get-stats-data-series
  [bot & {:keys [kinds from to granularity] :or {granularity :minutes}}]
  (let
    [redis-fields (redis-fields-for-interval from to)
     stats-for-kind
       (fn [kind]
         (agregate-stats
            (redis-fetch-fields-for (redis-key-for bot kind) redis-fields)
            granularity))
     stats-by-kind (map-values stats-for-kind kinds)
     ]
    stats-by-kind
    ))


(defn get-stats-range
  "Retrieves the first and last date for where the Bot has stats"
  [bot]
  (let
    [to-date (partial tf/parse to-field-formatter)
     all-keys (wcar* (car/hkeys (redis-key-for bot :processed)))
     sorted-dates (sort (map to-date all-keys))
     ]
    [(first sorted-dates) (last sorted-dates)]
  ))


;; Example:
;; (def bot "54c7c8bb7365df0300d56bcd")
;; (def from (tf/parse to-field-formatter "201502101645"))
;; (def to (t/plus from (t/hours 4)))

;; (get-stats-range bot)
;; (get-stats-data-series bot
;;                        :kinds [:accepted :rejected]
;;                        :from from
;;                        :to to
;;                        :granularity :minutes)


