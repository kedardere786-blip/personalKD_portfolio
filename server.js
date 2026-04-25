require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves the frontend files

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const Project = require('./models/Project');

// API Route: Get all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Helper Route: Seed dummy data
app.get('/api/seed', async (req, res) => {
    try {
        await Project.deleteMany(); // Clear existing
        const sampleProjects = [
            { 
                title: 'E-Commerce Store', 
                description: 'A full-stack shopping app with user authentication.', 
                technologies: ['React', 'Node.js', 'MongoDB'],
                link: 'https://github.com/yourusername/ecommerce'
            },
            { 
                title: 'Task Manager', 
                description: 'A simple to-do application to manage daily tasks.', 
                technologies: ['HTML', 'CSS', 'JavaScript'],
                link: 'https://github.com/yourusername/task-manager'
            }
        ];
        await Project.insertMany(sampleProjects);
        res.send('✅ Database seeded successfully with dummy projects!');
    } catch (err) {
        res.status(500).send(err.message);
    }
});
// API Route: Handle Contact Form Submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    // In a real, production app, you would use a package like 'nodemailer' 
    // to send this to your real email, or save it to MongoDB.
    console.log(`\n📩 NEW MESSAGE RECEIVED:`);
    console.log(`Name: ${name} | Email: ${email}`);
    console.log(`Message: ${message}\n`);

    res.json({ success: true, message: 'Thank you! Your message has been sent.' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
app.use(express.static('public'));