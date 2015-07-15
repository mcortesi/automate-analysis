(defproject clj-api "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [javax.servlet/servlet-api "2.5"]
                 [ring "1.4.0-RC2"]
                 [ring/ring-json "0.3.1"]
                 [compojure "1.3.4"]
                 [com.taoensso/carmine "2.11.1"]
                 [clj-time "0.8.0"]]
  :plugins [[lein-ring "0.9.6"]]
  :ring {:handler clj-api.handlers/app}
)
