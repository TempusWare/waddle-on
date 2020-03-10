function copyText(dialogueNumber) {
    var textbox = document.getElementById("dialogue_" + dialogueNumber);
    textbox.select();
    document.execCommand("copy");
    alert("Copied " + textbox.value);
};

//var toggle = document.getElementById("showEditor");
//toggle.checked = false;
function toggleEditor() {
    if (toggle.checked) {
        document.getElementById("editor").style.display = "none";
        document.getElementById("preview").style.width = "100%";
    } else {
        document.getElementById("editor").style.display = "initial";
        document.getElementById("preview").style.width = "50%";
    };
};

import { emoticons, interpret } from "./modules/interpreter.js";

const textEditor = document.getElementById("text-editor");

document.getElementById("update-button").addEventListener("click", update);

function update() {
    print(interpret(textEditor.value));
};

var scriptViewer = document.getElementById("viewer-lines");
function print(script) {
    // Reset script viewer
    while (scriptViewer.hasChildNodes()) {
        scriptViewer.removeChild(scriptViewer.firstChild);
    };

    for (const set in script) {
        if (script.hasOwnProperty(set)) {
            const line = script[set];
            let item = document.createElement("li");
            switch (line.type) {
                case "heading":
                    item.innerHTML = "<b>" + line.content + "</b>";
                    item.classList.add("heading");
                    scriptViewer.appendChild(item);
                    break;

                case "emoticon":
                    item.innerHTML = "<u>" + line.name + "</u><br>";
                    //item.innerHTML += "insert " + line.content + " emote (" + emoticons[line.content] + ")";
                    let img = document.createElement("img");
                    img.src = "./emotes/" + line.content + ".png";
                    item.appendChild(img);
                    item.innerHTML += "(" + emoticons[line.content] + ")";
                    item.classList.add("emoticon");
                    scriptViewer.appendChild(item);
                    break;

                case "dialogue":
                    item.innerHTML = "<u>" + line.name + "</u><br>" + line.content[0];
                    item.classList.add("dialogue");
                    // Create and add more list items if there are more than 1 lines
                    if (line.content.length > 1) {
                        item.innerHTML += " (CONT'D)"; // Add "CONT'D" text if the dialogue continues further
                        //item.title = item.content[0];
                        scriptViewer.appendChild(item);
                        for (let m = 1; m < line.content.length; m++) {
                            //const message = array[m];
                            let newItem = document.createElement("li");
                            newItem.innerHTML = line.content[m];
                            if (m + 1 < line.content.length) { // Add "CONT'D" text if the dialogue continues further
                                newItem.innerHTML += " (CONT'D)";
                            };
                            newItem.addEventListener("click", function() {
                                let temp = document.createElement("textarea");
                                temp.value = line.content[0];
                                temp.id = "temp";
                                document.body.appendChild(temp);
                                temp.select();
                                document.execCommand("copy");
                                temp.remove();
                            });
                            newItem.classList.add("dialogue");
                            scriptViewer.appendChild(newItem);
                        };
                    } else {
                        scriptViewer.appendChild(item);
                    };
                    item.addEventListener("click", function() {
                        let temp = document.createElement("textarea");
                        temp.value = line.content[0];
                        temp.id = "temp";
                        document.body.appendChild(temp);
                        temp.select();
                        document.execCommand("copy");
                        temp.remove();
                    });
                    break;

                case "title":
                    item.innerHTML = "<b>" + line.content[0].toUpperCase() + "</b><br>" + line.content[1];
                    item.classList.add("title");
                    scriptViewer.appendChild(item);
                    break;

                case "action":
                    item.innerHTML = line.content.join("<br>");
                    item.classList.add("action");
                    scriptViewer.appendChild(item);
                    break;
            
                default:
                    break;
            }
        }
    }
}