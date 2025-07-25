import React from 'react';

export default function AnalyticsSummary({ stats }) {
	return (
		<div style={{ margin: '1rem 0' }}>
			<strong>Total:</strong> {stats.totalPosts} &nbsp;|&nbsp;
			<strong>Disinformation:</strong> {stats.disinformationDetected} &nbsp;|&nbsp;
			<strong>Counter-Narratives:</strong> {stats.counterNarrativesGenerated}
		</div>
	);
}
