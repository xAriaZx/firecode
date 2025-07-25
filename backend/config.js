import dotenv from 'dotenv';

dotenv.config();

export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/firecode';

export const PORT = Number(process.env.PORT) || 5000;

export const OLLAMA_URL   = process.env.OLLAMA_URL   || 'http://localhost:11434';
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gamma3';

if (process.env.NODE_ENV === 'production') {
	if (!process.env.MONGODB_URI) {
		throw new Error('MONGODB_URI env variable is required in production.');
	}
}

export default {
	MONGODB_URI,
	PORT,
	OLLAMA_URL,
	OLLAMA_MODEL
};
