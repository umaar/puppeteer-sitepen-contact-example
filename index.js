const puppeteer = require('puppeteer');
const StaticServer = require('static-server');

async function automateBrowser() {
	const browser = await puppeteer.launch({
		headless: false
	});

	const page = await browser.newPage();
	await page.setRequestInterceptionEnabled(true);

	page.on('request', request => {
		const URLToIntercept = 'https://forms.hubspot.com/embed/v3/form/2059467/2e1a1b5b-27bb-447d-aac4-0b87c1e88fec?callback=hs_reqwest_0&hutk=';

		if (request.url === URLToIntercept) {
			request.continue({
				url: 'http://127.0.0.1:8080/form.txt'
			});
		} else {
			request.continue();
		}
	});

	await page.goto('https://www.sitepen.com/site/contact.html');

	await browser.close();
	process.exit();
}

function setupMockServer() {
	const server = new StaticServer({
		rootPath: './mocks',
		port: 8080
	});

	server.start(() => console.log('Mock server started on port', server.port));
}

function main() {
	setupMockServer();
	automateBrowser();
}

main();