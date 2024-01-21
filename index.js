const express = require('express')
const cors = require('cors')
const { MongoClient } = require('mongodb');

const app = express()

app.use(express.json())

const whiteList = {
    // origin: ['https://test-express-app-fe.vercel.app']
}
app.use(cors(whiteList))

const jwt = require('jsonwebtoken')



const usersBackup = [
    {
        id: '1234',
        name: 'John',
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

// load users details from mongo db
var users = []
const connectionUrl = 'mongodb+srv://primary-db:db_main@primary.4vb8qle.mongodb.net'
const client = new MongoClient(connectionUrl, { useNewUrlParser: true })

async function fetchUsersData() {
    try {
        await client.connect()
        const db = client.db('test')
        const collection = db.collection('coll')
        const query = {}
        const cursor = collection.find(query)

        await cursor.forEach(user => {
            users.push(user)
        });

    } finally {
        await client.close()
        console.log(`User - ${users}`)
        if (users.length === 0) {
            users = usersBackup
        }
        return users
    }
}

app.get('/', (req, res) => {
    res.send('UP')
})

app.get('/users', authToken, (req, res) => {
    res.json(users.filter(user => req.user.id === user.id))
})

app.get('/u', (req, res) => {
    fetchUsersData()
    .then((users) => {
        res.json(users)
    })
})

app.post('/login', (req, res) => {
    username = req.body.username
    password = req.body.password

    const user = verifyUserCreds(username, password)
    if (user && user.length === 0) {
        res.sendStatus(200)
    }

    const token = jwt.sign({ id: user[0].id, name: user[0].name }, 'TOKEN_SECRET', { expiresIn: '600s' })
    res.json({ access_token: token })
})

function verifyUserCreds(username, password) {
    return users.filter(user => user.name === username && user.password === password)
}

function authToken(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1]
    if (null == token) return res.sendStatus(401)

    jwt.verify(token, 'TOKEN_SECRET', (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`listing on ${port}`)
})