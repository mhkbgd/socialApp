const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();
const firebaseConfig = {
    apiKey: "AIzaSyBUDokpr38K0zmV-La-zIkVxrizhs4qi98",
    authDomain: "socialapp-fceaa.firebaseapp.com",
    databaseURL: "https://socialapp-fceaa.firebaseio.com",
    projectId: "socialapp-fceaa",
    storageBucket: "socialapp-fceaa.appspot.com",
    messagingSenderId: "97180486813",
    appId: "1:97180486813:web:64bbd9a1512ca9efd09874",
    measurementId: "G-MX9V7K817H"
  };
const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', (req, res)=>{

    db
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
        createdAt: new Date().toISOString()
    };

    db
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

//sign up 

app.post('/signup', (req, res) =>{
    const newUser = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        handle: req.body.handle,
    }

    db.doc(`/users/${newUser.handle}`).get()
    .then(doc =>{
        if(doc.exists){
            return res.status(400).json({handle: 'this handle is already taken'});
        }else{
            return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password)
        }
    })
    .then(data => {
        return data.user.getIdTokern();
    })
    .then(token =>{
        return res.status(201).json({ token });
    })
    .catch(err =>{
        return res.status(500).json({error: err.code});
    })
})
   exports.api = functions.https.onRequest(app);