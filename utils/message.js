const MESSAGES = {
    // Basic
    1001: 'Success',

    // Login
    2001: 'Login successfully',
    2002: 'Invalid token',

    // user
    3001: 'User not Found',

    // api error
    9999: 'Something went wrong !!',
    4444: 'Access denied for this route'
};

const get_message = message_code => {
    if (isNaN(message_code)) {
        return message_code;
    }
    return message_code ? MESSAGES[message_code] : message_code;
};

module.exports = { get_message };
