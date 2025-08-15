const MESSAGES = {
    // Basic
    1001: 'Success',

    // Login
    2001: 'Login successfully',
    2002: 'Invalid token',

    // user
    3001: 'User not Found',

    // branch
    4001: 'Branch created successfully',
    4002: 'Branches fetched successfully',
    4003: 'Branch not found',
    4004: 'Branch fetched successfully',
    4005: 'Branch updated successfully',
    4006: 'Branch deleted successfully',

    // super admin
    5001: 'Only Super Admin can create Sub Admins',
    5002: 'Super admin created successfully',
    5003: 'Email already exists',

    // common

    // api error
    9998: 'Access denied for this route',
    9999: 'Something went wrong !!'
};

const get_message = message_code => {
    if (isNaN(message_code)) {
        return message_code;
    }
    return message_code ? MESSAGES[message_code] : message_code;
};

module.exports = { get_message };
