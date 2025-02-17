import { getNavigationLinks } from '../utils/index.js';




export default async function configureNodeEnvironment(req, res, next) {
    res.locals.navHTML = await getNavigationLinks();
    next()
};


