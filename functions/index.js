const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const express = require('express');
const app = express();


app.get('/screams', (req, res)=>{

    admin
    .firestore()
    .collection('screams')
    .orderBy('createdAt' , 'desc')
    .get()
    .then(data =>{
        let screams =[];
        data.forEach(doc =>{
            screams.push({
                screamId: doc.id,
                body: doc.data().body,
                userHandle: doc.data().userHandle,
                createdAt: doc.data().createdAt
            });
        });
        return res.json(screams);
    })
    .catch(err=>console.error(err));
})

app.post('/scream', (req, res)=>{
    const newScrem = {
        body: req.body.body,
        userHandle: req.body.userHandle,
        createdAt: admin.firestore.Timestamp.fromDate(new Date())
    };

    admin.firestore()
    .collection('screams')
    .add(newScrem)
    .then(doc =>{
        res.json({message: 'document created successfully'});
    })
    .catch(err =>{
        res.status(500).json({error: 'something went wrong'});
        console.error(err);
    })

})


   exports.api = functions.https.onRequest(app);