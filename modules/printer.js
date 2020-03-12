import { emoticons } from "./emotes.js";

export function print(script, viewer, location) {
    // Reset script viewer
    while (viewer.hasChildNodes()) {
        viewer.removeChild(viewer.firstChild);
    };

    // Get array of characters
    var charactersList = [];
    for (const set in script) {
        if (script.hasOwnProperty(set)) {
            const line = script[set];
            if ((line.type === "dialogue" || line.type === "emoticon") && !charactersList.includes(line.name)) {
                charactersList.push(line.name);
            };
        };
    };

    for (const set in script) {
        if (script.hasOwnProperty(set)) {
            const line = script[set];
            let item = document.createElement("li");
            switch (line.type) {
                case "heading":
                    item.innerHTML = line.content;
                    item.classList.add("heading");
                    viewer.appendChild(item);
                    break;

                case "transition":
                    item.innerHTML = line.content;
                    item.classList.add("transition");
                    viewer.appendChild(item);
                    break;

                case "emoticon":
                    item.innerHTML = "<u>" + line.name + ":</u><br>";
                    //item.innerHTML += "insert " + line.content + " emote (" + emoticons[line.content] + ")";
                    let div = document.createElement("div");
                    item.appendChild(div);
                    let img = document.createElement("img");
                    switch (location) {
                        case "home":
                            img.src = "./emotes/" + line.content + ".png";
                            break;
                        case "sibling":
                            img.src = "../emotes/" + line.content + ".png";
                            break;
                    };
                    div.appendChild(img);
                    let span = document.createElement("span");
                    span.innerHTML = "(" + emoticons[line.content] + ")";
                    div.appendChild(span);
                    
                    //item.innerHTML += "(" + emoticons[line.content] + ")";
                    item.classList.add("emoticon");
                    item.classList.add("character-" + (charactersList.indexOf(line.name) + 1));
                    viewer.appendChild(item);
                    break;

                case "dialogue":
                    item.innerHTML = "<u>" + line.name + ":</u><br>" + line.content[0];
                    item.classList.add("dialogue");
                    item.classList.add("character-" + (charactersList.indexOf(line.name) + 1));
                    // Create and add more list items if there are more than 1 lines
                    if (line.content.length > 1) {
                        item.innerHTML += " (CONT'D)"; // Add "CONT'D" text if the dialogue continues further
                        //item.title = item.content[0];
                        viewer.appendChild(item);
                        for (let m = 1; m < line.content.length; m++) {
                            //const message = array[m];
                            let newItem = document.createElement("li");
                            newItem.innerHTML = line.content[m];
                            if (m + 1 < line.content.length) { // Add "CONT'D" text if the dialogue continues further
                                newItem.innerHTML += " (CONT'D)";
                            };
                            newItem.addEventListener("click", function() {
                                let temp = document.createElement("textarea");
                                temp.value = line.content[m];
                                temp.id = "temp";
                                document.body.appendChild(temp);
                                temp.select();
                                document.execCommand("copy");
                                temp.remove();
                            });
                            newItem.classList.add("dialogue");
                            newItem.classList.add("character-" + (charactersList.indexOf(line.name) + 1));
                            viewer.appendChild(newItem);
                        };
                    } else {
                        viewer.appendChild(item);
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
                    viewer.appendChild(item);
                    break;

                case "action":
                    item.innerHTML = line.content.join("<br>");
                    item.classList.add("action");
                    viewer.appendChild(item);
                    break;
            
                default:
                    break;
            };
        };
    };

    // Print The End
    let item = document.createElement("li");
    item.innerHTML = "THE END!";
    item.id = "end";
    viewer.appendChild(item);
}