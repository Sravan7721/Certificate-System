const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const Certificate = require('../models/Certificate');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    const certificates = [];
    for (const row of data) {
      const certificate = new Certificate({
        certificateId: row.certificateId || row.CERTIFICATE_ID,
        studentName: row.studentName || row.STUDENT_NAME,
        internshipDomain: row.domain || row.DOMAIN,
        startDate: new Date(row.startDate),
        endDate: new Date(row.endDate),
        studentEmail: row.email,
        studentPhone: row.phone
      });
      await certificate.save();
      certificates.push(certificate);
    }
    
    res.json({ success: true, count: certificates.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/verify/:certificateId', async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
  if (!certificate) return res.status(404).json({ valid: false, message: 'Certificate not found' });
  res.json({ valid: true, certificate });
});

module.exports = router;