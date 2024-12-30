const mongoose = require('mongoose');

const communicationLogSchema = new mongoose.Schema({
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    communicationType: { type: String, required: true }, 
    communicationDate: { type: Date, required: true },
    notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CommunicationLog', communicationLogSchema);
