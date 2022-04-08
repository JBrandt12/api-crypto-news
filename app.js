const port = 8000

const express = require('express'); 
const axios = require('axios'); 
const cheerio = require('cheerio');
const { response } = require('express');

const app = express()

const newspapers = [
    {
        name: 'thetimes', 
        address: 'https://www.thetimes.co.uk/',
        base: ""
    },
    {
        name: 'guardian', 
        address: 'https://www.theguardian.com/',
        base: ""
    }, 
    {
        name: 'guardianTech', 
        address: 'https://www.theguardian.com/technology'
    }, 
    {
        name: 'coindesk',
        address: 'https://www.coindesk.com/',
        base: 'https://coindesk.com/'
    }
]
const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("Tech")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                
                articles.push({
                    title, 
                    url: newspaper.base+ url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res)=>{
    res.json("Welcome to my Tech News API")
})

app.get('/news', (req, res)=>{
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res)=>{

    const newspaperId = req.params.newspaperId
    const getNewspaper = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(getNewspaper)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Tech")', html).each(function(){
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase+ url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(port, () => console.log(`server running on Port  ${port}`))
