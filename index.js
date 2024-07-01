require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
    // Abre el navegado y despliega una nueva pagina
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Navegamos al url
    await page.goto('https://www.facebook.com/');

    // Iniciamos Seccion
    await page.type('#email', process.env.FACEBOOK_EMAIL);
    await page.type('#pass', process.env.FACEBOOK_PASSWORD);
    await page.click('button[name="login"]');
    await page.waitForNavigation();

    // Navegamos al grupo específico
    await page.goto(process.env.FACEBOOK_GROUP_URL);
    await page.waitForSelector('input[placeholder="Buscar en este grupo"]');

    // Busca artículos específicos
    await page.type('input[placeholder="Buscar en este grupo"]', process.env.SEARCH_TERM);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(5000);

    // Recogemos los resultados
    const results = await page.$$eval('div[role="article"]', articles =>
        articles.map(article => article.innerText)
    );

    console.log(results);

    await browser.close();
})();