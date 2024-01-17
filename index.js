const express = require('express')
const app = express()

const users = [
    {
        id: '1234',
        name : 'John',
        password: 'JJJJ',
        phone: '99999112'
    },
    {
        id: '2345',
        name: 'Jim',
        password: 'hello',
        phone: '9091928'
    }
]
app.get('/', (req, res) => {
    res.send('UP')
})

app.get('/users', (req, res) => {
    res.json(users)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`listing on ${port}`)
})