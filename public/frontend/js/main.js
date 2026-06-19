import { navbar } from '../components/navBar.js';
import { sidebar } from '../components/sideBar.js';

document.getElementById('mainNavbar').innerHTML = navbar();
document.getElementById('mainSidebar').innerHTML = sidebar();