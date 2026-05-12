const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  studentName: { type: String, required: true },
  internshipDomain: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  issueDate: { type: Date, default: Date.now },
  studentEmail: String,
  studentPhone: String,
  grade: String,
  pdfUrl: String,
  isVerified: { type: Boolean, default: true }
});

module.exports = mongoose.model('Certificate', CertificateSchema);