const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
    {
        privacyPolicyLink: { type: String, default: '' },
        termsAndConditionsLink: { type: String, default: '' },
        appActive: { type: Boolean, default: true },
        version: { type: Number, default: 1 },
        aboutUs: { type: String, default: '' }
    },
    { timestamps: true }
);

module.exports = mongoose.model('setting', settingSchema);
