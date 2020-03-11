import { interpret } from "../modules/interpreter.js";
import { print } from "../modules/printer.js";

const scriptViewer = document.getElementById("viewer-lines");

{
    let tempData = window.location.href.toString().replace(/%22/g, '"').replace(/%20/g, " ")
    var scriptData = tempData.slice(tempData.indexOf("#") + 1, tempData.length);
};

if (scriptData != "") {
    print(JSON.parse(scriptData), scriptViewer, "sibling");
} else {
    alert("No script data found.")
};
