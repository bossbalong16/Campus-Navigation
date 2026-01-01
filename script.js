// Wait until the HTML document is fully loaded
document.addEventListener("DOMContentLoaded", () => {

    // Grab references to all important HTML elements for later use
    const floorSelect = document.getElementById("floorSelect"); // dropdown for selecting floor
    const mapDiv = document.getElementById("floorMap"); // div to display floor map image
    const startSelect = document.getElementById("start"); // dropdown for start location
    const endSelect = document.getElementById("end"); // dropdown for destination
    const closeRouteSelect = document.getElementById("CloseRoute"); // optional closed route dropdown
    const output = document.getElementById("output"); // div to display results

    // Graph representing campus nodes (rooms, stairs, exits) and travel times between them
    const graph = {
        //1st OUTSIDE CAMPUS
        "GATE ENTRANCE": { "COURT": 0.2, "GUARD": 0.2, "PARKING": 0.2 },
        "GUARD": { "COURT": 0.20, "GATE ENTRANCE": 0.2, "1st STAIR LEFT": 0.20, "STUDENT EXIT WAY": 0.20 },
        "COURT": { "GATE ENTRANCE": 0.2, "GUARD": 0.25, "CAMPUS ENTRANCE": 0.3, "PARKING": 0.25, "CANTEEN": 0.20 },
        "PARKING": { "COURT": 0.25, "CANTEEN": 0.1, "1st STAIR RIGHT": 0.20, "GATE ENTRANCE": 0.25, "VEHICLE EXIT WAY": 1 },
        "CANTEEN": { "PARKING": 0.35, "CAMPUS ENTRANCE": 0.20, "COURT": 0.20 },
        // 1st FLOOR
        "CAMPUS ENTRANCE": { "COURT": 0.3, "1st STAIR RIGHT": 0.5, "1st STAIR LEFT": 0.5, "CANTEEN": 0.25, "OFFICE 1": 0.2, "OFFICE 2": 0.2, "OFFICE 3": 0.2, "OFFICE 4": 0.2, "OFFICE 5": 0.2 },
        "OFFICE 1": { "OFFICE 2": 0.25, "1st STAIR LEFT": 0.4, "CAMPUS ENTRANCE": 0.25 },
        "OFFICE 2": { "OFFICE 1": 0.25, "OFFICE 3": 0.25, "CAMPUS ENTRANCE": 0.25 },
        "OFFICE 3": { "OFFICE 2": 0.25, "OFFICE 4": 0.25, "CAMPUS ENTRANCE": 0.25 },
        "OFFICE 4": { "OFFICE 3": 0.25, "OFFICE 5": 0.25, "CAMPUS ENTRANCE": 0.25 },
        "OFFICE 5": { "OFFICE 4": 0.25, "1st STAIR RIGHT": 0.55, "CAMPUS ENTRANCE": 0.25 },
        "1st STAIR LEFT": { "OFFICE 1": 0.4, "1st Fire E.L": 0.45, "2nd STAIR LEFT": 0.7, "CAMPUS ENTRANCE": 0.25 },
        "1st STAIR RIGHT": { "1st Fire E.R": 0.45, "2nd STAIR RIGHT": 0.20, "CAMPUS ENTRANCE": 0.25, "PARKING": 0.20 },
        "1st Fire E.L": { "1st STAIR LEFT": 0.45, "STUDENT EXIT WAY": 0.5 },
        "1st Fire E.R": { "1st STAIR RIGHT": 0.45, "VEHICLE EXIT WAY": 0.5 },
        //2nd FLOOR
        "2nd STAIR LEFT": { "1st STAIR LEFT": 0.7, "3rd STAIR LEFT": 0.7, "RM:201": 0.5 },
        "2nd STAIR RIGHT": { "1st STAIR RIGHT": 0.7, "3rd STAIR RIGHT": 0.7, "RM:205": 0.2 },
        "RM:201": { "2nd STAIR LEFT": 0.5, "RM:202": 0.5 },
        "RM:202": { "2nd STAIR RIGHT": 0.5, "RM:201": 0.5, "RM:203": 0.5 },
        "RM:203": { "RM:202": 0.5, "RM:204": 0.5 },
        "RM:204": { "RM:203": 0.5, "RM:205": 0.5 },
        "RM:205": { "RM:204": 0.5 },
        //3rd FLOOR
        "3rd STAIR LEFT": { "2nd STAIR LEFT": 0.7, "RM:301": 0.5 },
        "3rd STAIR RIGHT": { "2nd STAIR RIGHT": 0.7, "RM:305": 0.2 },
        "RM:301": { "3rd STAIR LEFT": 0.5, "RM:302": 0.2 },
        "RM:302": { "RM:301": 0.2, "RM:303": 0.2 },
        "RM:303": { "RM:302": 0.2, "RM:304": 0.2 },
        "RM:304": { "RM:303": 0.2, "RM:305": 0.2 },
        "RM:305": { "RM:304": 0.2, "3rd STAIR RIGHT": 0.2 },
        "STUDENT EXIT WAY": { "1st STAIR LEFT": 0.3, "GUARD": 0.6, "GATE EXIT": 1.25 },
        "VEHICLE EXIT WAY": { "1st Fire E.R": 0.20, "PARKING": 0.5, "GATE EXIT": 1.25 },
        "GATE EXIT": { "STUDENT EXIT WAY": 1.25, "VEHICLE EXIT WAY": 1.25 }
    };

    // Locations grouped by floor for populating dropdowns dynamically
    const floorLocations = {
        "out": ["GATE ENTRANCE", "COURT", "PARKING", "GUARD", "CANTEEN", "VEHICLE EXIT WAY", "STUDENT EXIT WAY", "GATE EXIT"],
        "1st": ["CAMPUS ENTRANCE", "OFFICE 1", "OFFICE 2", "OFFICE 3", "OFFICE 4", "OFFICE 5"],
        "2nd": ["2nd STAIR LEFT", "2nd STAIR RIGHT", "RM:201", "RM:202", "RM:203", "RM:204", "RM:205"],
        "3rd": ["3rd STAIR LEFT", "3rd STAIR RIGHT", "RM:301", "RM:302", "RM:303", "RM:304", "RM:305"]
    };

    // Populate start dropdown with all nodes from graph
    startSelect.innerHTML = `<option disabled selected>Select Start</option>`;
    Object.keys(graph).forEach(n => startSelect.innerHTML += `<option>${n}</option>`);

    // Function called when a floor is selected
    window.showFloorMap = function () {
        const floor = floorSelect.value; // get selected floor
        mapDiv.innerHTML = `<img src="dijkstra.png" class="floor-map"/>`; // show floor image
        endSelect.disabled = false; // enable destination dropdown
        endSelect.innerHTML = `<option disabled selected>Select Destination</option>`; // reset destination options
        // add only locations from selected floor
        (floorLocations[floor] || []).forEach(loc => endSelect.innerHTML += `<option>${loc}</option>`);
        output.innerHTML = ""; // clear previous results
    }

    // Dijkstra algorithm to find shortest path with optional blocked route
    function dijkstra(start, end, blocked) {
        const dist = {}, prev = {}, nodes = new Set(Object.keys(graph)); // setup distances and visited nodes
        Object.keys(graph).forEach(n => dist[n] = Infinity); // initialize all distances to Infinity
        dist[start] = 0; // distance to start node is 0

        if (blocked) nodes.delete(blocked); // if a route is blocked, remove it from graph

        while (nodes.size) {
            // find node with smallest distance
            const curr = [...nodes].reduce((a, b) => dist[a] < dist[b] ? a : b);
            if (dist[curr] === Infinity) break; // remaining nodes unreachable
            nodes.delete(curr); // mark current node as visited

            // update distances for neighbors
            for (let nb in graph[curr]) {
                if (blocked && nb === blocked) continue; // skip blocked neighbor
                if (!nodes.has(nb)) continue; // skip visited neighbors
                const alt = dist[curr] + graph[curr][nb]; // calculate alternative distance
                if (alt < dist[nb]) { // if shorter, update
                    dist[nb] = alt;
                    prev[nb] = curr; // store previous node for path reconstruction
                }
            }
        }

        // reconstruct shortest path from end to start
        let path = [], step = end;
        while (step) { path.unshift(step); step = prev[step]; }
        return { path, cost: dist[end] }; // return path and total cost
    }

    // Format decimal minutes to min/sec string
    function formatTime(m) {
        const s = Math.round(m * 60); // convert to seconds
        return s < 60 ? `${s} sec` : `${Math.floor(s / 60)} min ${s % 60} sec`; // format nicely
    }

    // Called when user clicks "Find Shortest Path"
    window.findShortestPath = function () {
        const start = startSelect.value;
        const end = endSelect.value;
        const blocked = closeRouteSelect.value || null; // optional blocked node

        // Validation
        if (!start || !end) { output.innerHTML = "⚠ Please select start and destination."; return; }
        if (start === end) { output.innerHTML = "⚠ Start and destination cannot be the same."; return; }
        if (blocked && (start === blocked || end === blocked)) { output.innerHTML = "❌ Selected route is closed. Choose another."; return; }

        const r = dijkstra(start, end, blocked); // calculate shortest path

        if (r.cost === Infinity) { output.innerHTML = "❌ No route found due to closed path."; return; }

        // Display results in HTML
        let html = `<h3>📍 Navigation Result</h3>`;
        if (blocked) html += `🚫 Closed Route: <b>${blocked}</b><br><br>`;
        r.path.forEach((p, i) => { if (i < r.path.length - 1) html += `${i + 1}. ${p} → ${r.path[i + 1]}<br>`; });
        html += `<br>⏱ <b>Total Time:</b> ${formatTime(r.cost)}`;
        output.innerHTML = html;
    }

    // Reset the entire form to initial state
    window.resetForm = function () {
        floorSelect.selectedIndex = 0;
        startSelect.selectedIndex = 0;
        endSelect.innerHTML = "";
        endSelect.disabled = true;
        closeRouteSelect.selectedIndex = 0;
        output.innerHTML = "";
    }

});
