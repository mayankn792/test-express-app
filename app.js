const express = require('express')
const app = express()
const port = 3000

app.get('/', (res, res) => {
    res.send('UP')
})

app.listen(port, () => {
    console.log(`listing on ${port}`)
})