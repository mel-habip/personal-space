async function validate_sign_in(username, password) { //needs updating

    let res = {};
    fetch('./databases/users.json').then(response => response.json()).then(
        all_users => {
            let current_user = all_users.find(user => user.username === username);
            let txt = '';
            if (!current_user) {
                txt = 'User not found';
                console.warn(txt);
                window.alert(txt);
                res = {
                    pass: false,
                    message: txt
                };
            } else if (current_user.password === password) {
                txt = `Welcome home ${current_user.welcome_name}!`;
                window.alert(txt);
                console.log(txt);
                res = {
                    pass: true,
                    message: txt
                };
            } else {
                txt = 'incorrect password';
                console.warn(txt);
                window.alert(txt);
                let password_input = document.getElementById('password_input');
                password_input.value = '';
                res = {
                    pass: false,
                    message: txt
                };
            }
        }
    );
    return res;
};

// module.exports = validate_sign_in;