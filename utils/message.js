const MESSAGES = {
    // Basic
    1001: 'Success',

    // Login
    2001: 'Login successfully',
    2002: 'Invalid token',

    // user
    3001: 'User not Found',
    3002: 'User already exists',
    3003: 'Branch or plan not found',

    // branch
    4001: 'Branch created successfully',
    4002: 'Branches fetched successfully',
    4003: 'Branch not found',
    4004: 'Branch fetched successfully',
    4005: 'Branch updated successfully',
    4006: 'Branch deleted successfully',
    4007: 'Branch name already exists',

    // super admin
    5001: 'Only Super Admin can create Sub Admins',
    5002: 'Super admin created successfully',
    5003: 'Email already exists',
    5004: 'Admin not Found',

    // plan
    6001: 'Plan created successfully',
    6002: 'Plans fetched successfully',
    6003: 'Plan not found',
    6004: 'Plan fetched successfully',
    6005: 'Plan updated successfully',
    6006: 'Plan deleted successfully',
    6007: 'Plan name already exists',

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
