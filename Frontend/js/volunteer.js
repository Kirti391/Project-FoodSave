const socket = io("http://localhost:5000");

//    SECTIONS

const sections = {
    dashboard: document.getElementById("dashboardSection"),
    assigned: document.getElementById("assignedSection"),
    active: document.getElementById("activeSection"),
    completed: document.getElementById("completedSection")
};

//  BUTTONS 

const buttons = {
    dashboard: document.getElementById("dashboardBtn"),
    assigned: document.getElementById("assignedBtn"),
    active: document.getElementById("activeBtn"),
    completed: document.getElementById("completedBtn")
};


//    NAVIGATION HELPERS

function hideAllSections() {

    Object.values(sections).forEach(section => {

        if (section) {
            section.style.display = "none";
        }

    });

}

function removeActiveButtons() {

    Object.values(buttons).forEach(btn => {

        if (btn) {
            btn.classList.remove("active");
        }

    });

}

function activateSection(sectionKey, buttonKey) {

    hideAllSections();

    removeActiveButtons();

    if (sections[sectionKey]) {
        sections[sectionKey].style.display = "block";
    }

    if (buttons[buttonKey]) {
        buttons[buttonKey].classList.add("active");
    }

}


//    BUTTON EVENTS

buttons.dashboard?.addEventListener("click", () => {

    activateSection("dashboard", "dashboard");

});

buttons.assigned?.addEventListener("click", () => {

    activateSection("assigned", "assigned");

});

buttons.active?.addEventListener("click", () => {

    activateSection("active", "active");

});

buttons.completed?.addEventListener("click", () => {

    activateSection("completed", "completed");

});


//    DEFAULT SECTION

activateSection("dashboard", "dashboard");

//    NOTIFICATIONS

function showNotification(message) {

    const area = document.getElementById("notificationArea");

    if (!area) return;

    const div = document.createElement("div");

    div.className = "notification";

    div.innerHTML = message;

    area.appendChild(div);

    setTimeout(() => {

        div.remove();

    }, 4000);

}


//    EMPTY TABLE HANDLER

function showEmpty(table, message) {

    if (!table) return;

    if (table.innerHTML.trim() === "") {

        table.innerHTML = `
            <tr>
                <td colspan="5"
                    style="text-align:center; padding:20px;">
                    ${message}
                </td>
            </tr>
        `;

    }

}

//   STATUS COLORS

function getStatusColor(status) {

    switch (status) {

        case "accepted":
            return "orange";

        case "pickup":
            return "blue";

        case "delivering":
            return "purple";

        case "completed":
            return "green";

        default:
            return "gray";

    }

}

// LOAD VOLUNTEER DATA

async function loadVolunteerData() {

    try {

        const res = await fetch(
            "http://localhost:5000/api/volunteer/deliveries"
        );

        const data = await res.json();

        console.log("VOLUNTEER DATA:", data);

        if (!data.success) return;

        const deliveries = data.deliveries || [];

        /* TABLES */

        const assignedTable =
            document.getElementById("assignedTable");

        const activeTable =
            document.getElementById("activeTable");

        const completedTable =
            document.getElementById("completedTable");

        /* CLEAR TABLES */

        if (assignedTable) assignedTable.innerHTML = "";

        if (activeTable) activeTable.innerHTML = "";

        if (completedTable) completedTable.innerHTML = "";

        /* COUNTERS */
let total = 0;
let active = 0;
let completed = 0;
let foodDelivered = 0;

let assignedCount = 0;
let activeCount = 0;
let completedCount = 0;
        let totalPickups = 0;


        let deliveredKg = 0;
        deliveries.forEach(item => {

            total++;
            totalPickups++;

            const status = item.status || "accepted";

            /* =========================
               ASSIGNED PICKUPS
            ========================= */

            if (status === "accepted") {

                assignedCount++;

                assignedTable.innerHTML += `
            <tr>
                <td>${item.food_type}</td>
                <td>${item.quantity}</td>
                <td>${item.location || "-"}</td>
                <td>
                    <button onclick="startPickup(${item.id})">
                        Start Pickup
                    </button>
                </td>
            </tr>
        `;
            }

           /* =========================
   ACTIVE DELIVERIES
========================= */

if (
    status === "pickup" ||
    status === "pickup_started" ||
    status === "delivering" ||
    status === "processing"
) {

    activeCount++;
    active++;

    activeTable.innerHTML += `
        <tr style="border-left:4px solid ${getStatusColor(status)}">

            <td>${item.food_type}</td>

            <td>${item.quantity}</td>

            <td>${item.location || "-"}</td>

            <td>${status}</td>

            <td>

                ${
                    status === "pickup" ||
                    status === "pickup_started"

                    ?

                    `
                    <button onclick="startDelivery(${item.id})">
                        Start Delivery
                    </button>
                    `

                    :

                    `
                    <button onclick="completeDelivery(${item.id})">
                        Mark Delivered
                    </button>
                    `
                }

            </td>

        </tr>
    `;
}

            /* =========================
               COMPLETED DELIVERIES
            ========================= */

            if (
                status === "completed" ||
                status === "delivered"
            ) {

                completed++;
                completedCount++;

          deliveredKg += parseInt(item.quantity) || 0;

                completedTable.innerHTML += `
            <tr>
                <td>${item.food_type}</td>
                <td>${item.quantity}</td>
                <td>${item.location || "-"}</td>
                <td style="color:green;">
                    Delivered
                </td>
            </tr>
        `;
            }

        });

        /* EMPTY STATES */

        showEmpty(
            assignedTable,
            "No assigned pickups"
        );

        showEmpty(
            activeTable,
            "No active deliveries"
        );

        showEmpty(
            completedTable,
            "No completed deliveries"
        );

        /* =========================
           UPDATE DASHBOARD STATS
        ========================= */

        const totalEl =
            document.getElementById("totalPickups");

        const activeEl =
            document.getElementById("activeDeliveries");

        const completedEl =
            document.getElementById("completedDeliveries");

        const foodDeliveredEl =
            document.getElementById("foodDelivered");

  if (totalEl) {
    totalEl.innerText = total;
}
        if (activeEl) {
            activeEl.innerText = activeCount;
        }

        if (completedEl) {
            completedEl.innerText = completedCount;
        }

        if (foodDeliveredEl) {
            foodDeliveredEl.innerText =
                deliveredKg + " kg";
        }

        /* EXTRA SMALL STATS */

        const assignedCountEl =
            document.getElementById("assignedCount");

        const activeCountEl =
            document.getElementById("activeCount");

        const completedCountEl =
            document.getElementById("completedCount");

        if (assignedCountEl) {
            assignedCountEl.innerText =
                assignedCount;
        }

        if (activeCountEl) {
            activeCountEl.innerText =
                activeCount;
        }

        if (completedCountEl) {
            completedCountEl.innerText =
                completedCount;
        }

    } catch (err) {

        console.log("ERROR:", err);

    }

}
// START PICKUP
function startPickup(id) {

    fetch(
        `http://localhost:5000/api/volunteer/pickup/${id}`,
        {
            method: "PUT"
        }
    )
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                showNotification(
                    "🚚 Pickup Started"
                );

                loadVolunteerData();

            }

        })
        .catch(err => {

            console.log(err);

        });

}

/* =========================
   START DELIVERY
========================= */

function startDelivery(id) {

    fetch(
        `http://localhost:5000/api/volunteer/deliver/${id}`,
        {
            method: "PUT"
        }
    )
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                showNotification(
                    "📦 Delivery Started"
                );

                loadVolunteerData();

            }

        })
        .catch(err => {

            console.log(err);

        });

}

/* =========================
   COMPLETE DELIVERY
========================= */

function completeDelivery(id) {

    fetch(
        `http://localhost:5000/api/volunteer/complete/${id}`,
        {
            method: "PUT"
        }
    )
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                showNotification(
                    "✅ Delivery Completed"
                );

                loadVolunteerData();

            }

        })
        .catch(err => {

            console.log(err);

        });

}

/* =========================
   SOCKET EVENTS
========================= */

socket.on("pickup-assigned", (data) => {

    showNotification(`
        🚚 New Pickup Assigned:
        ${data.food_type}
    `);

    loadVolunteerData();

});

socket.on("pickup-started", () => {

    loadVolunteerData();

});

socket.on("delivery-completed", () => {

    loadVolunteerData();

});

socket.on("new-pickup", (data) => {

    showNotification(`
        🚚 New Pickup:
        ${data.food_type}
    `);

});

/* =========================
   INIT
========================= */

loadVolunteerData();