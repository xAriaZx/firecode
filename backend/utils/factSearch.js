export async function searchFactSources(topic) {
  const sources = [];
  
  try {
    const wikiResult = await searchWikipedia(topic);
    if (wikiResult) {
      sources.push(wikiResult);
    }
    
    const mockSources = getMockFactSources(topic);
    sources.push(...mockSources);
    
  } catch (error) {
    console.error('Error searching fact sources:', error);
  }
  
  return sources;
}

export async function searchWikipedia(topic) {
  try {
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'FireCode/1.0 (https://firecode.app)'
      },
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.extract) {
        return {
          source: 'Wikipedia',
          url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
          relevance: 0.9,
          summary: data.extract,
          title: data.title
        };
      }
    }
  } catch (error) {
    console.error('Wikipedia search error:', error.message);
  }
  
  return null;
}

function getMockFactSources(topic) {
  const mockSources = {
    'space': [
      {
        source: 'NASA',
        url: 'https://www.nasa.gov/mission_pages/apollo/',
        relevance: 0.95,
        summary: 'Official NASA documentation of Apollo missions with extensive evidence and data.',
        title: 'Apollo Program Overview'
      }
    ],
    'health': [
      {
        source: 'WHO',
        url: 'https://www.who.int/news-room/feature-stories/detail/the-race-for-a-covid-19-vaccine-explained',
        relevance: 0.95,
        summary: 'World Health Organization official information about vaccine safety and efficacy.',
        title: 'Vaccine Safety and Efficacy'
      }
    ],
    'climate': [
      {
        source: 'IPCC',
        url: 'https://www.ipcc.ch/reports/',
        relevance: 0.98,
        summary: 'Intergovernmental Panel on Climate Change scientific reports on climate change.',
        title: 'Climate Change Scientific Evidence'
      }
    ],
    'science': [
      {
        source: 'NASA Earth Science',
        url: 'https://www.nasa.gov/audience/forstudents/k-4/stories/nasa-knows/what-is-earth-k4.html',
        relevance: 0.99,
        summary: 'Scientific evidence for Earth\'s spherical shape from multiple sources.',
        title: 'Earth\'s Shape: Scientific Evidence'
      }
    ],
    'technology': [
      {
        source: 'FCC',
        url: 'https://www.fcc.gov/consumers/guides/wireless-devices-and-health-concerns',
        relevance: 0.92,
        summary: 'Federal Communications Commission information on wireless technology safety.',
        title: '5G Technology Safety Standards'
      }
    ]
  };
  
  return mockSources[topic] || [];
}