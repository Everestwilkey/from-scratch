import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoute from './src/routes/index.js';
import layoutMiddleware from './src/middelware/layout.js';
import isDevMode from './src/middelware/devmode.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const mode = process.env.MODE;
const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))


app.use(express.static('public'))
app.use('/css', express.static('public/css'))
app.use('/js', express.static('public/js'))
app.use('/images', express.static('public/images'))



app.use(layoutMiddleware({
    layoutDir: path.join(__dirname, 'src/views/layouts'),
    defaultLayout: 'default'
}));
app.use(isDevMode)


app.use('/', indexRoute);
const port = process.env.PORT || 3000;
if (mode.includes('dev')) {
    const ws = await import('ws');

    try {
        const wsPort = parseInt(port) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});