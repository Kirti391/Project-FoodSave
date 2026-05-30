const socket = io("http://localhost:5000");

/* =========================
   SECTIONS
========================= */

const sections = {
    dashboard: document.getElementById("dashboardSection"),
    requests: document.getElementById("requestsSection"),
    accepted: document.getElementById("acceptedSection"),
    processing: document.getElementById("processingSection"),
    completed: document.getElementById("completedSection"),
};

/* =========================
   BUTTONS
========================= */

const buttons = {
    dashboard: document.getElementById("dashboardBtn"),
    requests: document.getElementById("requestsBtn"),
    accepted: document.getElementById("acceptedBtn"),
    processing: document.getElementById("processingBtn"),
    completed: document.getElementById("completedBtn"),
};

/* =========================
   UI HELPERS
========================= */

function hideAll() {
    Object.values(sections).forEach(sec => {
        if (sec) sec.style.display = "none";
    });
}

function setActive(key) {
    Object.values(buttons).forEach(btn => {
        if (btn) btn.classList.remove("active");
    });

    if (buttons[key]) buttons[key].classList.add("active");
}

/* =========================
   NAVIGATION
========================= */

buttons.dashboard?.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    sections.dashboard.style.display = "block";
    setActive("dashboard");
    loadWaste();
});

buttons.requests?.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    sections.requests.style.display = "block";
    setActive("requests");
    loadWaste();
});

buttons.accepted?.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    sections.accepted.style.display = "block";
    setActive("accepted");
    loadWaste();
});

buttons.processing?.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    sections.processing.style.display = "block";
    setActive("processing");
    loadWaste();
});

buttons.completed?.addEventListener("click", (e) => {
    e.preventDefault();
    hideAll();
    sections.completed.style.display = "block";
    setActive("completed");
    loadWaste();
});

/* =========================
   DEFAULT VIEW
========================= */

hideAll();
sections.dashboard.style.display = "block";
setActive("dashboard");

/* =========================
   SOCKET UPDATE
========================= */

/* =========================
   SOCKET EVENTS
========================= */

socket.on("farm-update", () => {
    setTimeout(loadWaste, 300);
});

/* NEW NGO REQUEST */
socket.on("new-waste-request", (data) => {

    showNotification(
        `New waste request from NGO: ${data.food_type}`,
        "info"
    );

    loadWaste();
});

/* PICKUP ASSIGNED */
socket.on("pickup-assigned", (data) => {

    showNotification(
        `Pickup assigned for ${data.food_type}`,
        "warning"
    );
});

/* PROCESSING STARTED */
socket.on("processing-started", (data) => {

    showNotification(
        `${data.food_type} moved to processing`,
        "info"
    );
});

/* PROCESS COMPLETED */
socket.on("processing-completed", (data) => {

    showNotification(
        `${data.food_type} processing completed`,
        "success"
    );

    loadWaste();
});
function showNotification(message, type="info") {

    const area = document.getElementById("notificationArea");

    if (!area) return;

    const div = document.createElement("div");

    div.className = `notification ${type}`;

    div.innerText = message;

    area.appendChild(div);

    setTimeout(() => {
        div.remove();
    }, 4000);
}
/* =========================
   MAIN FUNCTION
========================= */

function getStatusColor(status) {
    switch (status) {
        case "submitted": return "gray";
        case "accepted": return "orange";
        case "processing": return "blue";
        case "completed": return "green";
        default: return "gray";
    }
}

async function loadWaste() {
    try {

        const res = await fetch("http://localhost:5000/api/farm/waste");
        const data = await res.json();

        console.log("FARM WASTE DATA:", data);

        if (!data.success) return;

        const waste = data.waste || [];

        /* TABLES */
        const requestsTable = document.getElementById("requestsTable");
        const acceptedTable = document.getElementById("acceptedTable");
        const processingTable = document.getElementById("processingTable");
        const completedTable = document.getElementById("completedTable");

        /* STATS */
        const totalWasteEl = document.getElementById("totalWaste");
        const acceptedWasteEl = document.getElementById("acceptedWaste");
        const processedWasteEl = document.getElementById("processedWaste");
        const totalCompostEl = document.getElementById("totalCompost");
        const totalFeedEl = document.getElementById("totalFeed");

        /* CLEAR TABLES */
        if (requestsTable) requestsTable.innerHTML = "";
        if (acceptedTable) acceptedTable.innerHTML = "";
        if (processingTable) processingTable.innerHTML = "";
        if (completedTable) completedTable.innerHTML = "";

        /* COUNTERS */
        let totalWaste = waste.length;
        let accepted = 0;
        let processing = 0;
        let compost = 0;
        let feed = 0;
        let completed = 0;

        waste.forEach(item => {

            const status = item.status || "submitted";

            /* =========================
               REQUESTS
            ========================= */
            if (status === "submitted" || status === "pending") {
                requestsTable.innerHTML += `
                    <tr style="border-left:4px solid ${getStatusColor(status)}">
                        <td>${item.food_type}</td>
                        <td>${item.quantity}</td>
                        <td>${item.location || "-"}</td>
                        <td>New</td>
                        <td>
                            <button onclick="acceptWaste(${item.id})">Accept</button>
                        </td>
                    </tr>
                `;
            }

            /* =========================
               ACCEPTED
            ========================= */
            if (status === "accepted") {
                accepted++;
                const hours = item.hours_old || 0;
                const isStale = hours > 6;

                acceptedTable.innerHTML += `
<tr style="border-left:4px solid ${getStatusColor(status)}">
    <td>${item.food_type}</td>
    <td>${item.quantity}</td>
    <td>${item.location || "-"}</td>
    <td>

        ${isStale ? "<span style='color:red'>⚠ Delayed</span>" : ""}

        ${status === "processing"
                        ? "<span style='color:green;font-weight:bold'>Processing Started</span>"
                        : `
                <button onclick="startProcessing(${item.id})">
                    Start Processing
                </button>
            `
                    }

    </td>
</tr>
`;
            }

            /* =========================
               PROCESSING
            ========================= */
            if (status === "processing") {
                processing++;

                processingTable.innerHTML += `
                   <tr style="border-left:4px solid ${getStatusColor(status)}">
                        <td>${item.food_type}</td>
                        <td>${item.quantity}</td>
                        <td>${item.location || "-"}</td>
                        <td>
                            <button onclick="completeProcessing(${item.id})">
                                Mark Completed
                            </button>
                        </td>
                    </tr>
                `;
            }

            /* =========================
               COMPLETED
            ========================= */
            if (status === "completed") {

                completed++;

                /* =========================
                   AUTO CLASSIFICATION
                ========================= */

                let outputType = "Animal Feed";

                if (
                    item.food_condition === "Spoiled" ||
                    item.hours_old > 6
                ) {
                    outputType = "Compost";
                    compost++;
                } else {
                    feed++;
                }

                completedTable.innerHTML += `
        <tr style="border-left:4px solid ${getStatusColor(status)}">

            <td>${item.food_type}</td>

            <td>${item.quantity}</td>

            <td>${item.location || "-"}</td>

            <td>${outputType}</td>

        </tr>
    `;
            }
        });
        const conversionRate =
            totalWaste > 0
                ? ((processing + accepted + completed) / totalWaste) * 100
                : 0;

        const efficiencyEl = document.getElementById("efficiencyRate");
        if (efficiencyEl) {
            efficiencyEl.innerText = conversionRate.toFixed(1) + "%";
        }
        const co2Saved = completed * 2.5;

const co2El = document.getElementById("co2Saved");

if (co2El) {
    co2El.innerText = co2Saved.toFixed(1) + " kg";
}
        // EMPTY STATE HANDLING
        showEmpty(requestsTable, "No incoming waste");
        showEmpty(acceptedTable, "No accepted items");
        showEmpty(processingTable, "No items in processing");
        showEmpty(completedTable, "No completed items");
        /* =========================
           SAFE STATS UPDATE
        ========================= */
        if (totalWasteEl) totalWasteEl.innerText = totalWaste;
        if (acceptedWasteEl) acceptedWasteEl.innerText = accepted;
        if (processedWasteEl) processedWasteEl.innerText = processing;
        if (totalCompostEl) totalCompostEl.innerText = compost;
        if (totalFeedEl) totalFeedEl.innerText = feed;

    } catch (err) {
        console.log("ERROR:", err);
    }
}

/* =========================
   ACTIONS
========================= */
function acceptWaste(id) {

    fetch(`http://localhost:5000/api/farm/accept/${id}`, {
        method: "PUT"
    })
    .then(res => res.json())
    .then(data => {

        if (data.success) {

            showNotification("✅ Waste Accepted");

            loadWaste();

        } else {

            alert(data.message || "Failed");

        }

    })
    .catch(err => {

        console.log(err);

    });

}

function startProcessing(id) {
    io.emit("processing-started", {
    food_type: waste.food_type
});

    fetch(`/api/farm/start-processing/${id}`, {
        method: "PUT"
    })
        .then(res => res.json())
        .then(data => {

            if (data.success) {
                loadWaste();
            } else {
                alert(data.message || "Failed");
            }

        })
        .catch(err => {
            console.log(err);
        });
}

function completeProcessing(id) {

    io.emit("processing-completed", {
    food_type: waste.food_type
});
    fetch(`/api/farm/complete/${id}`, {
        method: "PUT"
    })
        .then(res => res.json())
        .then(data => {

            if (data.success) {
                loadWaste();
            } else {
                alert(data.message || "Failed");
            }

        })
        .catch(err => {
            console.log(err);
        });
}
// function getStatusColor(status) {
//     switch (status) {
//         case "submitted": return "gray";
//         case "accepted": return "orange";
//         case "processing": return "blue";
//         case "completed": return "green";
//         default: return "gray";
//     }
// }
function showEmpty(table, message) {
    if (table && table.innerHTML === "") {
        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:20px;">
                    ${message}
                </td>
            </tr>
        `;
    }
}
/* =========================
   INIT
========================= */

loadWaste();