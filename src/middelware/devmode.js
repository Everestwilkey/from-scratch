
const mode = process.env.MODE || "production";



export default function isDevMode(req, res, next) {
    res.locals.port = process.env.PORT;
    res.locals.isDevMode = mode.includes('dev');
    res.locals.devModeMsg = ``;
    res.locals.scripts = [];
    if (res.locals.isDevMode) {
        res.locals.devModeMsg = `<div class="dev-warning"><p>🚧 Development Mode Active - Port: ${res.locals.port}</p></div>`;
        res.locals.scripts.push(`
    
    const ws = new WebSocket('ws://localhost:${parseInt(res.locals.port) + 1}');
            ws.onclose = () => {
                setTimeout(() => location.reload(), 2000);
            };
`)
    }
    next();
}

