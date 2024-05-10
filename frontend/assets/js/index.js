import About from './views/About.js';
import Contact from './views/Contact.js';
import Home from './views/Home.js';
import NotFound from './views/NotFound.js';

// Components
import Navbar from './components/Navbar.js';
import Layout from './components/Layout.js';

// Define your global user state object
const userState = {
    email: null,
    profilePicture: null,
    isLogged:  false
};

// Cookie parser
function parseCookie() {
    var cookies = {}; // Object to store parsed cookies
    
    // Split document.cookie into individual cookie strings
    var cookieStrings = document.cookie.split(';');
    
    // Iterate over each cookie string
    cookieStrings.forEach(function(cookieString) {
      // Split the cookie string into key-value pair
      var parts = cookieString.split('=');
      var key = parts[0].trim(); // Trim leading/trailing whitespaces
      var value = decodeURIComponent(parts.slice(1).join('=')); // Decode URI encoded value
      cookies[key] = value; // Store key-value pair in the cookies object
    });
    
    return cookies; // Return the parsed cookies object
  }
  
var cookies = parseCookie();
console.log(cookies['accessToken']);
  
const navigateTo = url => {
    history.pushState(null, null, url);
    router();
}

const  fetchData = (data, method, url, headers) => {
    fetch(url, {
        method, // 'GET'. 'POST', 'PACTH', 'DELETE'
        headers,
        body: JSON.stringify(data),
     })
     .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        // Handle successful response
        console.log(data);
      })
      .catch(error => {
        // Handle errors
        console.error(error);
      }); 
}

const router = async () => {
    const layout = document.getElementById('root');
    layout.innerHTML = await Layout();

    if (!userState.isLogged) {
        const navbar = document.getElementById('navbar');
        navbar.innerHTML = await Navbar();
    } else {

    }

    if (JSON.parse(window.localStorage.getItem('darkMode'))) {
        var element = document.getElementById('root');
        element.className += ' dark';
    }

    const darkModeButton = document.getElementById('darkMode');

    darkModeButton.addEventListener('click', () => {
        var element = document.getElementById('root');
        if (!JSON.parse(window.localStorage.getItem('darkMode'))) {
            element.className += ' dark';  
        } else { 
            element.className = 'flex flex-col h-screen';
        }
        window.localStorage.setItem('darkMode', !JSON.parse(window.localStorage.getItem('darkMode')));
    })

    const routes = [
        { path: '*', view: NotFound },
        { path: '/', view: Home },
        { path: '/about', view: About },
        { path: '/contact', view: Contact }
    ]

    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch: location.pathname === route.path
        }
    })

    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)

    if (!match) {
        match = {
            route: routes[0],
            isMatch: true
        }
    }

    const view = new match.route.view();
    const scriptsPromise = view.getScripts(); // Get the Promise returned by getScripts()

    // Load and execute additional scripts
    await scriptsPromise; // Wait for all scripts to be loaded

    document.getElementById('main').innerHTML = await view.getHtml();

    const loginForm = document.getElementById('loginForm');      

    loginForm.addEventListener('submit', async e => {
        e.preventDefault();
        const data = new FormData(e.target);
        const dataObject = Object.fromEntries(data.entries());
        await fetchData(dataObject, 'post', '/api/login', {
            "Content-Type": "application/json",
        });    
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', e => {
        // Check if the clicked element or any of its ancestors matches the '[data-link]' selector
        const link = e.target.closest('[data-link]');
        // If a matching element is found
        if (link) {
            
            e.preventDefault();
            navigateTo(link.getAttribute('href')); // Use getAttribute() to get the href attribute
        }
    });
    router();
});