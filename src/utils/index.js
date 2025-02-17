import { getClassifications } from "../models/games.js";
import getLinks from "../models/mainnav.js"


const getNavigationLinks = async () => {
    const classification = await getClassifications();
    const links = await getLinks();
    let nav = '<nav class="main-nav"> <a href="/"> <img class="logo"src="/images/logo.svg" alt=""></a> <ul>';
    links.forEach((linkInfo) => {
        nav += `<li><a href="${linkInfo.route}" class="nav-link">${linkInfo.name}</a></li>`;
    });
    classification.forEach((row) => {
        const id = row.classification_id
        const name = row.classification_name
        nav += `<li><a  class="nav-link" href="/category/view/${id}">${name}</a></li>`
    });
    return `${nav}</ul></nav>`;
}


export { getNavigationLinks }