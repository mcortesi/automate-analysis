(ns clj-api.handlers
  (:use
   [compojure.core :only (GET PUT POST defroutes)]
   [clj-api.stats :only (get-stats-data-series)])
  (:require
   (compojure handler route)
   [ring.util.response :as response]
   [ring.middleware.json :as middleware]
   [clj-time.format :as tf]))

;(defn retain
;  [& [url id :as args]]
;  (if-let [id (apply shorten! args)]
;    {:status 201
;     :headers {"Location" id}
;     :body (list "URL " url " assigned the short identifier " id)}
;    {:status 409 :body (format "Short URL %s is already taken" id)}))

(defn hello [name]
  {
    :status 200
    :body (str "Hello " name ", urray!")
  }
)

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


;; (def fake-params {:bots "123124"
;;                   :granularity "by-day"
;;                   :from "2015-01-10T12:10:10Z"
;;                   :to "2015-01-10T12:10:10Z"
;;                   :dimensions ["replies" "errors"]
;;                   })


;; ((comp get-stats normalize-parameters) fake-params )

(defroutes app*
  (GET "/api/:name" [name] (hello name))
  (GET "/api/bots/buzz-data"
       [& params]
       {
        :status 200
        :body (get-stats (normalize-parameters params))
        })
  (compojure.route/not-found "Sorry, there's nothing here.")
)

(def app
  (-> app*
      (middleware/wrap-json-body)
      (middleware/wrap-json-response)
      (compojure.handler/api)))
