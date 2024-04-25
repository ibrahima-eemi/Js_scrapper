import puppeteer from 'puppeteer';

(async () => {
  // Lancement du navigateur en mode headless
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  // Navigation vers l'URL souhaitée
  await page.goto('https://www.eemi.com/');

  // Définition de la taille de la fenêtre du navigateur
  await page.setViewport({width: 1080, height: 1024});

  // Attente de la sélection de la balise H1 et récupération du texte
  const h1Text = await page.$eval('h1', el => el.textContent);

  // Impression du texte de la balise H1 dans la console
  console.log('Le titre H1 de cette page est : "%s".', h1Text);

  // Attente de la sélection de la première balise H2 et récupération du texte
  const h2Text = await page.$eval('h2', el => el.textContent);

  // Impression du texte de la balise H2 dans la console
  console.log('Le premier titre H2 de cette page est : "%s".', h2Text);

  // Fermeture du navigateur
  await browser.close();
})();
