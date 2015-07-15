(ns clj-api.core
  (:use
    [ring.adapter.jetty :only (run-jetty)]
    [clj-api.handlers :only (app)]
  )
)

(defn -main [& args]
  (run-jetty #'app {:port 8080 :join? false})
)
