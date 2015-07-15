(ns clj-api.handlers
  (:use
   [compojure.core :only (GET PUT POST defroutes)]
   [clj-api.stats :only (get-stats-data-series get-stats-range)]
   [clj-api.mongo :only (get-bots-short)])
  (:require
   [clj-api.encoders] ;cheshire encoders
   [compojure handler route]
   [ring.util.response :as response]
   [ring.middleware.json :as middleware]
   [clj-time.format :as tf]))


(defn truncate-to [date dimension]
  (let
    [get-property
       (case dimension
         :minutes (fn [d] (.minuteOfHour d))
         :hours   (fn [d] (.hourOfDay d))
         :days    (fn [d] (.dayOfMonth d)))]

  (-> date get-property .roundFloorCopy)))


(defn tr-dimension [dimension-param]
  (case dimension-param
    "accepted"   :accepted
    "rejected"    :rejected
    "processed" :processed))


(defn tr-granularity [granularity-param]
  (case granularity-param
    "by-min"  :minutes
    "by-hour" :hours
    "by-day"  :days))

(def date-formatter (tf/formatter "yyyy-MM-dd'T'HH:mm:ss'Z'"))

(defn parse-date [date-str]
  (tf/parse date-formatter date-str))

;(parse-date "2015-01-30T12:10:10Z")


(defn get-stats
  [{:keys [bots dimensions granularity from to]}]
  (let
    [stats-map
       (into {}
             (for [bot bots]
                  [bot
                    (get-stats-data-series
                       bot
                       :kinds dimensions
                       :granularity granularity
                       :from from
                       :to to)]))
     ]
    {
     :description
      {
        :effective-from (.toString (truncate-to from granularity))
        :from (.toString from)
        :to (.toString to)
        :effective-to (.toString (truncate-to to granularity))
        :granularity granularity
        :dimensions dimensions
        :bots bots
      }
     :stats stats-map
    }
  ))


(defn normalize-parameters
  [{:keys [bots dimensions granularity from to]
      or {dimensions ["replies"] granularity "by-min"}}]
  (let
    [as-vector (fn [x] (if (vector? x) x [x]))]
  {
   :from (parse-date from)
   :to (parse-date to)
   :bots (as-vector bots)
   :granularity (tr-granularity granularity)
   :dimensions (map tr-dimension (as-vector dimensions))
  }
))


(defroutes routes
  (GET "/api/bots/" [] (response/response (get-bots-short)))
  (GET "/api/bots/buzz-data" [& params]
       (response/response (get-stats (normalize-parameters params))))
  (GET "/api/bots/:bot/stats-range" [bot]
       (response/response (zipmap [:first :last] (get-stats-range bot))))
  (compojure.route/not-found "Sorry, there's nothing here.")
)

(def app
  (-> routes
      (middleware/wrap-json-body)
      (middleware/wrap-json-response)
      (compojure.handler/api)))
