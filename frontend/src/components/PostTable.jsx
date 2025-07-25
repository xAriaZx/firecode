import React from 'react';

export default function PostTable({ posts }) {
	if (!posts.length) return <p>No posts yet.</p>;

	return (
		<table style={{ width: '100%', borderCollapse: 'collapse' }}>
			<thead>
				<tr>
					<th style={th}>Text</th>
					<th style={th}>Fake %</th>
					<th style={th}>Counter-Narrative</th>
				</tr>
			</thead>
			<tbody>
				{posts.map((p) => (
					<tr key={p._id}>
						<td style={td}>{p.text}</td>
						<td style={td}>{Math.round((p.fakeProbability || 0) * 100)}%</td>
						<td style={td}>{p.counterNarrative || '—'}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

const th = { borderBottom: '1px solid #ccc', textAlign: 'left', padding: '0.5rem' };
const td = { borderBottom: '1px solid #eee', padding: '0.5rem' };
