// 
// API BASE URL
// ===============================

const API_URL = 'http://localhost:5000/api';
const API = 'http://localhost:5000/api/admin';


const sections = document.querySelectorAll('main section');
/*
=====================================
FETCH USERS
=====================================
*/
async function fetchUsers() {

    try {

        const res = await fetch(`${API}/users`);

        const data = await res.json();

        renderUsers(data.users);

    }

    catch (err) {

        console.log(err);

    }

}

document.querySelectorAll('.menu li').forEach(item => {

    item.addEventListener('click', () => {

        document
            .querySelectorAll('.menu li')
            .forEach(li => li.classList.remove('active'));

        item.classList.add('active');

        sections.forEach(sec => {
            sec.style.display = 'none';
        });

        document
            .getElementById(
                item.dataset.section
            ).style.display = 'block';

    });

});

document
    .getElementById('logoutBtn')
    .addEventListener('click', () => {

        localStorage.clear();

        window.location.href = '/login.html';

    });

async function fetchDonations() {

    try {

        const res = await fetch(`${API}/donations`);

        const data = await res.json();

        renderDonations(data.donations);

        updateStats(data.donations);
        renderCharts(data.donations);

        renderWasteAnalytics(data.donations);

    }

    catch (err) {

        console.log(err);

    }

}

function updateStats(data) {

    const total = data.length;

    const accepted = data.filter(
        d => d.status === 'accepted'
    ).length;

    const rejected = data.filter(
        d => d.status === 'rejected'
    ).length;

    const completed = data.filter(
        d => d.status === 'completed'
    ).length;

    document.getElementById(
        'totalDonations'
    ).innerText = total;

    document.getElementById(
        'acceptedDonations'
    ).innerText = accepted;

    document.getElementById(
        'rejectedDonations'
    ).innerText = rejected;

    document.getElementById(
        'completedDonations'
    ).innerText = completed;

    document.getElementById(
        'heroMeals'
    ).innerText = total * 12;

}

function renderDonations(data) {

    const table = document.getElementById('adminTable');

    table.innerHTML = '';

    data.forEach(donation => {

        table.innerHTML += `

        <tr>

            <td>${donation.food_type}</td>

            <td>${donation.quantity}</td>

            <td>${donation.location}</td>

            <td>

                <span class="status ${donation.status}">

                    ${donation.status}

                </span>

            </td>

            <td>

                <select onchange="assignNgo('${donation.id}',this.value)">

                    <option>Assign NGO</option>

                    <option>Helping Hands</option>

                    <option>Food Bank</option>

                </select>

            </td>

            <td>

                <select onchange="assignVolunteer('${donation.id}',this.value)">

                    <option>Assign Volunteer</option>

                    <option>Rahul</option>

                    <option>Ankit</option>

                </select>

            </td>

            <td>

                <div class="action-buttons">

                    <button
                    class="accept-btn"
                    onclick="acceptDonation('${donation.id}')">

                        Accept

                    </button>

                    <button
                    class="reject-btn"
                    onclick="rejectDonation('${donation.id}')">

                        Reject

                    </button>

                    <button
                    class="complete-btn"
                    onclick="completeDonation('${donation.id}')">

                        Complete

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

async function acceptDonation(id) {

    await fetch(`${API}/accept/${id}`, {
        method: 'PUT'
    });

    fetchDonations();

}

async function rejectDonation(id) {

    await fetch(`${API}/reject/${id}`, {
        method: 'PUT'
    });

    fetchDonations();

}

async function completeDonation(id) {

    await fetch(`${API}/complete/${id}`, {
        method: 'PUT'
    });

    fetchDonations();

}

async function assignNgo(id, ngo) {

    await fetch(`${API}/assign-ngo/${id}`, {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ ngo })

    });

}

async function assignVolunteer(id, volunteer) {

    await fetch(`${API}/assign-volunteer/${id}`, {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({ volunteer })

    });

}

let donationChart;
let statusChart;

function renderCharts(data) {

    const accepted = data.filter(
        d => d.status === 'accepted'
    ).length;

    const rejected = data.filter(
        d => d.status === 'rejected'
    ).length;

    const completed = data.filter(
        d => d.status === 'completed'
    ).length;

    const pending = data.filter(
        d => d.status === 'pending'
    ).length;

    if (donationChart) {

        donationChart.destroy();

    }

    if (statusChart) {

        statusChart.destroy();

    }

    donationChart = new Chart(

        document.getElementById('donationChart'),

        {

            type: 'bar',

            data: {

                labels: [
                    'Accepted',
                    'Rejected',
                    'Completed',
                    'Pending'
                ],

                datasets: [{

                    data: [
                        accepted,
                        rejected,
                        completed,
                        pending
                    ],

                    backgroundColor: [
                        '#22c55e',
                        '#ef4444',
                        '#3b82f6',
                        '#f59e0b'
                    ]

                }]

            }

        }

    );

    statusChart = new Chart(

        document.getElementById('statusChart'),

        {

            type: 'doughnut',

            data: {

                labels: [
                    'Accepted',
                    'Rejected',
                    'Completed',
                    'Pending'
                ],

                datasets: [{

                    data: [
                        accepted,
                        rejected,
                        completed,
                        pending
                    ],

                    backgroundColor: [
                        '#22c55e',
                        '#ef4444',
                        '#3b82f6',
                        '#f59e0b'
                    ]

                }]

            }

        }

    );

}

// fetchDonations();


/*
=====================================
RENDER USERS
=====================================
*/

function renderUsers(users) {

    const usersTable = document.getElementById('usersTable');

    usersTable.innerHTML = '';

    users.forEach(user => {

        const statusClass =
            user.status === 'Blocked'
                ? 'blocked'
                : 'active';

        usersTable.innerHTML += `

        <tr>

            <td>${user.name}</td>

            <td>${user.email}</td>

            <td>${user.role}</td>

            <td>

                <span class="user-status ${statusClass}">

                    ${user.status}

                </span>

            </td>

            <td>

                <button
                    class="user-action-btn"
                    onclick="toggleUserStatus(
                        ${user.id},
                        '${user.status}'
                    )"
                >

                    ${user.status === 'Blocked'
                ? 'Activate'
                : 'Block'
            }

                </button>

            </td>

        </tr>

        `;

    });

}
async function toggleUserStatus(id, currentStatus) {

    try {

        const newStatus =
            currentStatus === 'Blocked'
                ? 'Active'
                : 'Blocked';

        const res = await fetch(

            `${API_URL}/admin/users/${id}/status`,

            {

                method: 'PUT',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    status: newStatus
                })

            }

        );

        const data = await res.json();

        if (data.success) {

            fetchUsers();

        }

    }

    catch (err) {

        console.log(err);

    }

}
/*
=====================================
WASTE ANALYTICS
=====================================
*/

function renderWasteAnalytics(data) {

    let totalFood = 0;

    data.forEach(d => {

        totalFood += parseInt(d.quantity) || 0;

    });

    document.getElementById(
        'foodSaved'
    ).innerText = totalFood + ' KG';

    document.getElementById(
        'co2Reduced'
    ).innerText = (totalFood * 2) + ' KG';

    document.getElementById(
        'mealsDistributed'
    ).innerText = totalFood * 4;

    new Chart(

        document.getElementById('wasteChart'),

        {

            type: 'line',

            data: {

                labels: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun'
                ],

                datasets: [{

                    label: 'Food Saved',

                    data: [12, 19, 8, 15, 22, 31],

                    borderColor: '#22c55e',

                    backgroundColor: 'rgba(34,197,94,0.2)',

                    tension: 0.4,

                    fill: true

                }]

            }

        }

    );

}
// ======================================
// USER MANAGEMENT SYSTEM
// ======================================

const usersTable = document.getElementById('usersTable');

const totalUsers = document.getElementById('totalUsers');

const activeUsers = document.getElementById('activeUsers');

const blockedUsers = document.getElementById('blockedUsers');

const userSearch = document.getElementById('userSearch');

const roleFilter = document.getElementById('roleFilter');

let allUsers = [];

/*
=====================================
FETCH USERS
=====================================
*/

async function fetchUsers() {

    try {

        const res = await fetch(

            `${API_URL}/admin/users`

        );

        const data = await res.json();

        allUsers = data.users;

        renderUsers(allUsers);

        updateUserStats(allUsers);

    }

    catch (err) {

        console.log(err);

    }

}

/*
=====================================
RENDER USERS
=====================================
*/

function renderUsers(users) {

    usersTable.innerHTML = '';

    if (users.length === 0) {

        usersTable.innerHTML = `

        <tr>

            <td colspan="6" class="empty-row">

                No Users Found

            </td>

        </tr>

        `;

        return;

    }

    users.forEach(user => {

        const initials = user.name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase();

        // FIX STATUS
        const userStatus = user.status || 'active';

        usersTable.innerHTML += `

    <tr>

        <td>

            <div class="user-info">

                <div class="user-avatar">

                    ${initials}

                </div>

                <div>

                    <h4>

                        ${user.name}

                    </h4>

                </div>

            </div>

        </td>

        <td>

            ${user.email}

        </td>

        <td>

            <span class="user-role role-${user.role}">

                ${user.role}

            </span>

        </td>

    <td>

    <span class="
        user-status
        ${user.status === 'blocked'
                ? 'status-blocked'
                : 'status-active'}
    ">

        ${user.status || 'active'}

    </span>

</td>

        <td>

            ${user.created_at
                ? new Date(user.created_at)
                    .toLocaleDateString()
                : 'N/A'
            }

        </td>

        <td>

            <div class="user-actions">

    <button
    class="
        ${user.status === 'blocked'
        ? 'activate-btn'
        : 'block-btn'}
    "

  onclick="toggleUserStatus(
    '${user.id}',
    '${user.status || 'active'}'
)"]"
>
${(user.status || 'active') === 'blocked'
? 'Activate'
: 'Block'}

</button>

                <button
                    class="delete-btn"
                    onclick="deleteUser('${user.id}')"
                >

                    Delete

                </button>

            </div>

        </td>

    </tr>

    `;

    });

}

/*
=====================================
UPDATE STATS
=====================================
*/

function updateUserStats(users) {

    totalUsers.innerText = users.length;

    activeUsers.innerText = users.filter(
        u => u.status === 'active'
    ).length;

    blockedUsers.innerText = users.filter(
        u => u.status === 'blocked'
    ).length;

}

/*
=====================================
SEARCH USERS
=====================================
*/

userSearch.addEventListener('input', () => {

    filterUsers();

});

/*
=====================================
FILTER ROLE
=====================================
*/

roleFilter.addEventListener('change', () => {

    filterUsers();

});

/*
=====================================
FILTER FUNCTION
=====================================
*/

function filterUsers() {

    const search = userSearch.value.toLowerCase();

    const role = roleFilter.value;

    let filtered = allUsers.filter(user => {

        const matchesSearch =

            user.name.toLowerCase()
                .includes(search)

            ||

            user.email.toLowerCase()
                .includes(search);

        const matchesRole =

            role === 'all'

            ||

            user.role === role;

        return matchesSearch && matchesRole;

    });

    renderUsers(filtered);

}

/*
=====================================
BLOCK / ACTIVATE USER
=====================================
*/
// ===============================
// TOGGLE USER STATUS
// ===============================

/*
=====================================
TOGGLE USER STATUS
=====================================
*/

async function toggleUserStatus(id, currentStatus){

    try{

        console.log("CURRENT STATUS:", currentStatus);

        // TOGGLE STATUS
        const newStatus =
        currentStatus === 'active'
        ? 'blocked'
        : 'active';

        console.log("NEW STATUS:", newStatus);

        const res = await fetch(

            `${API_URL}/admin/users/${id}/status`,

            {
                method:'PUT',

                headers:{
                    'Content-Type':'application/json'
                },

                body:JSON.stringify({
                    status:newStatus
                })

            }

        );

        const data = await res.json();

        console.log(data);

        if(data.success){

            showToast(`User is now ${newStatus}`);

            // REFRESH USERS
            fetchUsers();

            // REFRESH DASHBOARD STATS
            fetchDashboardStats();

        }

        else{

            showToast('Status update failed','error');

        }

    }

    catch(err){

        console.log(err);

    }

}
/*
=====================================
DELETE USER
=====================================
*/

async function deleteUser(id) {

    const confirmDelete = confirm(

        'Delete this user?'

    );

    if (!confirmDelete) return;

    try {

        const res = await fetch(

            `${API_URL}/admin/users/${id}`,

            {

                method: 'DELETE'

            }

        );

        const data = await res.json();

        showToast(data.message);

        fetchUsers();

    }

    catch (err) {

        console.log(err);

    }

}

/*
=====================================
INITIAL FETCH
=====================================
*/
// ===============================
// TOAST NOTIFICATION
// ===============================

function showToast(message, type = 'success') {

    const toast = document.createElement('div');

    toast.className = `toast ${type}`;

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add('show');

    }, 100);

    setTimeout(() => {

        toast.classList.remove('show');

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}
/*
=====================================
FETCH DASHBOARD STATS
=====================================
*/

async function fetchDashboardStats(){

    try{

        const res = await fetch(
            `${API_URL}/admin/stats`
        );

        const data = await res.json();

        // DONATION STATS
        document.getElementById(
            'totalDonations'
        ).innerText =
        data.stats.totalDonations || 0;

        document.getElementById(
            'acceptedDonations'
        ).innerText =
        data.stats.acceptedDonations || 0;

        document.getElementById(
            'rejectedDonations'
        ).innerText =
        data.stats.rejectedDonations || 0;

        // USER STATS
        document.getElementById(
            'totalUsers'
        ).innerText =
        data.stats.totalUsers || 0;

        document.getElementById(
            'blockedUsers'
        ).innerText =
        data.stats.blockedUsers || 0;

    }

    catch(err){

        console.log(err);

    }

}
// fetchUsers();
fetchDonations();
fetchDashboardStats();
fetchUsers();