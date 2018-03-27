const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:diameter(\\d+)', (req, res, next) => {
  const diameter = req.params.diameter;
  req.app.render('circle', { diameter }, async (error, html) => {
    if (!error) {
      console.log(html);
      puppeteer
        .launch({ dumpio: true })
        .then(async browser => {
          browser
            .newPage()
            .then(page => {
              page
                .setContent(html)
                .then(() => {
                  page.on('load', e => {
                    page
                      .$eval('#canvas', c => c.toDataURL('image/png'))
                      .then(dataUrl => {
                        browser.close().catch(err => {
                          next(err);
                        });
                        let img = new Buffer(
                          dataUrl.split(';base64,').pop(),
                          'base64'
                        );
                        res.writeHead(200, {
                          'Content-Type': 'image/png',
                          'Content-Length': img.length
                        });
                        res.end(img);
                      })
                      .catch(err => next(err));
                  });
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    } else {
      next(error);
    }
  });
});

router.get('/:wd(\\d+)/:ht(\\d+)', (req, res, next) => {
  const wd = req.params.wd;
  const ht = req.params.ht;
  req.app.render('rectangle', { wd, ht }, async (error, html) => {
    if (!error) {
      console.log(html);
      puppeteer
        .launch({ dumpio: true })
        .then(async browser => {
          browser
            .newPage()
            .then(page => {
              page
                .setContent(html)
                .then(() => {
                  page.on('load', e => {
                    page
                      .$eval('#canvas', c => c.toDataURL('image/png'))
                      .then(dataUrl => {
                        browser.close().catch(err => {
                          next(err);
                        });
                        let img = new Buffer(
                          dataUrl.split(';base64,').pop(),
                          'base64'
                        );
                        res.writeHead(200, {
                          'Content-Type': 'image/png',
                          'Content-Length': img.length
                        });
                        res.end(img);
                      })
                      .catch(err => next(err));
                  });
                })
                .catch(err => next(err));
            })
            .catch(err => next(err));
        })
        .catch(err => next(err));
    } else {
      next(error);
    }
  });
});

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'PEEK-A-BOOSE',
    base: req.protocol + '://' + req.get('host') + req.originalUrl
  });
});

module.exports = router;
