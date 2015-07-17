(ns clj-api.utils)

(defn map-values
  "Given a hash-map it returns another hash-map with the values mapped with f"
  [f a-map]
  (into {} (for [[k v] a-map] [k (f v)])))
