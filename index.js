const app = require('express')()
const port = 3488
const swaggerUi = require('swagger-ui-express')
const yamljs = require('yamljs')
const swaggerDocument = yamljs.load('./docs/swagger.yaml')

const games = [
    {id:1, name: "Wicher 3", price:29.99},
    {id:2, name: "Cyberpunc 2077", price:59.99}
]

app.get('/games', (req, res) => {
    res.send(games)
})

app.get('/games/:id', (req, res) => {

    if (typeof games[req.params.id - 1] === 'undefined') {
        return res.status(404).send({error: "Game not found"})
    }
})

app.post('/games', (req,res) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).send({ error: 'one or all params are missing'})
    }
    let game = {
        id: games.lenght + 1,
        price: req.body.price,
        name: req.body.name
    }

    games.push(game)

    res.status(201)
        .location(`${getBaseUrl(req)}/games/${games.length}`)
        .send(game)
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
    console.log(`API up at: http://localhost:${port}`)
})

function getBaseUrl(req) {
    return req.connection && req.connection.encrypted
        ? 'https' : 'http' + `://${req.headers.host}`
}