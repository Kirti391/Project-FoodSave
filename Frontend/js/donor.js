const socket = io("http://localhost:5000");

const donorTable = document.getElementById('donorTable');
const completedTable = document.getElementById('completedTable');

const dashboardSection = document.getElementById('dashboardSection');
const donationsSection = document.getElementById('donationsSection');
const completedSection = document.getElementById('completedSection');
const donateSection = document.getElementById('donateSection');

const user = JSON.parse(localStorage.getItem('user'));

/*
===================================
REAL-TIME SOCKET
===================================
*/

socket.on("donationUpdated", () => {
    loadDonations();
});

/*
NOTIFICATIONS
*/
let notifications = [];

// socket.on("notification", (data) => {
//     notifications.push(data);
//     showToast(data.message);
// });
socket.on("notification", (data) => {

    notifications.push(data);

    showToast(`${data.title}: ${data.message}`);

    addNotificationToCenter(data);

});

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/*
===================================
LOAD DONATIONS (API)
===================================
*/

async function loadDonations() {
    try {

        // 🟡 LOADING STATE (NEW)
        if (donorTable) {
            donorTable.innerHTML = `
                <tr><td colspan="7">Loading donations...</td></tr>
            `;
        }

        const res = await fetch(
            `http://localhost:5000/api/donor/donations/${user.email}`
        );

        const data = await res.json();

        if (!data.success) return;

        // 🟡 EMPTY STATE (NEW)
        if (data.donations.length === 0) {
            if (donorTable) {
                donorTable.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align:center; padding:20px;">
                            🌱 No donations yet. Start making impact!
                        </td>
                    </tr>
                `;
            }
            return;
        }

        renderStats(data.donations);
        renderTables(data.donations);

    } catch (err) {
        console.log(err);
    }
}

/*
===================================
RENDER STATS + GAMIFICATION
===================================
*/

function renderStats(donations) {

    document.getElementById("totalDonations").innerText =
        donations.length;

    document.getElementById("acceptedDonations").innerText =
        donations.filter(d => d.status === "accepted").length;

    document.getElementById("completedDonations").innerText =
        donations.filter(d => d.status === "completed").length;

    // 🎮 GAMIFICATION
    const total = donations.length;
    let score = total * 10;

    let badge = "New Donor";

    if (score > 100) badge = "Gold Donor";
    else if (score > 50) badge = "Silver Donor";
    else if (score > 20) badge = "Bronze Donor";

    const badgeEl = document.getElementById("donorBadge");
    const scoreEl = document.getElementById("donorScore");

    if (badgeEl) badgeEl.innerText = badge;
    if (scoreEl) scoreEl.innerText = score;
    calculateGamification(donations);
}

/*
===================================
RENDER TABLES
===================================
*/

function renderTables(donations) {

    if (donorTable) donorTable.innerHTML = '';
    if (completedTable) completedTable.innerHTML = '';

    donations.forEach((donation) => {

        // ACTIVE TABLE
        if (donorTable) {
            donorTable.innerHTML += `
                <tr>
                    <td>${donation.food_type}</td>
                    <td>${donation.quantity}</td>
                    <td>${donation.location}</td>
                    <td>
                        <div class="timeline">
                            <span class="${donation.status === 'submitted' ? 'active' : ''}">Submitted</span>
                            <span class="${donation.status === 'accepted' ? 'active' : ''}">Accepted</span>
                            <span class="${donation.status === 'volunteer_assigned' ? 'active' : ''}">Volunteer</span>
                            <span class="${donation.status === 'completed' ? 'active' : ''}">Delivered</span>
                        </div>
                    </td>
                    <td>${donation.ngo_assigned || 'Pending'}</td>
                    <td>${donation.volunteer_assigned || 'Pending'}</td>
                    <td>${donation.pickup_status || 'waiting'}</td>
                </tr>
            `;
        }

        // COMPLETED TABLE
        if (completedTable && donation.status === 'completed') {
            completedTable.innerHTML += `
                <tr>
                    <td>${donation.food_type}</td>
                    <td>${donation.quantity}</td>
                    <td>${donation.location}</td>
                    <td>${donation.status}</td>
                </tr>
            `;
        }

    });
}

/*
===================================
DONATION FORM SUBMIT
===================================
*/

const donationForm = document.getElementById('donationForm');

if (donationForm) {
    donationForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const formData = {
            food_type: document.getElementById('food_type').value,
            quantity: document.getElementById('quantity').value,
            hours_old: document.getElementById('hours_old').value,
            food_condition: document.getElementById('food_condition').value,
            location: document.getElementById('location').value,
            food_category: document.getElementById('food_category').value,
            donor_email: user.email
        };

        try {
            const response = await fetch(
                'http://localhost:5000/api/food/submit',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            alert(data.message);

            donationForm.reset();

            loadDonations();

        } catch (error) {
            console.log(error);
        }
    });
}

/*
===================================
SIDEBAR NAVIGATION
===================================
*/

function hideAllSections() {
    dashboardSection.style.display = 'none';
    donationsSection.style.display = 'none';
    completedSection.style.display = 'none';
    donateSection.style.display = 'none';
}

document.getElementById('donateBtn').addEventListener('click', () => {
    hideAllSections();
    donateSection.style.display = 'block';
});

document.getElementById('dashboardBtn').addEventListener('click', () => {
    hideAllSections();
    dashboardSection.style.display = 'block';
});

document.getElementById('donationsBtn').addEventListener('click', () => {
    hideAllSections();
    donationsSection.style.display = 'block';
});

document.getElementById('completedBtn').addEventListener('click', () => {
    hideAllSections();
    completedSection.style.display = 'block';
});

/*
===================================
MOBILE MENU
===================================
*/

const mobileMenu = document.getElementById('mobileMenu');
const sidebar = document.getElementById('sidebar');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        sidebar.classList.toggle('showSidebar');
    });
}

/*
===================================
LOGOUT
===================================
*/

document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/login.html';
});

/*
===================================
LOGO NAVIGATION
===================================
*/

document.querySelector(".logo").addEventListener("click", () => {
    window.location.href = "../index.html";
});

/*
===================================
INITIAL LOAD
===================================
*/
function addNotificationToCenter(data) {

    let container = document.getElementById("notificationCenter");

    if (!container) {
        container = document.createElement("div");
        container.id = "notificationCenter";
        container.style.position = "fixed";
        container.style.top = "20px";
        container.style.right = "20px";
        container.style.width = "300px";
        container.style.zIndex = "9999";
        document.body.appendChild(container);
    }

    const item = document.createElement("div");

    item.style.background = "white";
    item.style.padding = "10px";
    item.style.marginBottom = "10px";
    item.style.borderLeft = "5px solid green";
    item.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    item.style.borderRadius = "8px";

    item.innerHTML = `
        <b>${data.title}</b>
        <p>${data.message}</p>
        <small>${new Date(data.timestamp).toLocaleTimeString()}</small>
    `;

    container.appendChild(item);

    setTimeout(() => {
        item.remove();
    }, 5000);
}
function calculateGamification(donations) {

    let score = 0;

    donations.forEach(d => {

        if (d.status === "submitted") score += 10;
        if (d.status === "accepted") score += 20;
        if (d.status === "completed") score += 30;

    });

    let badge = "New Donor";

    if (score >= 200) badge = "Platinum Donor";
    else if (score >= 100) badge = "Gold Donor";
    else if (score >= 50) badge = "Silver Donor";
    else if (score >= 20) badge = "Bronze Donor";

    document.getElementById("donorScore").innerText = score;
    document.getElementById("donorBadge").innerText = badge;
}

loadDonations();