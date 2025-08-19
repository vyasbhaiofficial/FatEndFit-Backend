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
    6008: 'Plan already assign',

    // video
    7001: 'Video created successfully',
    7002: 'Videos fetched successfully',
    7003: 'Video not found',
    7004: 'Video fetched successfully',
    7005: 'Video updated successfully',
    7006: 'Video deleted successfully',

    // question
    8001: 'Question created successfully',
    8002: 'Questions fetched successfully',
    8003: 'Question not found',
    8004: 'Question fetched successfully',
    8005: 'Question updated successfully',
    8006: 'Question deleted successfully',

    // userReport - answers
    9001: 'User Report created successfully',
    9002: 'User Report fetched successfully',
    9003: 'User Report not found',
    9004: 'User Report fetched successfully',
    9005: 'User Report updated successfully',
    9006: 'User Report deleted successfully',

    // setting
    1101: 'Setting created successfully',
    1102: 'Setting fetched successfully',
    1103: 'Setting not found',
    1104: 'Setting updated successfully',

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
