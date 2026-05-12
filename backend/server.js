const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Accept only Excel files
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed'), false);
        }
    }
});

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/certificate_system', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Certificate Schema
const certificateSchema = new mongoose.Schema({
    certificateId: { type: String, required: true, unique: true },
    studentName: { type: String, required: true },
    internshipDomain: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    issueDate: { type: Date, default: Date.now },
    studentEmail: String,
    studentPhone: String,
    isVerified: { type: Boolean, default: true }
});

const Certificate = mongoose.model('Certificate', certificateSchema);

// UPLOAD ENDPOINT - FIXED VERSION
app.post('/api/upload-excel', (req, res) => {
    // Use multer as middleware with field name 'file'
    upload.single('file')(req, res, async function(err) {
        // Handle multer errors
        if (err instanceof multer.MulterError) {
            console.error('Multer error:', err);
            return res.status(400).json({ 
                success: false, 
                error: `Upload error: ${err.message}` 
            });
        } else if (err) {
            console.error('Unknown error:', err);
            return res.status(400).json({ 
                success: false, 
                error: err.message 
            });
        }
        
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: 'No file uploaded. Please select an Excel file.' 
            });
        }
        
        try {
            console.log('File received:', req.file.originalname);
            
            // Read the Excel file
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            
            console.log(`Found ${data.length} rows in Excel file`);
            
            if (data.length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Excel file is empty'
                });
            }
            
            const certificates = [];
            const errors = [];
            
            // Process each row
            for (let i = 0; i < data.length; i++) {
                const row = data[i];
                
                // Check required fields
                if (!row.certificateId || !row.studentName || !row.domain || !row.startDate || !row.endDate) {
                    errors.push(`Row ${i + 1} missing required fields`);
                    continue;
                }
                
                try {
                    const certificate = new Certificate({
                        certificateId: String(row.certificateId),
                        studentName: String(row.studentName),
                        internshipDomain: String(row.domain),
                        startDate: new Date(row.startDate),
                        endDate: new Date(row.endDate),
                        studentEmail: row.email ? String(row.email) : '',
                        studentPhone: row.phone ? String(row.phone) : ''
                    });
                    
                    await certificate.save();
                    certificates.push(certificate);
                    console.log(`✅ Saved: ${row.certificateId}`);
                } catch (saveError) {
                    if (saveError.code === 11000) {
                        errors.push(`Row ${i + 1}: Certificate ID ${row.certificateId} already exists`);
                    } else {
                        errors.push(`Row ${i + 1}: ${saveError.message}`);
                    }
                }
            }
            
            // Clean up uploaded file
            fs.unlinkSync(req.file.path);
            
            res.json({
                success: true,
                count: certificates.length,
                errors: errors.length > 0 ? errors : undefined,
                message: `Successfully uploaded ${certificates.length} certificates${errors.length > 0 ? `, ${errors.length} failed` : ''}`
            });
            
        } catch (error) {
            console.error('Processing error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    });
});

// Verify certificate endpoint
app.get('/api/verify/:certificateId', async (req, res) => {
    try {
        const certificate = await Certificate.findOne({ certificateId: req.params.certificateId });
        if (!certificate) {
            return res.status(404).json({ valid: false, message: 'Certificate not found' });
        }
        res.json({ valid: true, certificate });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all certificates
app.get('/api/certificates', async (req, res) => {
    try {
        const certificates = await Certificate.find().sort('-issueDate');
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete all certificates (for testing)
app.delete('/api/certificates', async (req, res) => {
    try {
        await Certificate.deleteMany({});
        res.json({ message: 'All certificates deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`📤 Upload endpoint: http://localhost:${PORT}/api/upload-excel`);
    console.log(`🔍 Verify endpoint: http://localhost:${PORT}/api/verify/:certificateId`);
});