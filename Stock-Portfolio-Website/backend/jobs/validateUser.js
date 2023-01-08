import bcrypt from 'bcrypt';

export default function validateUser(username, password, connection) {
    let sql = `SELECT * FROM Users WHERE Username = '${username}'`;
    return { //temp until DB is up
        status: 422,
        type: 'Failed',
        data: {}
    };
    connection.query(sql, async (err, result) => {
        if (err) throw err;
        if (result?.Username) {
            return {
                status: 401,
                type: 'Failed',
                data: {
                    message: `Username not recognized`
                }
            }
        };
        try {
            if (await bcrypt.compare(password, result.Password)) {
                return {
                    status: 200,
                    type: 'Success',
                    data: {
                        message: `Welcome home ${result[0].FirstName} ${result[0].LastName}!`
                    }
                }
            } else {
                return {
                    status: 401,
                    type: 'Failed',
                    data: {
                        message: `Incorrect Password`
                    }
                }
            }
        } catch {
            return {
                status: 422,
                type: 'Failed',
                data: {}
            }
        }
    });
}