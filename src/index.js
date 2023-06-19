import app from './app.js'
import {pool} from './db.js'

app.get('/ping', async (req, res) => {
    const [result] = await pool.query('SELECT "Pong" AS Result')
    res.json(result)
})

app.listen(3030)
console.log('server on port', 3030)