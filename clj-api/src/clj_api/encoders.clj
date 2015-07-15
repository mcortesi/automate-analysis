(ns clj-api.encoders
  (:require [cheshire.core :refer :all]
            [cheshire.generate :refer [add-encoder encode-str remove-encoder]]
            [clj-time.core :as t]))


;; Encoder for Joda Time
(add-encoder org.joda.time.DateTime
             (fn [c jsonGenerator]
               (.writeString jsonGenerator (.toString c))))


