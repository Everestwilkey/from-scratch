import { Router } from 'express';
import fs from 'fs';
import { addNewGame, getClassifications, getGamesByClassification, getGameById, updateGame } from '../../models/games.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname issue in ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Game category route
router.get('/view/:id', async (req, res, next) => {  // Added 'next' parameter here
    try {
        const games = await getGamesByClassification(req.params.id);

        if (games.length <= 0) {
            const title = 'Category Not Found';
            const error = new Error(title);
            error.title = title;
            error.status = 404;
            next(error);
            return;
        }

        const title = `${games[0]?.classification_name || ''} Games`.trim();
        res.render('category/games', { title, games, stylesheets: ['game'] });
    } catch (error) {
        next(error);
    }
});
router.get('/add/', async (req, res, next) => {
    const classifications = await getClassifications();
    res.render('category/add', { title: 'add games', classifications })
})

router.get('/edit/:id', async (req, res) => {
    const classifications = await getClassifications();
    const game = await getGameById(req.params.id);
    res.render('category/edit', { title: 'Edit Game', classifications, game });
});

// Edit route to accept updated game information
router.post('/edit/:id', async (req, res) => {
    // Get existing game data to handle image replacement
    const oldGameData = await getGameById(req.params.id);

    // Extract form data and process any uploaded image
    const { game_name, game_description, classification_id } = req.body;
    const image_path = getVerifiedGameImage(req.files?.image);

    // Update game details in database
    await updateGame(req.params.id, game_name, game_description, classification_id, image_path);

    // Clean up old image file if a new one was uploaded
    if (image_path && image_path !== oldGameData.image_path) {
        const oldImagePath = path.join(process.cwd(), `public${oldGameData.image_path}`);
        if (fs.existsSync(oldImagePath) && fs.lstatSync(oldImagePath).isFile()) {
            fs.unlinkSync(oldImagePath);
        }
    }

    // Return to game category view page
    res.redirect(`/category/view/${classification_id}`);
});

router.post('/add', async (req, res) => {
    console.log("Incoming files:", req.files); // Debugging: Check uploaded files
    console.log("Incoming body:", req.body); // Debugging: Check form data

    const { game_name, game_description, classification_id } = req.body;

    // Check if images are present before calling the function
    if (!req.files?.image) {
        console.error("No image uploaded.");
        return res.status(400).send("No image file uploaded.");
    }

    const image_path = getVerifiedGameImage(req.files.image);
    console.log("Final image path:", image_path);

    await addNewGame(game_name, game_description, classification_id, image_path);
    res.redirect(`/category/view/${classification_id}`);
});



const getVerifiedGameImage = (images = []) => {
    // Exit early if no valid images array provided
    console.log("this is running")
    if (!images || images.length === 0) {
        return '';
    }
    console.log(images)

    // Process first image (assuming single image upload)
    const image = images[0];
    const imagePath = path.join(process.cwd(), `public/images/games/${image.newFilename}`);

    // Move uploaded file from temp location to permanent storage
    fs.renameSync(image.filepath, imagePath);

    // Cleanup by removing any remaining temporary files
    images.forEach(image => {
        if (fs.existsSync(image.filepath)) {
            fs.unlinkSync(image.filepath);
        }
    });

    // Return the new frontend image path for storage in the database
    return `/images/games/${image.newFilename}`;
};
export default router;