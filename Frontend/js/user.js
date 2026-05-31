const socket = io("http://localhost:5000");


const availableTable = document.getElementById("availableTable");
const myClaimsTable = document.getElementById("myClaimsTable");

/* For demo (replace with login system later) */
const currentUserId = 1;

/* =========================
   NOTIFICATION
========================= */

function notify(msg) {
    const area = document.getElementById("notificationArea");

    if (!area) return;

    const div = document.createElement("div");
    div.className = "toast";
    div.innerHTML = msg;

    area.appendChild(div);

    setTimeout(() => div.remove(), 4000);
}

/* =========================
   EMPTY TABLE HANDLER
========================= */

function showEmpty(table, msg) {
    if (!table) return;

    if (table.innerHTML.trim() === "") {
        table.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;padding:20px;">
                    ${msg}
                </td>
            </tr>
        `;
    }
}

/* =========================
   LOAD AVAILABLE FOOD
========================= */

async function loadAvailableFood() {

    try {

        availableTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    Loading...
                </td>
            </tr>
        `;

        const res = await fetch("http://localhost:5000/api/user/available");
        const data = await res.json();

        availableTable.innerHTML = "";

        if (!data.success) return;

        const foods = data.foods || [];

        foods.forEach(item => {

            availableTable.innerHTML += `
                <tr>
                    <td>${item.food_type}</td>
                    <td>${item.quantity}</td>
                    <td>${item.location || "-"}</td>
                    <td>
                        <button class="claim-btn" onclick="claimFood(${item.id})">
                            Claim
                        </button>
                    </td>
                </tr>
            `;

        });

        showEmpty(availableTable, "No food available");

    } catch (err) {
        console.log(err);
        notify("Error loading food");
    }
}

/* =========================
   CLAIM FOOD
========================= */

function claimFood(id) {

    fetch(`/api/user/claim/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: 1 // replace with logged-in user
        })
    })
    .then(res => res.json())
    .then(data => {

        if (!data.success) {
            alert(data.message || "Claim failed");
            return;
        }

        loadAvailableFood();
        loadMyClaims();

        alert("Food claimed successfully");
    })
    .catch(err => console.log(err));
}

/* =========================
   MY CLAIMS
========================= */

function loadMyClaims() {
    fetch("/api/user/claims/1")
        .then(res => res.json())
        .then(data => {
            renderClaims(data.claims);
        });
}


function renderClaims(claims) {
    const table = document.getElementById("myClaimsTable");

    table.innerHTML = "";

    if (!claims.length) {
        table.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No claims yet
                </td>
            </tr>
        `;
        return;
    }

    claims.forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${item.food_type}</td>
                <td>${item.quantity}</td>
                <td>${item.location}</td>
                <td>${item.status}</td>
                <td>${item.created_at}</td>
            </tr>
        `;
    });
}
/* =========================
   SOCKET EVENTS (REALTIME)
========================= */

socket.on("food-updated", () => {
    loadAvailableFood();
});

socket.on("claim-updated", () => {
    loadMyClaims();
});

/* =========================
   INIT
========================= */

loadAvailableFood();
loadMyClaims();