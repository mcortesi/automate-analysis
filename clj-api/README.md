# clj-api

Web server to fetch stats from Automate


## Instalation

You need to have clojure installed on your computer. The best way to do so, is to install [leiningen](http://leiningen.org/) package manager; which is probably in your chosen package manager. Check [here](https://github.com/technomancy/leiningen/wiki/Packaging).

To start the server, on the command line go to the project's folder and run:

```bash
$ lein ring server-headless
```

This will start the server with hot reload on http://localhost:3000/.


## Configuration


### Redis

In order to use the APi you need to setup a Redis connenction.

Go to `src/clj_api/stats.clj` and find:

```clojure
(def redis-conn-data
  {
   :pool {}
   :spec {
      :host "127.0.0.1"
      :port 6380
  }
  }
)
```

Change `host` and `port` as you need. The default redis port is usually 6379.


### Mongo DB

You need to configure the connection in `src/clj_api/mongo.clj`.

Look for:


```clojure
(def configuration
  {
   :connection {:host "localhost" :port 27017 }
   :database "automate-prod"
  }
)
```

Change at will!


## API

List of endpoints:

* Get Bot Stats: `/api/bots/buzz-data`
* Get Bot stats range: `/api/bots/:bot/stats-range`
* Get Bots: `/api/bots`
* Get Bot transitions: `/api/bots/:bot/transitions`
* Get System Active Bots: `/api/system/active-bots`


### Get Bot Stats

Url: `/api/bots/buzz-data`

Query Parameters:

 * `bots`: [**required**] list of bot ids
 * `dimensions`: [**required**] list of dimensions to fetch (options: accepted, rejected, processed)
 * `granularity`: [**required**] granularity of results, options: minutes, hours, days
 * `from`: [**required**] Date where to start (format "2015-01-30T12:10:10Z")
 * `to`: [**required**] Date where to stop (format "2015-03-30T12:10:10Z")

Response:

```json
{
  "description": {
    "effective-from": "2015-01-30T12:10:00.000Z",
    "from": "2015-01-30T12:10:10.000Z",
    "to": "2015-01-31T12:10:00.000Z",
    "effective-to": "2015-01-31T12:10:00.000Z",
    "granularity": "minutes",
    "dimensions": ["accepted"],
    "bots": ["54c7c8bb7365df0300d56bcd"]
  },
  "stats": {
    "54c7c8bb7365df0300d56bcd": {
      "accepted": [123, 32, 4, ....]
    }
  }
}

```

## Get Bot stats range

Returns the range for which we have stats recorded.

Url: `/api/bots/:bot/stats-range`

Url Parameters:
 * `:bot`: bot id

Example: http://localhost:3000/api/bots/54c7c8bb7365df0300d56bcd/stats-range

Response:

```json
{
  "first": "2015-02-10T16:44:00.000Z",
  "last": "2015-02-11T11:14:00.000Z"
}
```

## Get Bots


Url: `/api/bots`

Response:

```json
[
  {
    "_id": "5466504d305858020006c7bd",
    "name": "Isobar TIM - Autoreply Internet [DESKTOP] text + image"
  },
  {
    "_id": "54665109305858020006c7bf",
    "name": "Isobar TIM - Autoreply Internet [MOBILE] text + image"
  },
  {
    "_id": "5466516a305858020006c7c1",
    "name": "Isobar TIM - Autoreply Sinal [DESKTOP] text + image"
  },
  ...
]
```

## Get Bot Transitions

Url: `/api/bots/:bot/transitions`

Url Parameters:
 * `:bot`: bot id

Response:

```json
[
  {
  "to": "stopped",
  "date": "2015-03-03T13:39:10Z"
  }
]
```
## Get System active bots

Get the data series of amount of active bots.

It returns a list of pairs with `date` and `amount of active bots`.

Url: `/api/system/active-bots`

Response:

```json
[
  [
    "2014-12-29T17:13:05Z",
    1
  ],
  [
    "2014-12-29T17:45:54Z",
    0
  ],
  [
    "2014-12-29T18:58:05Z",
    1
  ],
  ...
]
```


## License

Copyright © 2015 Mariano Cortesi

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
