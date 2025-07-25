import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MONGODB_URI, PORT } from './config.js';
import postsRouter from './routes/posts.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/posts', postsRouter);

app.get('/', (req, res) => {
  res.send('FireCode backend is running!');
});

mongoose
	.connect(MONGODB_URI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error('MongoDB connection error:', err);
		process.exit(1);
	});

app.use(errorHandler);
