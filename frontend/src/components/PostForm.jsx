import React, { useState } from 'react';

export default function PostForm({ onCreated }) {
	const [text, setText] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim()) return;

		setLoading(true);
		try {
			const res = await fetch('/api/posts', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text })
			});
			if (res.ok) {
				setText('');
				const created = await res.json();
				onCreated && onCreated(created);
			}
		} catch (err) {
			console.error('Create post error', err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
			<textarea
				value={text}
				onChange={(e) => setText(e.target.value)}
				rows={4}
				placeholder="Enter text to analyze..."
				style={{ width: '100%', padding: '0.5rem' }}
			/>
			<button type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
				{loading ? 'Analyzing...' : 'Analyze'}
			</button>
		</form>
	);
}