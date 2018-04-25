var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var longpoll = require("express-longpoll")(router);

router.post('/', (req,res,next) => {
    global.newMessege = req.body;
    longpoll.publish('/api/poll', { messange: req.body})
        .then(() => {
            console.log("Published to /api/poll:", { messange: req.body});
        });
    MongoClient.connect(global.url, async (err, db) => {
        if(err) throw err;
        console.log('connected');
       let collection = db.collection('messanges');
       let lenght = await collection.count();
       if (lenght > global.maxMess) {
           await collection.deleteOne();
       }
       await collection.insertOne(req.body);
       db.close();
    });
    res.end();
});

router.get('/get_all', async (req, res, next) => {
    let toSend;
    await MongoClient.connect(global.url, async (err, db) => {
       if(err ) throw err;
       console.log('connected');
        await db.collection('messanges').find({}).toArray((err, doc) => {
            console.log('Mam dane');
            toSend = doc;
            console.log(toSend);
            res.end(JSON.stringify(toSend))
        });

        db.close();
    });

});

// router.get('/test', async (req, res, next) => {
//     console.log(req);
//     let testIn = setInterval( () => {
//         MongoClient.connect(global.url, async (err, db) => {
//             if(err) throw err;
//             let test = await db.collection('messanges').find({_id: req.query.id});
//             console.log(await test.hasNext());
//             // if(test) {
//             //     clearInterval(testIn);
//             //     res.end(JSON.stringify(test));
//             // }
//         });
//     }, 500)
// });

module.exports = router;