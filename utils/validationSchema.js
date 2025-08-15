const passValidation = 'required|password_pattern';
const sortOrder = 'in:ASC,DESC';
const validationSchema = {
    '/auth/login': {
        schema: {
            identity: 'required',
            mobileinteger: 'required',
            fcmToken: 'string'
        }
    },
    // for branch
    '/admin/branch/create': {
        schema: {
            name: 'required|string',
            address: 'required|string',
            city: 'required|string',
            state: 'required|string',
            pincode: 'required|integer'
        }
    },
    '/admin/branch/update/:id': {
        schema: {
            branchId: 'required|string',
            name: 'string',
            address: 'string',
            city: 'string',
            state: 'string',
            pincode: 'integer'
        }
    },
    // for plan
    '/admin/plan/create': {
        schema: {
            name: 'required|string',
            description: 'required|string',
            days: 'required|integer'
        }
    },
    '/admin/plan/update/:id': {
        schema: {
            planId: 'required|string',
            name: 'string',
            description: 'string',
            days: 'integer'
        }
    },
    // add user
    '/admin/user/add': {
        schema: {
            name: 'required|string',
            mobileNumber: 'required|string',
            branchId: 'required|string',
            planId: 'required|string'
        }
    },
    // user login
    '/user/login': {
        schema: {
            mobileNumber: 'required|string',
            fcmToken: 'string'
        }
    }
};

module.exports = {
    passValidation,
    sortOrder,
    validationSchema
};
