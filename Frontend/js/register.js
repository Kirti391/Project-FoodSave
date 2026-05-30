const registerForm = document.getElementById('registerForm');

if (registerForm) {

    registerForm.addEventListener('submit', async (e) => {

        e.preventDefault();

        const userData = {

            name: document.getElementById('name').value.trim(),

            email: document.getElementById('email').value.trim(),

            password: document.getElementById('password').value.trim(),

            phone: document.getElementById('phone').value.trim(),

            role: document.getElementById('role').value

        };

        try {

            const response = await fetch(

                'http://localhost:5000/api/auth/register',

                {

                    method: 'POST',

                    headers: {

                        'Content-Type': 'application/json'

                    },

                    body: JSON.stringify(userData)

                }

            );

            const data = await response.json();

            console.log(data);

            // SUCCESS

            if (data.success) {

                alert('Registration Successful');

                window.location.href = '/login.html';

            }

            // USER EXISTS

            else {

                alert(data.message);

            }

        }

        catch (error) {

            console.log(error);

            alert('Registration Error');

        }

    });

}