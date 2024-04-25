import puppeteer from 'puppeteer';
import ExcelJS from 'exceljs';
import { Resend } from 'resend';

const resend = new Resend('re_bKumwk3f_LrQSFsFKgE8CuHrZeMeBECiH');

const asciiArt = `
\x1b[32m      _   _____  
     | | / ____| 
     | || (___    ___  _ __   __ _  _ __   _ __    ___  _ __ 
 _   | | \\___ \\  / __|| '__| / _\` || '_ \\ | '_ \\  / _ \\| '__|
| |__| | ____) || (__ | |   | (_| || |_) || |_) ||  __/| |   
 \\____/ |_____/  \\___||_|    \\__,_|| .__/ | .__/  \\___||_|   
                                   | |    | |                
                                   |_|    |_|                
\x1b[0m
`;
console.log(asciiArt);

function startRotation(message) {
  const symbols = ['/', '|', '\\'];
  let index = 0;
  return setInterval(() => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`\x1b[32m${message} ${symbols[index]} \x1b[0m`);
    index = (index + 1) % symbols.length;
  }, 500);
}

function stopRotation(intervalId) {
  clearInterval(intervalId);
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
}

(async () => {
  let browser;
  let rotationIntervalId = startRotation('Le Scrapping est en cours, veuillez patienter...');
  try {
    browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.radins.com/code-promo/', { waitUntil: 'networkidle2' });
    const cookiesSelector = 'a.cmpboxbtn.cmpboxbtnyes.cmptxt_btn_yes';
    await page.waitForSelector(cookiesSelector, { visible: true });
    await page.click(cookiesSelector);

    const promoBlocksSelector = '.section-placeholder.noslider [data-testid="voucher-card-info"]'; 
    await page.waitForSelector(promoBlocksSelector);
    const promoBlocks = await page.$$(promoBlocksSelector);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Codes Promo');

    worksheet.columns = [
      { header: 'Code', key: 'code', width: 20 },
      { header: 'Promotion', key: 'discount', width: 20 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Expiration', key: 'expiration', width: 20 },
    ];

    const promoDetails = [];

    for (let block of promoBlocks) {
      const promoDetail = await block.evaluate(el => {
        const code = el.querySelector('.az57m4o.az57m40.az57m4c._1h7rm4nv')?.innerText.trim();
        const discount = el.querySelector('.az57m4n.az57m40.az57m46._1h7rm4nw')?.innerText.trim();
        const description = el.querySelector('.az57m4n.az57m40.az57m4a._1h7rm4nx')?.innerText.trim();
        const expiration = el.querySelector('.az57m4p.az57m40.az57m4c._1h7rm4ny')?.innerText.trim().replace('Expire le : ', '');
        return { code, discount, description, expiration };
      });
      worksheet.addRow(promoDetail);
      promoDetails.push(promoDetail);
    }

    await workbook.xlsx.writeFile('Codes_Promo.xlsx');

    const filteredPromos = promoDetails.filter(detail => detail.expiration === 'Expire aujourd\'hui !' || detail.expiration === 'Expire demain');
    filteredPromos.forEach(detail => {
      console.log(`\x1b[37mCode:\x1b[32m ${detail.code}, \x1b[37mDiscount:\x1b[32m ${detail.discount}, \x1b[37mDescription:\x1b[32m ${detail.description}, \x1b[37mExpiration:\x1b[32m ${detail.expiration}`);
    });

    // Envoi d'email pour les promotions filtrées
    if (filteredPromos.length > 0) {
      console.log('Envoi d\'un e-mail pour les promotions expirant bientôt...');
      try {
        await resend.emails.send({
          from: 'Roi Des Radins <onboarding@resend.dev>',
          to: ['ibrahima.diallo@eemi.com'],
          subject: 'Roi Des Radins a des nouvelles promos',
          html: filteredPromos.map(detail => `<div><strong>${detail.code}</strong>: ${detail.description} expiring on ${detail.expiration}</div>`).join(''),
        });
        console.log("Email sent successfully");
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }

  } catch (error) {
    console.error('Erreur détectée:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
    stopRotation(rotationIntervalId);
    console.log('\x1b[37mOpération terminée, veuillez consulter le fichier Excel.\x1b[32m OK');
  }
})();
