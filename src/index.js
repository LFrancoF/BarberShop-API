import app from './app.js'
import {pool} from './db.js'


app.listen(process.env.PORT || 3030, () => {
    console.log('Server listening at PORT:', process.env.PORT || 3030);
});