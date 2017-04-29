"use babel";

import { CompositeDisposable } from "atom";

let leinExecutablePath;

export default {
  activate() {
    require("atom-package-deps").install("linter-kibit");

    const linterName = "linter-kibit";

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.config.observe(`${linterName}.leinExecutablePath`, value => {
        leinExecutablePath = value;
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    const helpers = require("atom-linter");
    const namedRegexp = require("named-js-regexp");

    return {
      name: "kibit",
      scope: "file", // or 'project'
      lintsOnChange: false, // or true
      grammarScopes: ["source.clojure"],
      lint(textEditor) {
        const editorPath = textEditor.getPath();

        return helpers
          .exec(leinExecutablePath, ["kibit", editorPath], {
            stream: "both"
          })
          .then(function(data) {
            const { exitCode, stdout, stderr } = data;

            // console.log("linter-kibit: data", data);

            if (exitCode === 0) {
              return [];
            }

            if (exitCode === 1 && stdout && !stderr) {
              const regex = /[^:]+:(\d+):\nConsider using:\n([\s\S]+)\ninstead of:\n([\s\S]+)/;

              const messages = stdout
                .split("\n\n")
                .map(function(kibit) {
                  const exec = regex.exec(kibit);

                  if (!exec) {
                    console.log("linter-kibit: failed exec", kibit);
                    return null;
                  }

                  const line = Number(exec[1]);
                  const excerpt = exec[2];

                  return {
                    severity: "warning",
                    location: {
                      file: editorPath,
                      position: helpers.generateRange(textEditor, line - 1)
                    },
                    excerpt: `Consider using:\n${excerpt}`
                  };
                })
                .filter(m => m);

              // console.log("linter-kibit: messages", messages);

              return messages;
            }

            return null;
          });
      }
    };
  }
};
