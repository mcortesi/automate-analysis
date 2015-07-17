(ns clj-api.handlers
  (:use
   [clojure.string :only (split)]
   [compojure.core :only (GET PUT POST defroutes)])
  (:require
   [clj-api.mongo :as mongo]
   [clj-api.stats :as stats]
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
    "accepted"  :accepted
    "rejected"  :rejected
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
                    (stats/get-stats-data-series
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
    [as-vector (fn [x] (split x #","))]
  {
   :from (parse-date from)
   :to (parse-date to)
   :bots (as-vector bots)
   :granularity (tr-granularity granularity)
   :dimensions (map tr-dimension (as-vector dimensions))
  }
))


(defroutes routes
  (GET "/api/system/active-bots" [] (response/response (mongo/get-active-bots-intervals)))
  (GET "/api/system/active-bots-by-kind" [] (response/response (mongo/get-active-bots-intervals-by-kind)))
  (GET "/api/bots" [] (response/response (mongo/get-bots-short)))
  (GET "/api/bots/buzz-data" [& params]
       (response/response (get-stats (normalize-parameters params))))
  (GET "/api/bots/:bot/stats-range" [bot]
       (response/response (zipmap [:first :last] (stats/get-stats-range bot))))
  (GET "/api/bots/:bot/transitions" [bot]
       (response/response (mongo/get-bot-transitions bot)))
  (compojure.route/not-found "Sorry, there's nothing here.")
)


(defn wrap-cors-header
  [handler]
  (fn [request]
    (response/header (handler request) "Access-Control-Allow-Origin" "*")))

(def app
  (-> routes
      (middleware/wrap-json-body)
      (middleware/wrap-json-response)
      (wrap-cors-header)
      (compojure.handler/api)))
