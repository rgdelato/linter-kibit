# linter-kibit

This linter plugin for Linter provides an interface to [kibit](https://github.com/jonase/kibit). It will be used with files that have the "Clojure" syntax.

## Installation

Before using this package you will need to have [Leiningen](https://leiningen.org/) installed and available from your `$PATH`.

You will also need to merge the following into your `$HOME/.lein/profiles.clj` file:
```clojure
{:user {:plugins [[lein-kibit "0.1.3"]]}}
```
