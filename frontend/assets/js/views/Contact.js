import AbstrtactView from "./AbstractView.js";

export default class extends  AbstrtactView {
    constructor() {
        super();
        this.setTitle('Contact');
    }

    async getHtml() {
        return `
            <h1>Contact</h1>
        `;
    }

    getScripts() {
        return new Promise(resolve => {
            const existingScript = document.querySelector('script[src="/static/js/contact.js"]');
            if (existingScript) {
                existingScript.parentNode.removeChild(existingScript); // Remove the existing script
            }
            
            const script = document.createElement('script');
            script.src = '/static/js/contact.js'; // Path to additional script for Home view
            script.onload = resolve; // Resolve the Promise when the script is loaded
            document.body.appendChild(script);
        });
    }
}