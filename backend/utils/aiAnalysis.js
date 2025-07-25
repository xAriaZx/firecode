export async function analyzeText(text) {
  console.log('Analyzing text with Ollama');
  
  try {
    const analysis = await callOllama(text);
    if (analysis) {
      return analysis;
    }
  } catch (error) {
    console.error('Ollama failed:', error);
  }
  
  return getDefaultAnalysis();
}

export async function generateCounterNarrative(text, topic) {
  console.log('Generating counter narrative');
  
  try {
    const narrative = await generateWithOllama(text, topic);
    if (narrative) {
      return narrative;
    }
  } catch (error) {
    console.error('Counter narrative generation failed:', error);
  }
  
  return `This claim requires fact-checking. Please verify information from reliable sources.`;
}

async function callOllama(text) {
  const url = 'http://localhost:11434/api/generate';
  const model = 'gamma3';
  
  const prompt = `Analyze this text for disinformation. Return only JSON:
{
  "isFake": true/false,
  "fakeProbability": 0.0-1.0,
  "confidence": 0.0-1.0,
  "topic": "general",
  "reasoning": "explanation"
}

Text: "${text}"`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error('Ollama request failed');
  }

  const data = await response.json();
  
  if (!data.response) {
    throw new Error('No response from Ollama');
  }

  try {
    let jsonText = data.response.trim();
    const jsonMatch = jsonText.match(/\{[^}]*\}/);
    if (jsonMatch) {
      jsonText = jsonMatch[0];
    }
    
    const result = JSON.parse(jsonText);
    
    return {
      isFake: Boolean(result.isFake),
      fakeProbability: Number(result.fakeProbability) || 0,
      confidence: Number(result.confidence) || 0.7,
      topic: result.topic || 'general',
      entity: null,
      entities: [],
      sentiment: 'neutral',
      keywords: [],
      language: 'en',
      reasoning: result.reasoning || 'Analysis completed'
    };
  } catch (error) {
    throw new Error('Failed to parse Ollama response');
  }
}

async function generateWithOllama(text, topic) {
  const url = 'http://localhost:11434/api/generate';
  const model = 'gamma3';
  
  const prompt = `Generate a factual counter-narrative for this claim:
"${text}"

Topic: ${topic}

Provide a brief, factual response that addresses the claim.`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: model,
      prompt: prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error('Ollama request failed');
  }

  const data = await response.json();
  return data.response || null;
}

function getDefaultAnalysis() {
  return {
    isFake: false,
    fakeProbability: 0.1,
    confidence: 0.3,
    topic: 'general',
    entity: null,
    entities: [],
    sentiment: 'neutral',
    keywords: [],
    language: 'en',
    reasoning: 'Service unavailable'
  };
}

async function fallbackAnalysis(text) {
  console.log('Using fallback pattern-based analysis');
  
  const analysis = {
    isFake: false,
    fakeProbability: 0,
    confidence: 0.6,
    topic: extractTopic(text),
    entity: extractEntity(text),
    entities: extractEntities(text),
    sentiment: analyzeSentiment(text),
    keywords: extractKeywords(text),
    language: detectLanguage(text),
    reasoning: 'Pattern-based analysis (Ollama unavailable)'
  };
  
  analysis.fakeProbability = calculateFakeProbability(text);
  analysis.isFake = analysis.fakeProbability > 0.5;
  
  return analysis;
}

export async function generateCounterNarrative(text, topic, factSources) {
  try {
    console.log('Generating counter-narrative for topic:', topic);
    
    const ollamaCounterNarrative = await generateWithOllama(text, topic, factSources);
    if (ollamaCounterNarrative) {
      console.log('Ollama counter-narrative generated successfully');
      return ollamaCounterNarrative;
    }
    
    console.log('Using fallback counter-narrative templates');
    return generateFallbackCounterNarrative(text, topic, factSources);
    
  } catch (error) {
    console.error('Error generating counter-narrative:', error);
    return generateFallbackCounterNarrative(text, topic, factSources);
  }
}

async function generateWithOllama(text, topic, factSources) {
  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'gamma3';

  let factContext = '';
  if (factSources && factSources.length > 0) {
    factContext = '\n\nReliable sources to reference:\n' + 
      factSources.map(source => 
        `- ${source.source}: ${source.title} (${source.url})`
      ).join('\n');
  }
  
  const prompt = `
You are a fact-checker. Generate a concise, factual counter-narrative to address potential misinformation.

Original claim: "${text}"
Topic: ${topic}
${factContext}

Requirements:
- Be factual and evidence-based
- Keep it under 200 characters
- Be respectful and educational
- Include source references if available
- Use the same language as the original text

Generate a counter-narrative:`;

  try {
    const response = await fetch(`${ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.4,
          top_p: 0.8,
          max_tokens: 300
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama HTTP error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.response) {
      throw new Error('No response from Ollama');
    }

    let counterNarrative = data.response.trim();
    
    counterNarrative = counterNarrative.replace(/^(Counter-narrative:|Response:|Answer:)\s*/i, '');
    
    if (counterNarrative.length > 500) {
      counterNarrative = counterNarrative.substring(0, 497) + '...';
    }

    console.log('Ollama counter-narrative:', counterNarrative);
    return counterNarrative;

  } catch (error) {
    console.error('Ollama counter-narrative generation failed:', error.message);
    return null;
  }
}

function generateFallbackCounterNarrative(text, topic, factSources) {
  const counterNarratives = {
    'space': [
      "NASA's Apollo missions are well-documented with evidence including lunar samples, retroreflectors placed on the moon, and independent verification from multiple countries.",
      "Space missions have been independently verified by multiple space agencies worldwide, including recent lunar missions from China and India.",
      "Physical evidence from moon landings includes 842 pounds of lunar samples analyzed by scientists globally."
    ],
    'health': [
      "Medical information should be verified with healthcare professionals and official health organizations like WHO and CDC.",
      "Vaccines undergo rigorous testing and monitoring by health authorities worldwide before approval.",
      "Scientific consensus is based on peer-reviewed research and evidence from multiple independent studies."
    ],
    'climate': [
      "Climate change is supported by overwhelming scientific evidence from thousands of researchers worldwide.",
      "Temperature records, ice core data, and satellite measurements all confirm human impact on climate.",
      "The IPCC represents the consensus of climate scientists from 195 countries."
    ],
    'science': [
      "Scientific facts are established through rigorous peer review and reproducible experiments.",
      "Multiple independent sources of evidence support established scientific principles.",
      "Scientific theories are based on extensive observation, testing, and verification."
    ],
    'technology': [
      "Technology safety standards are established by regulatory agencies based on extensive research.",
      "Electromagnetic radiation from consumer devices operates within safe limits set by international standards.",
      "Health claims about technology should be verified through peer-reviewed scientific studies."
    ]
  };
  
  const topicNarratives = counterNarratives[topic] || [
    "This claim should be verified through reliable sources and fact-checking organizations.",
    "It's important to check multiple credible sources before accepting information as fact.",
    "Consider the source and look for evidence-based information from authoritative organizations."
  ];
  
  const selectedNarrative = topicNarratives[Math.floor(Math.random() * topicNarratives.length)];
  
  if (factSources && factSources.length > 0) {
    const source = factSources[0];
    return `${selectedNarrative} Source: ${source.source} - ${source.title}`;
  }
  
  return selectedNarrative;
}

function extractTopic(text) {
  const topicKeywords = {
    'health': ['vaccine', 'covid', 'virus', 'medicine', 'doctor', 'hospital', 'disease', 'treatment'],
    'politics': ['election', 'vote', 'government', 'president', 'politician', 'policy', 'democracy'],
    'science': ['research', 'study', 'scientist', 'experiment', 'theory', 'evidence', 'earth', 'flat'],
    'technology': ['5g', 'internet', 'phone', 'computer', 'ai', 'artificial intelligence', 'tech'],
    'space': ['nasa', 'moon', 'space', 'rocket', 'astronaut', 'satellite', 'mars'],
    'climate': ['climate', 'global warming', 'environment', 'carbon', 'temperature', 'weather'],
    'economy': ['money', 'bank', 'economy', 'financial', 'market', 'investment', 'crypto']
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return topic;
    }
  }
  
  return 'general';
}

function extractEntity(text) {
  const entities = {
    'NASA': ['nasa'],
    'WHO': ['who', 'world health organization'],
    'CDC': ['cdc', 'centers for disease control'],
    'vaccines': ['vaccine', 'vaccination'],
    'COVID-19': ['covid', 'coronavirus'],
    'Earth': ['earth'],
    '5G': ['5g'],
    'climate change': ['climate change', 'global warming']
  };
  
  const lowerText = text.toLowerCase();
  
  for (const [entity, keywords] of Object.entries(entities)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return entity;
    }
  }
  
  return null;
}

function extractEntities(text) {
  const entities = [];
  const entityPatterns = [
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g,
    /@\w+/g,
    /#\w+/g
  ];
  
  entityPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      entities.push(...matches);
    }
  });
  
  return [...new Set(entities)];
}

function analyzeSentiment(text) {
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'fake', 'false', 'lie', 'scam'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

function extractKeywords(text) {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  
  return words
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10);
}

function detectLanguage(text) {
  const russianWords = ['это', 'что', 'как', 'или', 'для', 'все', 'был', 'она', 'так', 'его'];
  const englishWords = ['the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but'];
  
  const lowerText = text.toLowerCase();
  const russianCount = russianWords.filter(word => lowerText.includes(word)).length;
  const englishCount = englishWords.filter(word => lowerText.includes(word)).length;
  
  if (russianCount > englishCount) return 'ru';
  return 'en';
}

function calculateFakeProbability(text) {
  let score = 0;
  const lowerText = text.toLowerCase();
  
  const fakeIndicators = [
    { pattern: /never|fake|hoax|scam|lie/i, weight: 0.3 },
    { pattern: /secret|hidden|cover.?up|conspiracy/i, weight: 0.25 },
    { pattern: /they don't want you to know/i, weight: 0.4 },
    { pattern: /mainstream media|msm.*lie/i, weight: 0.2 },
    { pattern: /wake up|sheep|sheeple/i, weight: 0.3 },
    { pattern: /100%|always|never.*true/i, weight: 0.15 },
    { pattern: /proven.*false|debunked/i, weight: -0.2 },
  ];
  
  fakeIndicators.forEach(indicator => {
    if (indicator.pattern.test(text)) {
      score += indicator.weight;
    }
  });
  
  if (lowerText.includes('moon landing') && lowerText.includes('fake')) score += 0.4;
  if (lowerText.includes('vaccine') && lowerText.includes('microchip')) score += 0.5;
  if (lowerText.includes('earth') && lowerText.includes('flat')) score += 0.6;
  if (lowerText.includes('5g') && lowerText.includes('covid')) score += 0.4;
  
  return Math.min(Math.max(score, 0), 1);
}
