const { runScraper } = require('./scraper');

(async () => {
    try {
        await runScraper();
    } catch (err) {
        console.error('Error running scraper:', err);
    }
})();