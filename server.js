import express from 'express'
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoute from './src/routes/index.js';
import categoryRoute from './src/routes/category/index.js'
import layoutMiddleware from './src/middelware/layout.js';
import isDevMode from './src/middelware/devmode.js';
import configureNodeEnvironment from './src/middelware/node-env.js'
import { getNavigationLinks } from './src/utils/index.js';
import { errorHandler } from './src/middelware/errormiddelware.js';
import { setupDatabase } from './src/database/index.js';
import configureStaticPaths from './src/middelware/static-paths.js';
import fileUploads from './src/middelware/file-upload.js';
getNavigationLinks()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);
const mode = process.env.MODE;
const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))


configureStaticPaths(app)



app.use(layoutMiddleware({
    layoutDir: path.join(__dirname, 'src/views/layouts'),
    defaultLayout: 'default'
}));
app.use(isDevMode)
app.use(configureNodeEnvironment)

app.use(fileUploads);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRoute);
app.use('/category', categoryRoute);
app._router.stack.forEach((r) => {
    if (r.route && r.route.path) {
        console.log(`Route: ${r.route.path}`);
    } else if (r.name === 'router') {
        console.log('Router middleware:');
        r.handle.stack.forEach((h) => {
            if (h.route) {
                console.log(`  ${h.route.path}`);
            }
        });
    }
});
app.use((req, res, next) => {
    const error = new Error('Page Not Found');
    error.statusCode = 404;
    next(error);
});
app.use(errorHandler);
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


app.listen(port, async () => {
    await setupDatabase();
    console.log(`Server running on http://localhost:${port}`);

});