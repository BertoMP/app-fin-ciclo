class UserModel {
    static saveUser(dbConn, email, encryptedPassword) {
        return dbConn.execute(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, encryptedPassword]
        );
    }

    static findByEmail(dbConn, email) {
        return dbConn.execute(
            'SELECT email, password FROM users WHERE email = ?',
            [email]
        );
    }

    static updateUser(dbConn, email, encryptedPassword) {
        return dbConn.execute(
            'UPDATE users SET password = ? WHERE email = ?',
            [encryptedPassword, email]
        );
    }

    static deleteUser(dbConn, email) {
        return dbConn.execute(
            'DELETE FROM users WHERE email = ?',
            [email]
        );
    }

    static fetchAll(dbConn) {
        return dbConn.execute('SELECT email, password FROM users');
    }
}

module.exports = UserModel;
