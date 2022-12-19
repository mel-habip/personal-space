



async function create_user(username, password, welcome_name, permission_level = 3) {
    let new_user = {
        username,
        password,
        welcome_name,
        permission_level
    };
    let update = await fetch('./databases/users.json', {
        method: 'POST',
        body: new_user,
        headers: {
            'Authorization': 'Bearer ' + this.token
        }
    });
    console.log(update);
};


// module.exports = create_user;