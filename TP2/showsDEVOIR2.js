const express = require('express');
const { body, param, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const db = require('../database');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, or PNG images are allowed'));
    }
  }
});

const validateShow = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').isIn(['movie', 'anime', 'serie']).withMessage('Category must be movie, anime, or serie')
];

// POST: Add a new show
router.post('/', upload.single('image'), validateShow, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, category } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  db.run('INSERT INTO shows (title, description, category, image) VALUES (?, ?, ?, ?)', [title,description, category, image], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: this.lastID, title, description, category, image });
  });
});

// GET: Fetch all shows
router.get('/', (req, res) => {
  db.all('SELECT * FROM shows', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});
// PUT: Update an existing show
router.put('/:id', upload.single('image'), validateShow, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, description, category } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    db.run('UPDATE shows SET title = ?, description = ?, category = ?, image = COALESCE(?, image) WHERE id = ?', [title, description, category, image, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Show not found' });
      res.json({ id: req.params.id, title, description, category, image });
    });
  });
  
  // DELETE: Remove a show
  router.delete('/:id', [param('id').isInt().withMessage('ID must be an integer')], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.run('DELETE FROM shows WHERE id = ?', [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Show not found' });
        res.json({ message: 'Show deleted successfully' });
      });
    });
    
    module.exports = router;
