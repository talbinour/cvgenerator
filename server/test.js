const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

const url = "https://cursus.edu/articles/43163/testez-gratuitement-votre-niveau-de-francais-pour-le-delf-dalf-dilf-tef-tcf-dfp";

router.get('/api/tests-langue', async (req, res) => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        let tests = [];

        $('li').each((index, element) => {
            const markerText = $(element).contents().filter(function() {
                return this.nodeType === 3; // Node.TEXT_NODE
            }).text().trim();

            $(element).find('a[href]').each((i, el) => {
                const href = $(el).attr('href');
                const description = $(el).text().trim();
                if (['delf', 'dalf', 'dilf', 'tef', 'tcf', 'dfp'].some(test => href.toLowerCase().includes(test))) {
                    tests.push({ marker: markerText, description, link: href });
                }
            });
        });

        res.json(tests);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }
});

module.exports = router;
