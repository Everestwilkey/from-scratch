import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { addcategory, deleteCategory } from '../../models/Category.js';
import { getClassifications } from '../../models/games.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

router.get('/addcategory', async (req, res, next) => {

    res.render("category/categoryadd", {
        title: 'Add Category',
        error: req.query.error  // Add this line to pass the error
    });
});

router.post('/addcategory', async (req, res, next) => {
    try {
        const classification_name = req.body.classification_name;
        console.log('Received classification name:', classification_name);

        if (!classification_name) {

            return res.redirect('/category/addcategory?error=Name is required');
        }

        const classifications = await getClassifications()
        const exists = classifications.some(classification =>
            classification.classification_name.toLowerCase() === classification_name.toLowerCase()
        );
        if (exists) {

            return res.redirect('/category/addcategory?error=Category already exists');
        }


        const result = await addcategory(classification_name);
        console.log('New category ID:', result.lastID);
        res.status
        res.redirect(`/category/view/${result.lastID}`);

    } catch (error) {
        console.error('Error adding category:', error);
        // Redirect back with error
        res.redirect('/category/addcategory?error=Failed to add category');
    }
});

router.get("/deletecategory", async (req, res, next) => {
    const classification = await getClassifications()

    res.render("category/categorydelete", {
        title: 'Delete Category',
        error: req.query.error,
        classifications: classification,
        stylesheets: ['category'] // Add this line to pass the error
    });
});
router.post("/deletecategory", async (req, res, next) => {
    try {
        const { classification_id, move_to_category } = req.body
        console.log(classification_id)
        console.log(move_to_category)
        if (!classification_id) {
            return res.status(400).json({ error: "Category ID is required" });
        }
        deleteCategory(classification_id, move_to_category)
        if (move_to_category) {
            res.redirect(`/category/view/${move_to_category}`);
        } else {
            res.redirect(`/category/addcategory`)
        }
    } catch (error) {
        console.error('Error in delete category:', error);
        res.status(500).render('category/categorydelete', {
            error: 'Failed to delete category',
            classifications: await getClassifications() // Assuming you have this function
        });
    }
}
)
export default router;