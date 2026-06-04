const bcrypt = require('bcryptjs');
bcrypt.hash('newpassword123', 10, (err, hash) => {
    console.log(hash);
});