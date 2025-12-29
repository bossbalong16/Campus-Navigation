document.addEventListener("DOMContentLoaded", () => {

    const floorSelect = document.getElementById("floorSelect");
    const mapDiv = document.getElementById("floorMap");
    const startSelect = document.getElementById("start");
    const endSelect = document.getElementById("end");
    const output = document.getElementById("output");

    const graph = {
        //1st OUTSIDE CAMPUS
        "GATE ENTRANCE": {
            "COURT": 0.2,
            "GUARD": 0.2,
            "PARKING": 0.2
        },
        "GUARD": {
            "COURT": 0.20,
            "GATE ENTRANCE": 0.2,
            "1st STAIR LEFT": 0.20,
            "STUDENT EXIT WAY": 1.25
        },
        "COURT": {
            "GATE ENTRANCE": 0.2,
            "GUARD": 0.25,
            "CAMPUS ENTRANCE": 0.3,
            "PARKING": 0.25,
            "CANTEEN": 0.20
        },
        "PARKING": {
            "COURT": 0.25,
            "CANTEEN": 0.1,
            "1st STAIR RIGHT": 0.20,
            "GATE ENTRANCE": 0.25,
            "VEHICLE EXIT WAY": 1
        },
        "CANTEEN": {
            "PARKING": 0.35,
            "CAMPUS ENTRANCE": 0.20,
            "COURT": 0.20
        },
       

        // 1st FLOOR
        "CAMPUS ENTRANCE": {
            "COURT": 0.3,
            "1st STAIR RIGHT": 0.5,
            "1st STAIR LEFT": 0.5,
            "CANTEEN": 0.25,
            "OFFICE 1": 0.2,
            "OFFICE 2": 0.2,
            "OFFICE 3": 0.2,
            "OFFICE 4": 0.2,
            "OFFICE 5": 0.2
        },

        "OFFICE 1": {
            "OFFICE 2": 0.25,
            "1st STAIR LEFT": 0.4,
            "CAMPUS ENTRANCE": 0.25
        },

        "OFFICE 2": {
            "OFFICE 1": 0.25,
            "OFFICE 3": 0.25,
            "CAMPUS ENTRANCE": 0.25
        },

        "OFFICE 3": {
            "OFFICE 2": 0.25,
            "OFFICE 4": 0.25,
            "CAMPUS ENTRANCE": 0.25
        },

        "OFFICE 4": {
            "OFFICE 3": 0.25,
            "OFFICE 5": 0.25,
            "CAMPUS ENTRANCE": 0.25
        },

        "OFFICE 5": {
            "OFFICE 4": 0.25,
            "1st STAIR RIGHT": 0.55,
            "CAMPUS ENTRANCE": 0.25
        },

        "1st STAIR LEFT": {
            "OFFICE 1": 0.4,
            "1st Fire E.L": 0.45,
            "2nd STAIR LEFT": 0.7,
            "CAMPUS ENTRANCE": 0.25
        },
        
        "1st STAIR RIGHT": {
            "1st Fire E.R": 0.45,
            "2nd STAIR RIGHT": 0.20,
            "CAMPUS ENTRANCE": 0.25,
            "PARKING": 0.20
        },

        "1st Fire E.L": {
            "1st STAIR LEFT": 0.45,
            "STUDENT EXIT WAY": 0.5
        },

        "1st Fire E.R": {
            "1st STAIR RIGHT": 0.45,
            "VEHICLE EXIT WAY": 0.5
        },

        //2nd FLOOR
        "2nd STAIR LEFT": {
            "1st STAIR LEFT": 0.7,
            "3rd STAIR LEFT": 0.7,
            "RM:201": 0.5
        },

        "2nd STAIR RIGHT": {
            "1st STAIR RIGHT": 0.7,
            "3rd STAIR RIGHT": 0.7,
            "RM:205": 0.2
        },

        "RM:201": {
            "2nd STAIR LEFT": 0.5,
            "RM:202": 0.5
        },

        "RM:202": {
            "2nd STAIR RIGHT": 0.5,
            "RM:201": 0.5,
            "RM:203": 0.5
        },

        "RM:203": {
            "RM:202": 0.5,
            "RM:204": 0.5
        },

        "RM:204": {
            "RM:203": 0.5,
            "RM:205": 0.5
        },

        "RM:205": {
            "RM:204": 0.5
        },

        //3rd FLOOR
        "3rd STAIR LEFT": {
            "2nd STAIR LEFT": 0.7,
            "RM:301": 0.5,
        },

        "3rd STAIR RIGHT": {
            "2nd STAIR RIGHT": 0.7,
            "RM:305": 0.2,
        },
        "RM:301": { 
            "3rd STAIR LEFT": 0.5, 
            "RM:302": 0.2 
        },
        "RM:302": { 
            "RM:301": 0.2, 
            "RM:303": 0.2 
        },
        "RM:303": { 
            "RM:302": 0.2, 
            "RM:304": 0.2 
        },
        "RM:304": { 
            "RM:303": 0.2, 
            "RM:305": 0.2 
        },
        "RM:305": { 
            "RM:304": 0.2, 
            "3rd STAIR RIGHT": 0.2 
        },
        
        "STUDENT EXIT WAY": {
            "1st STAIR LEFT": 0.3, 
            "GUARD": 0.6,
            "GATE EXIT": 0.75
        },
        "VEHICLE EXIT WAY": { 
            "1st Fire E.R": 0.20, 
            "PARKING": 0.5, 
            "GATE EXIT": 0.75
        },
        "GATE EXIT": {
            "STUDENT EXIT WAY": 0.75,
            "VEHICLE EXIT WAY": 0.75
        }

    };

    const floorLocations = {
        "out": [
            "GATE ENTRANCE", 
            "COURT", 
            "PARKING", 
            "GUARD", 
            "CANTEEN",
            "VEHICLE EXIT WAY",
            "STUDENT EXIT WAY",
            "GATE EXIT"
        ],

        "1st": [
            "CAMPUS ENTRANCE", 
            "OFFICE 1", 
            "OFFICE 2", 
            "OFFICE 3", 
            "OFFICE 4", 
            "OFFICE 5"
        ],
        
        "2nd": [
            "2nd STAIR LEFT", 
            "2nd STAIR RIGHT", 
            "RM:201", 
            "RM:202", 
            "RM:203", 
            "RM:204", 
            "RM:205"
        ],
        
        "3rd": [
            "3rd STAIR LEFT", 
            "3rd STAIR RIGHT", 
            "RM:301", 
            "RM:302", 
            "RM:303", 
            "RM:304", 
            "RM:305"
        ],
    };

    function populateStart() {
        startSelect.innerHTML = `<option disabled selected>Select Start</option>`;
        Object.keys(graph).forEach(n => {
            startSelect.innerHTML += `<option>${n}</option>`;
        });
    }

    function populateEndByFloor(floor) {
        endSelect.disabled = false;
        endSelect.innerHTML = `<option disabled selected>Select Destination</option>`;
        (floorLocations[floor] || []).forEach(loc => {
            if (graph[loc]) endSelect.innerHTML += `<option>${loc}</option>`;
        });
    }

    populateStart();

    window.showFloorMap = function () {
        const floor = floorSelect.value;
        mapDiv.innerHTML = `<img src="dijkstra.png" class="floor-map"/>`;
        populateEndByFloor(floor);
        output.innerHTML = "";
    }

    function dijkstra(start, end) {
        const dist = {}, prev = {}, nodes = new Set(Object.keys(graph));
        Object.keys(graph).forEach(n => dist[n] = Infinity);
        dist[start] = 0;

        while (nodes.size) {
            const curr = [...nodes].reduce((a, b) => dist[a] < dist[b] ? a : b);
            nodes.delete(curr);
            for (let nb in graph[curr]) {
                let alt = dist[curr] + graph[curr][nb];
                if (alt < dist[nb]) {
                    dist[nb] = alt;
                    prev[nb] = curr;
                }
            }
        }

        let path = [], step = end;
        while (step) {
            path.unshift(step);
            step = prev[step];
        }

        return { path, cost: dist[end] };
    }

    function formatTime(totalMinutes) {
        const totalSeconds = Math.round(totalMinutes * 60);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutes === 0) return `${seconds} sec`;
        if (seconds === 0) return `${minutes} min`;

        return `${minutes} min ${seconds} sec`;
    }

    function resetForm() {
        floorSelect.selectedIndex = 0;
        startSelect.selectedIndex = 0;
        endSelect.innerHTML = "";
        endSelect.disabled = true;
        output.innerHTML = "";
    }

    window.findShortestPath = function () {
        const start = startSelect.value;
        const end = endSelect.value;

        if (!start || !end) {
            output.innerHTML = "⚠ Please select start and destination.";
            return;
        }
        if (start === end) {
            output.innerHTML = "⚠ Start and destination cannot be the same.";
            return;
        }

        const result = dijkstra(start, end);

        if (result.cost === Infinity) {
            output.innerHTML = "❌ No route found.";
            return;
        }

        let html = `<h3>📍 Navigation Result</h3>`;
        html += `<div class='note'>${result.path.length - 1} steps</div><br>`;

        for (let i = 0; i < result.path.length - 1; i++) {
            html += `<div class='step'>${i + 1}. From <b>${result.path[i]}</b> → <b>${result.path[i + 1]}</b></div>`;
        }

        html += `<br>⏱ <b>Total Estimated Time:</b> ${formatTime(result.cost)}`;
        output.innerHTML = html;
    }

});