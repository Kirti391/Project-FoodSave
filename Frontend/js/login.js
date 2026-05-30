const loginForm = document.getElementById('loginForm');

if (loginForm) {

    loginForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const email = document.getElementById('email').value.trim();

        const password = document.getElementById('password').value.trim();

        try {

            const response = await fetch(

                'http://localhost:5000/api/auth/login',

                {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json'

                    },

                    body: JSON.stringify({

                        email,
                        password

                    })

                }

            );

            const data = await response.json();

            console.log(data);

            // LOGIN SUCCESS

            if (data.success) {

                // SAVE TOKEN

                localStorage.setItem(

                    'token',

                    data.token

                );

                // SAVE USER

                localStorage.setItem(

                    'user',

                    JSON.stringify(data.user)

                );

                alert('Login Successful');

                // ROLE BASED REDIRECT

                const role = data.user.role;

                if (role === 'admin') {

                    window.location.href = '/pages/admin.html';

                }

                else if (role === 'ngo') {

                    window.location.href = '/pages/ngo.html';

                }

                else if (role === 'donor') {

                    window.location.href = '/pages/donor.html';

                }

                else if (role === 'volunteer') {

                    window.location.href = '/pages/volunteer.html';

                }

                else if (role === 'farm') {

                    window.location.href = '/pages/farm.html';

                }

                else {

                    alert('Invalid Role');

                }

            }

            // LOGIN FAILED

            else {

                alert(data.message);

            }

        }

        catch (error) {

            console.log(error);

            alert('Login Error');

        }

    });

}