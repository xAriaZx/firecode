import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  source: { type: String, default: 'manual' }, 
  sourceId: { type: String }, 
  author: { type: String }, 
  isFake: { type: Boolean, default: false },
  fakeProbability: { type: Number, min: 0, max: 1, default: 0 },
  confidence: { type: Number, min: 0, max: 1, default: 0 }, 
  topic: { type: String }, 
  entity: { type: String }, 
  entities: [{ type: String }], 
  sentiment: { 
    type: String, 
    enum: ['positive', 'negative', 'neutral'], 
    default: 'neutral' 
  },
  severity: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  counterNarrative: { type: String }, 
  factSources: [{
    source: { type: String }, 
    url: { type: String },
    relevance: { type: Number, min: 0, max: 1 },
    summary: { type: String },
    title: { type: String },
    publishedAt: { type: Date }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'processed', 'verified', 'disputed'], 
    default: 'pending' 
  },
  language: { type: String, default: 'en' }, 
  keywords: [{ type: String }], 
  hashtags: [{ type: String }], 
  mentions: [{ type: String }], 
  engagement: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  verification: {
    verifiedBy: { type: String }, 
    verifiedAt: { type: Date },
    notes: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  processedAt: { type: Date }       
});

PostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});
PostSchema.index({ createdAt: -1 });
PostSchema.index({ topic: 1 });
PostSchema.index({ fakeProbability: -1 });
PostSchema.index({ status: 1 });
PostSchema.index({ severity: 1 });

PostSchema.virtual('calculatedSeverity').get(function() {
  if (this.fakeProbability > 0.7) return 'high';
  if (this.fakeProbability > 0.4) return 'medium';
  return 'low';
});

PostSchema.methods.needsCounterNarrative = function() {
  return this.fakeProbability > 0.5 && !this.counterNarrative;
};
PostSchema.methods.markAsProcessed = function() {
  this.status = 'processed';
  this.processedAt = new Date();
  return this.save();
};

PostSchema.statics.findHighRisk = function() {
  return this.find({ fakeProbability: { $gt: 0.7 } }).sort({ createdAt: -1 });
};
PostSchema.statics.getAnalytics = async function() {
  const total = await this.countDocuments();
  const disinformation = await this.countDocuments({ fakeProbability: { $gt: 0.5 } });
  const withCounterNarratives = await this.countDocuments({ counterNarrative: { $ne: null } });
  
  return {
    totalPosts: total,
    disinformationDetected: disinformation,
    counterNarrativesGenerated: withCounterNarratives,
    accuracy: total > 0 ? Math.round((disinformation / total) * 100) : 0
  };
};

export default mongoose.model('Post', PostSchema);
