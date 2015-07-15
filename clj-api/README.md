# clj-api

Web server to fetch stats from Automate


## Instalation

You need to have clojure installed on your computer. The best way to do so, is to install [leiningen](http://leiningen.org/) package manager; which is probably in your chosen package manager. Check [here](https://github.com/technomancy/leiningen/wiki/Packaging).

To start the server, on the command line go to the project's folder and run:

```bash
$ lein ring server-headless
```

This will start the server with hot reload on http://localhost:3000/.

## API

List of endpoints:

* Get Bot Stats: `/api/bots/buzz-data`


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


## License

Copyright © 2015 Mariano Cortesi

Distributed under the Eclipse Public License either version 1.0 or (at
your option) any later version.
