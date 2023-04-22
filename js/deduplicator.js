function deduplicate() {
    const input = document.getElementById("GPSinput").value;
    const output = document.getElementById("GPSoutput");
    let numberOfDuplicates = 0;

    // Parse entries into dictionary
    let entries = {};
    const lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].split(":");

        // Ensure the line is a valid GPS entry
        if (line.length == 7 && line[0] == "GPS") {
            entries[i] = {
                name: line[1],
                x: line[2],
                y: line[3],
                z: line[4],
                color: line[5],
                dupeOf: null
            };
        }
    }

    // Remove duplicates based on distance threshold
    const distanceThreshold = document.getElementById("distanceThreshold").value;
    for (let i = 0; i < Object.keys(entries).length; i++) {
        for (let j = 0; j < i; j++) {
            if (i != j) {
                const x1 = entries[i].x;
                const y1 = entries[i].y;
                const z1 = entries[i].z;
                const x2 = entries[j].x;
                const y2 = entries[j].y;
                const z2 = entries[j].z;
                const distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2));
                // If there is, process the entry
                if (distance < distanceThreshold) {
                    entries[i].dupeOf = j;
                    numberOfDuplicates++;
                    if (document.getElementById("recolorDuplicates").checked) {
                        entries[i].color = "#FFFF0000";
                    }
                    break;
                }
            }
        }
    }

    // Rebuild the output string
    let outputString = "";
    for (let i = 0; i < Object.keys(entries).length; i++) {
        if (entries[i].dupeOf == null || document.getElementById("recolorDuplicates").checked) {
            outputString += "GPS:" + entries[i].name + ":" + entries[i].x + ":" + entries[i].y + ":" + entries[i].z + ":" + entries[i].color + ":`\n";
        }
    }

    // Output the result
    output.value = outputString;

    // Display the number of entries and the number of duplicates removed
    document.getElementById("numEntries").innerHTML = Object.keys(entries).length;
    document.getElementById("numDuplicates").innerHTML = numberOfDuplicates;

    // Build the fancy output
    const fancyOutput = document.getElementById("fancyGPSOutput");
    fancyOutput.innerHTML = "";
    for (let i = 0; i < Object.keys(entries).length; i++) {
        if (entries[i].dupeOf == null || document.getElementById("recolorDuplicates").checked) {
            let entry = document.createElement("p");
            let thisEntry = entries[i].name + " (" + entries[i].x + ", " + entries[i].y + ", " + entries[i].z + ")";
            if (entries[i].dupeOf != null) {
                let dupeOf = entries[entries[i].dupeOf].name + " (" + entries[entries[i].dupeOf].x + ", " + entries[entries[i].dupeOf].y + ", " + entries[entries[i].dupeOf].z + ")";
                entry.innerHTML = thisEntry + " is a duplicate of " + dupeOf;
            } else {
                entry.innerHTML = thisEntry;
            }
            // Style the entry with the color
            entry.style.color = ARGBHexToRGBHex(entries[i].color);
            fancyOutput.appendChild(entry);
        }
    }
}

function ARGBHexToRGBHex(argbHex) {
    return "#" + argbHex.substring(3);
}