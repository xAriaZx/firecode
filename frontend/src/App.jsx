import React, { useEffect, useState } from 'react';
import PostForm from './components/PostForm';
import PostTable from './components/PostTable';
import AnalyticsSummary from './components/AnalyticsSummary';
import './App.css';

function App() {
	const [posts, setPosts] = useState([]);
	const [stats, setStats] = useState({ totalPosts: 0, disinformationDetected: 0, counterNarrativesGenerated: 0 });

	const fetchPosts = async () => {
		const res = await fetch('/api/posts');
		const data = await res.json();
		setPosts(data);
		recalcStats(data);
	};

	const recalcStats = (data) => {
		const total = data.length;
		const disinfo = data.filter((p) => p.fakeProbability > 0.5).length;
		const cn = data.filter((p) => p.counterNarrative).length;
		setStats({ totalPosts: total, disinformationDetected: disinfo, counterNarrativesGenerated: cn });
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	return (
		<div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
			<h1>🔥 FireCode – Disinformation Detector</h1>
			<PostForm onCreated={(newPost) => {
				setPosts([newPost, ...posts]);
				recalcStats([newPost, ...posts]);
			}} />
			<AnalyticsSummary stats={stats} />
			<PostTable posts={posts} />
		</div>
	);
}

export default App;
