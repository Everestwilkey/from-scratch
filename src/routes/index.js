import { Router } from "express";
import { getNavigationLinks } from "../utils/index.js"
const router = Router()

router.get('/', async (req, res) => {
    try {
        res.render('home', { title: "Everest Home", stylesheets: ['home'] })
    } catch (error) {
        next(error);
    }
})

router.get('/about', async (req, res) => {
    try {
        res.render('about', { title: "Everest About", name: "Everest", stylesheets: ['about'], bio: "I am a passionate full-stack developer with experience in web, mobile, and backend development. With a strong foundation in React, Next.js, SwiftUI, Flutter, and Firebase, I specialize in building scalable and efficient applications that enhance user experience and drive business growth. As the founder of Snake River Digital, I help businesses establish and grow their online presence through high-performance websites and applications. My work spans e-commerce, SEO optimization, cloud computing, and app development, ensuring that clients get modern, reliable solutions tailored to their needs." })
    } catch (error) {
        next(error);
    }
})

export default router;