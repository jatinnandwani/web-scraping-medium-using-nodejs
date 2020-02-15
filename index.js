'use strict'
const express = require('express');
const req_pro = require('request-promise');
const cheerio = require('cheerio');
const helmet = require('helmet');
const config = require('./configurations/config');
const URL = require('url');
const chalk = require('chalk');

const app = express();
const HTTP_SUCCESS = 200;
const HTTP_ERROR = 500;

app.use(helmet());

let scrap_the_web;

scrap_the_web = async (request, response) => {
    let uri = config.URLtoScrap;
    let requestObjectFromURI = await req_pro.get(uri);
    var neighbourhood_links = [];
    let $ = cheerio.load(requestObjectFromURI.toString());
    $("a").each((i, link) => {
            let u = URL.parse($(link).attr("href"), true);
            let params = Object.keys(u.query);
            let url = u.href.split('?')[0];
            neighbourhood_links.push({
                url,
                params
            });
        });
        console.log(neighbourhood_links);
};
app.get('/scrap', scrap_the_web);

// Server Listens and calls init function to make DB connection live.
app.listen(config.port);
console.log('I am listening you at  ' + config.port);