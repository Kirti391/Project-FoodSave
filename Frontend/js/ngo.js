const socket = io("http://localhost:5000");


const sections = {
    incoming: document.getElementById("incomingSection"),
    accepted: document.getElementById("acceptedSection"),
    assigned: document.getElementById("assignedSection"),
    completed: document.getElementById("completedSection")
};

const buttons = {
    incoming: document.getElementById("incomingBtn"),
    accepted: document.getElementById("acceptedBtn"),
    assigned: document.getElementById("assignedBtn"),
    completed: document.getElementById("completedBtn")
};

function switchSection(sectionKey) {

    Object.values(sections).forEach(sec => {
        if (sec) sec.style.display = "none";
    });

    Object.values(buttons).forEach(btn => {
        if (btn) btn.classList.remove("active");
    });

    if (sections[sectionKey]) {
        sections[sectionKey].style.display = "block";
    }

    if (buttons[sectionKey]) {
        buttons[sectionKey].classList.add("active");
    }
}

Object.keys(buttons).forEach(key => {
    if (buttons[key]) {
        buttons[key].addEventListener("click", () => switchSection(key));
    }
});

/* default */
switchSection("incoming");


/* =========================
   ELEMENTS
========================= */

const incomingTable = document.getElementById("incomingTable");
const acceptedTable = document.getElementById("acceptedTable");
const assignedTable = document.getElementById("assignedTable");
const completedTable = document.getElementById("completedTable");

let selectedRequestId = null;

/* =========================
   NOTIFICATION
========================= */

function notify(msg) {
    const area = document.getElementById("notificationArea");
    if (!area) return;

    const div = document.createElement("div");
    div.className = "toast success";
    div.innerHTML = msg;

    area.appendChild(div);
    setTimeout(() => div.remove(), 4000);
}

/* =========================
   EMPTY TABLE
========================= */

function showEmpty(table, msg) {
    if (!table) return;

    if (table.children.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;padding:20px;">
                    ${msg}
                </td>
            </tr>
        `;
    }
}

/* =========================
   LOAD DATA
========================= */

async function loadNgoData() {

    try {

        const res = await fetch("http://localhost:5000/api/ngo/requests");
        const data = await res.json();

        if (!data.success) return;

        const requests = data.requests || [];

        incomingTable.innerHTML = "";
        acceptedTable.innerHTML = "";
        assignedTable.innerHTML = "";
        completedTable.innerHTML = "";

        let incoming = 0, accepted = 0, assigned = 0, completed = 0;

        requests.forEach(item => {

            const status = item.status || "pending";
            const hours_old = item.hours_old || 0;
            const urgent = hours_old >= 6;

            /* =========================
               INCOMING
            ========================= */

            if (status === "pending") {

                incoming++;

                incomingTable.innerHTML += `
                <tr>
                    <td>${item.food_type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.location}</td>
                    <td>
                        ${hours_old} hrs
                        ${urgent ? "<span style='color:red;font-weight:bold'>URGENT</span>" : ""}
                    </td>
                    <td>${status}</td>
                    <td>
                        <button class="btn btn-accept" onclick="acceptRequest(${item.id})">Accept</button>
                        <button class="btn btn-reject" onclick="rejectRequest(${item.id})">Reject</button>
                    </td>
                </tr>`;
            }

            /* =========================
               ACCEPTED
            ========================= */

            if (status === "accepted") {

                accepted++;

                acceptedTable.innerHTML += `
                <tr>
                    <td>${item.food_type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.location}</td>
                    <td>${item.food_category || "-"}</td>
                    <td><span class="status-badge accepted">Accepted</span></td>
                    <td>
                        <button class="btn btn-assign" onclick="openAssignModal(${item.id})">
                            Assign
                        </button>
                    </td>
                </tr>`;
            }

            /* =========================
               ASSIGNED
            ========================= */

            if (["assigned", "pickup", "delivering"].includes(status)) {

                assigned++;

                assignedTable.innerHTML += `
                <tr>
                    <td>${item.food_type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.location}</td>
                    <td>${item.assigned_volunteer || "-"}</td>
                    <td><span class="status-badge assigned">${status}</span></td>
                   <td>
    <button class="btn btn-view" onclick="trackDelivery(${item.id})">
        Track Delivery
    </button>
</td>
                </tr>`;
            }

            /* =========================
               COMPLETED
            ========================= */

            if (status === "completed") {

                completed++;

                completedTable.innerHTML += `
                <tr>
                    <td>${item.food_type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.location}</td>
                    <td>${item.assigned_volunteer || "-"}</td>
                    <td><span class="status-badge completed">Completed</span></td>
                </tr>`;
            }

        });
        const stats = data.stats;
        document.getElementById("incomingBadge").innerText =
    stats.incoming;
    document.getElementById("todayCount").innerText =
    stats.today;

document.getElementById("weekCount").innerText =
    stats.this_week;

        showEmpty(incomingTable, "No incoming requests");
        showEmpty(acceptedTable, "No accepted requests");
        showEmpty(assignedTable, "No assigned deliveries");
        showEmpty(completedTable, "No completed deliveries");

       document.getElementById("incomingCount").innerText =
    `${incoming} pending`;
        document.getElementById("acceptedCount").innerText = accepted;
        document.getElementById("assignedCount").innerText = assigned;
        document.getElementById("completedCount").innerText = completed;

    } catch (err) {
        console.log("NGO LOAD ERROR:", err);
    }
}

/* =========================
   ACTIONS
========================= */

function acceptRequest(id) {
    fetch(`http://localhost:5000/api/ngo/accept/${id}`, { method: "PUT" })
        .then(() => {
            notify("Request Accepted");
            loadNgoData();
        });
}

function rejectRequest(id) {
    fetch(`http://localhost:5000/api/ngo/reject/${id}`, { method: "PUT" })
        .then(() => {
            notify("Request Rejected");
            loadNgoData();
        });
}

/* =========================
   ASSIGN VOLUNTEER
========================= */

function openAssignModal(id) {
    selectedRequestId = id;
    document.getElementById("assignModal").style.display = "block";

    document.getElementById("volunteerList").innerHTML = `
        <button onclick="assignVolunteer('Rahul')" class="btn btn-view">Rahul</button>
        <button onclick="assignVolunteer('Amit')" class="btn btn-view">Amit</button>
        <button onclick="assignVolunteer('Neha')" class="btn btn-view">Neha</button>
    `;
}

function closeAssignModal() {
    document.getElementById("assignModal").style.display = "none";
}

function assignVolunteer(name) {

fetch(`http://localhost:5000/api/ngo/assign/${selectedRequestId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ volunteer: name })
})
        .then((res) => res.json())
.then((data) => {

    if (data.success) {

        notify("Volunteer Assigned");
        closeAssignModal();

        setTimeout(() => {
            loadNgoData();
        }, 200); // small delay ensures DB update completes
    }
});
}

/* =========================
   SOCKET
========================= */

socket.on("new-waste-request", () => {
    notify("New Request Received");
    loadNgoData();
});

socket.on("ngo-update", () => {
    loadNgoData();
});
function trackDelivery(id) {
    alert("Tracking delivery ID: " + id);
}
/* =========================
   INIT
========================= */

loadNgoData();