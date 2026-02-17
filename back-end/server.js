import 'dotenv/config';
import app from './src/app.js';

console.log('[DEBUG] Loaded ALLOWED_ORIGIN:', process.env.ALLOWED_ORIGIN);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


