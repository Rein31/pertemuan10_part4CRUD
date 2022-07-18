
const express = require("express");
var expressLayouts = require('express-ejs-layouts');
var morgan = require('morgan')
const contact = require('./contact');
const app = express();
const {body,validationResult,check} = require('express-validator')

const port = 3000;



// information using ejs
app.set('view engine', 'ejs')

// use express static for public folder
app.use(express.static('public'))

// use express layout
app.use(expressLayouts);
// set default layout for all routing
app.set('layout', 'layouts/main');

// create a write stream (in append mode)
// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
 
// use morgan mode dev
app.use(morgan('dev'))

app.use(express.urlencoded())

// app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next()
  })

app.get("/", (req, res) => {
    res.render('index', {
        nama: "Reinaldi",
        title : "WEB server EJS", 
    });
});

app.get("/about", (req, res) => {
//   res.send("This is page about!");
    res.render('about', {
        title : "About Page"
    })
});

// add new contact first render
app.get("/contact/add", (req, res) => {
    // res.send("This is contact about!");
    res.render('add-contact', {
        title : "Add New Contact Page",
        error : '',
        oldContact : '',
    })
});

// add new contact
app.post('/contact', 
    check('name').custom(value => {
        if (contact.checkDuplicate(value)   ) {
                throw new Error("name is already exist");
            }
            return true
    }),
    check('email').isEmail().withMessage("Email not valid"),
    check('mobile').isMobilePhone().withMessage("Mobile phone not valid"),
    (req,res) =>{
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const name = req.body.name;
            const mobile = req.body.mobile;
            const email = req.body.email;
            const oldContact = {name,mobile,email}
            console.log(result);
            res.render('add-contact', {
                title:"Add New Contact Page",
                oldContact,
                error: result.array(),
            })
        }else {
            const name = req.body.name;
            const mobile = req.body.mobile;
            const email = req.body.email;
            contact.saveFileContactPar(name,mobile,email);

            res.redirect('/contact')
        }
    
})
 
// delete contact
app.post('/contact/delete', (req,res) => {
    const name = req.body.idName;
    contact.deleteContact(name)
    res.redirect('/contact')
})

// detail contact
app.get("/contact/:idName", (req, res) => {
    // res.send("This is contact about!");
    
    const detailCont = contact.detailContact(req.params.idName);
    res.render('detailCont', {
        title : "Detail Contact",
        cont : detailCont,
    })
});

// update contact first render
app.get('/contact/update/:idName',(req,res) =>{
        const name = req.params.idName;
        const oldName = req.params.idName;
        const detailCont = contact.detailContact(name);
        res.render('updateContact', {
            title:"update contact",
            oldContact : detailCont,
            oldName,
            error:''
        })
})

// update contact
app.post('/contact/update/:idName',
    check('name').custom((value, {req}) => {
        if (contact.checkDuplicate(value)   && value !== req.body.oldName) {
                throw new Error("name is already exist");
        }
            return true
    }),
    check('email').isEmail().withMessage("Email not valid"),
    check('mobile').isMobilePhone().withMessage("Mobile phone not valid"),
    (req,res) =>{
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const oldName = req.params.idName;
            const name = req.body.name;
            const mobile = req.body.mobile;
            const email = req.body.email;
            const oldContact = {name,mobile,email}
            // console.log(oldContact);
            // console.log(result);
            res.render('updateContact', {
                title:"update contact",
                oldContact,
                oldName,
                error: result.array(),
            })
        }else {
            const oldName = req.params.idName;
            const name = req.body.name;
            const mobile = req.body.mobile;
            const email = req.body.email;
            // const newUpdateCont = {name,mobile,email}
            contact.updateContact(oldName,name,mobile,email)
            res.redirect('/contact')
        }
})

// contact page
app.get("/contact", (req, res) => {
    // res.send("This is contact about!");
    // import folder data with file contact JSON
    const contactJson = require('./data/contacts.json');
    console.log(contactJson);
    res.render('contact', {
        title : "Contact Page",
        cont : contactJson,
    })
});

// product tester page
app.get('/product/:id', (req, res) => {
    // res.send('product id : ' + req.params.id + '<br><br>'
    // + 'category id : ' + req.params.idCat)
    res.send(`product id : ${req.params.id} <br> category id : ${req.query.category}`)
})

app.use('/', (req,res) => {
    res.status(404)
    res.send("404 Page Not Found!")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});