import express from 'express';
import { body, validationResult } from 'express-validator';
import Post from '../models/Post.js';
import { analyzeText, generateCounterNarrative } from '../utils/aiAnalysis.js';
import { searchFactSources } from '../utils/factSearch.js';

const router = express.Router();

const mockPosts = [
  {
    text: "NASA never landed on the moon. It was all filmed in a studio.",
    isFake: true,
    fakeProbability: 0.92,
    topic: "space",
    entity: "NASA",
    counterNarrative: "NASA's Apollo missions are well-documented with evidence including lunar samples, retroreflectors placed on the moon, and independent verification from multiple countries.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    text: "Vaccines contain microchips for tracking people.",
    isFake: true,
    fakeProbability: 0.95,
    topic: "health",
    entity: "vaccines",
    counterNarrative: "Vaccines contain no microchips. This has been thoroughly debunked by medical authorities worldwide. Vaccine ingredients are publicly available and regulated.",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    text: "Climate change is a natural phenomenon and not caused by humans.",
    isFake: true,
    fakeProbability: 0.78,
    topic: "climate",
    entity: "climate change",
    counterNarrative: "Scientific consensus shows that current climate change is primarily caused by human activities, particularly greenhouse gas emissions from fossil fuels.",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  },
  {
    text: "The Earth is flat, not round as scientists claim.",
    isFake: true,
    fakeProbability: 0.99,
    topic: "science",
    entity: "Earth",
    counterNarrative: "The Earth is demonstrably spherical, proven by satellite imagery, physics, astronomy, and direct observation from space missions.",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000) // 8 hours ago
  },
  {
    text: "5G towers cause COVID-19 and other health problems.",
    isFake: true,
    fakeProbability: 0.88,
    topic: "technology",
    entity: "5G",
    counterNarrative: "There is no scientific evidence linking 5G technology to COVID-19 or other health issues. 5G operates within safe electromagnetic frequency ranges.",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) 
  }
];
let isInitialized = false;
const initializeMockData = async () => {
  if (isInitialized) return;
  
  try {
    const existingPosts = await Post.countDocuments();
    if (existingPosts === 0) {
      await Post.insertMany(mockPosts);
      console.log('Mock data initialized');
    }
    isInitialized = true;
  } catch (error) {
    console.error('Error initializing mock data:', error);
  }
};

router.get('/', async (req, res, next) => {
  try {
    await initializeMockData();
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  body('text').isString().isLength({ min: 10 }).withMessage('Text must be at least 10 characters.'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { text } = req.body;
      
      const analysis = await analyzeText(text);
      
      let factSources = [];
      if (analysis.topic) {
        factSources = await searchFactSources(analysis.topic);
      }
      
      let counterNarrative = null;
      if (analysis.fakeProbability > 0.5) {
        counterNarrative = await generateCounterNarrative(text, analysis.topic, factSources);
      }

      const postData = {
        text,
        isFake: analysis.fakeProbability > 0.5,
        fakeProbability: analysis.fakeProbability,
        topic: analysis.topic,
        entity: analysis.entity,
        counterNarrative,
        factSources
      };

      const post = new Post(postData);
      await post.save();

      res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
});

router.get('/analytics/stats', async (req, res, next) => {
  try {
    await initializeMockData();
    
    const totalPosts = await Post.countDocuments();
    const disinformationPosts = await Post.countDocuments({ fakeProbability: { $gt: 0.5 } });
    const counterNarratives = await Post.countDocuments({ counterNarrative: { $ne: null } });
    
    const stats = {
      totalPosts,
      disinformationDetected: disinformationPosts,
      counterNarrativesGenerated: counterNarratives,
      accuracy: totalPosts > 0 ? Math.round((disinformationPosts / totalPosts) * 100) : 0
    };
    
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
