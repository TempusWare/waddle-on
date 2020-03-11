import { interpret } from "./modules/interpreter.js";
import { print } from "./modules/printer.js";

const textEditor = document.getElementById("text-editor");
const scriptViewer = document.getElementById("viewer-lines");
const autoPreviewToggle = document.getElementById("auto-preview-toggle");

autoPreviewToggle.checked = true;
autoPreviewCheck();

autoPreviewToggle.addEventListener("click", autoPreviewCheck)

function autoPreviewCheck() {
    if (autoPreviewToggle.checked) {
        textEditor.addEventListener("keyup", autopreview);
    } else {
        textEditor.removeEventListener("keyup", autopreview);
    };
};

document.getElementById("preview-button").addEventListener("click", preview);
document.getElementById("convert-button").addEventListener("click", convert);

function autopreview() {
    preview();
    document.getElementById("end").scrollIntoView();
}

function preview() {
    var script = interpret(textEditor.value);
    print(script, scriptViewer, "home");
};

function convert() {
    var script = JSON.stringify(interpret(textEditor.value));
    var curLoc = window.location.href;
    var url = curLoc.endsWith("/") ? curLoc + "viewer#" + script : curLoc + "/viewer#" + script;

    // Copy export url to clipboard
    let temp = document.createElement("textarea");
    temp.value = url;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();

    alert("A link to access the script exclusively via the viewer has been saved to your clipboard.\nUse a link shortener like bit.ly to shorten the link into a link that can be shared via Discord.")
};