import { interpret } from "./modules/interpreter.js";
import { print } from "./modules/printer.js";

const textEditor = document.getElementById("text-editor");
const scriptViewer = document.getElementById("viewer-lines");
const scriptViewerBox = document.getElementById("viewer-box");
const replaceCaseToggle = document.getElementById("replace-case-toggle");
const autoPreviewToggle = document.getElementById("auto-preview-toggle");
//const autoSaveToggle = document.getElementById("auto-save-toggle");

document.getElementById("replace-button").addEventListener("click", replace);
document.getElementById("undo-fnr-button").addEventListener("click", undoFNR);
document.getElementById("preview-button").addEventListener("click", preview);
document.getElementById("convert-button").addEventListener("click", convert);
//document.getElementById("save-button").addEventListener("click", function() {save(); alert("Your script has been saved to your browser.\nIt'll automatically open in the editor next time you open this tool.")});

var caseSensitive = true;
var backupScript = "";
function replace() {
    var findText = prompt("Enter text to find in your script:");

    if (findText != null && findText != "") {
        backupScript = textEditor.value;

        var replaceText = prompt("Enter text to replace with:");

        let modifier = caseSensitive ? "g" : "gi";

        let regex = new RegExp(findText, modifier);
        textEditor.value = textEditor.value.replace(regex, replaceText);

        preview();
    } else if (findText != null) {
        alert("You didn't enter any text to find!");
    };
};

function undoFNR() {
    if (backupScript != "") {
        var goAhead = confirm("Undo last Find & Replace?");

        if (goAhead) {
            textEditor.value = backupScript;
            backupScript = "";
            preview();
        };
    } else {
        alert("You haven't used Find & Replace!");
    };
};

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

replaceCaseToggle.checked = true;
replaceCaseCheck();
replaceCaseToggle.addEventListener("click", replaceCaseCheck)
function replaceCaseCheck() {
    if (replaceCaseToggle.checked) {
        caseSensitive = true;
    } else {
        caseSensitive = false;
    };
};

/*autoSaveToggle.checked = true;
autoSaveCheck();
autoSaveToggle.addEventListener("click", autoSaveCheck)
function autoSaveCheck() {
    if (autoSaveToggle.checked) {
        setInterval(save, 3000);
    } else {
        clearInterval(save);
    };
};*/

function autopreview() {
    preview();
    // Scroll to bottom
    var scrollBottom = textEditor.clientHeight + textEditor.scrollTop;
    if (scrollBottom === textEditor.scrollHeight) {
        scriptViewerBox.scrollTop = scriptViewerBox.scrollHeight;
    };
};

preview();
function preview() {
    if (textEditor.value != "") {
        var script = interpret(textEditor.value);
        print(script, scriptViewer, "home");
    } else {
        // Clear script viewer
        while (scriptViewer.hasChildNodes()) {
            scriptViewer.removeChild(scriptViewer.firstChild);
        };
    };
};

function convert() {
    var script = encodeURIComponent(JSON.stringify(interpret(textEditor.value)));
    //var script = encodeURIComponent(textEditor.value);
    var curLoc = window.location.href;
    //var curLoc = "https://www.078596.xyz/waddleon";
    var url = curLoc.endsWith("/") ? curLoc + "viewer?" + script : curLoc + "/viewer?" + script;

    // Copy export url to clipboard
    let temp = document.createElement("textarea");
    temp.value = url;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();

    let useTinyurl = confirm("A link to access the script exclusively via the online viewer has been saved to your clipboard.\n\nTo generate a shortened link that will fit in a Discord message, press OK and you'll be taken to an auto-generated TinyURL result.\nIf you want to do it manually, press Cancel.");

    if (useTinyurl) {
        // Open and use tinyurl
        window.open("https://tinyurl.com/create.php?url=" + url);
    };
    
};

textEditor.addEventListener("keyup", save);
function save() {
    localStorage.setItem("backup", textEditor.value);
};
// Import backup if available
if (localStorage["backup"] && localStorage.getItem("backup") != "") {
    textEditor.value = localStorage.getItem("backup");
    //console.log("Imported backup");
    preview();
};