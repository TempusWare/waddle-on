import { interpret } from "../modules/interpreter.js";
import { print } from "../modules/printer.js";

const scriptViewer = document.getElementById("viewer-lines");

{
    let tempData = window.location.href.toString()
    var scriptData = decodeURIComponent(tempData.slice(tempData.indexOf("?") + 1, tempData.length));
};

if (scriptData != "") {
    let script = JSON.parse(scriptData);
    print(script, scriptViewer, "sibling");

    // Set tab title
    for (const set in script) {
        if (script.hasOwnProperty(set)) {
            const line = script[set];
            if (line.type === "title") {
                document.title = line.content[0] + " | " + document.title;
                break;
            };
        };
    };
} else {
    alert("No script data found.")
};
