// import file system
const { throws } = require('assert');
const { error } = require('console');
const fs = require('fs');
const { resolve } = require('path');

// import readLine
const readline = require("readline");

// import validator
const validator = require("validator");

// question name
// const questionsName = (ask) => {
//   return new Promise((resolve,reject) =>{
//     rl.question(ask, (answer) => {
//       resolve(answer);
//     })
//   })
// }

// question and validate phone number
// const questionsPhone = (ask) => {
//   return new Promise((resolve,reject) => {
//     rl.question(ask, (pnumber) => {
//       if (!validator.isMobilePhone(pnumber, "id-ID")) {
//         console.log('phone number not valid!');
//         resolve(questionsPhone(ask));
//       }else{
//         resolve(pnumber);
//       }
//     })
//   })
// }

// question and validate email
// const questionsEmail = (ask) => {
//   return new Promise((resolve,reject) => {
//     rl.question(ask, (email) => {
//       if (!validator.isEmail(email)) {
//         console.log('email not valid!');
//         resolve(questionsEmail(ask));
//       }else{
//         resolve(email);
//       }
//     })
//   })
// }

// check duplicate data JSON
const checkDuplicate = (name) => {
  const contacts = loadContact();
  let count = 0;
  contacts.forEach(element => {
    if (name == element.name) {
      // console.log(name);
      count = count + 1;
    }
  });

  if (count > 0) {
    return true;
  }else{
    return false;
  }
}

// validate dir folder path
function dirPathValidator(dirPath){
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
  }
}

// validate dir data path
function dataPathValidator(dataPath){
  if (!fs.existsSync(dataPath)) {
      fs.writeFileSync(dataPath,'[]','utf-8');
  }
}

// function for validate email
function validateEmail(email){
  if (!validator.isEmail(email)) {
    return true;
  }
}

// function for validate mobile phone number
function validateMobile(mobile){
  if (!validator.isMobilePhone(mobile, "id-ID")) {
    return true;
  }
}

// load contact
const loadContact = () => {
  const file = fs.readFileSync('data/contacts.json','utf8');
  const contacts = JSON.parse(file);
  return contacts;
}

// Create list contact
const listContact = () => {
  const contacts = loadContact();
  console.log('Contact List : ');
  contacts.forEach((contact,i) => {
    console.log(`${i+1}.${contact.name} - ${contact.mobile}`);
  });
}

// detail contact
const detailContact = (name) => {
  
  const contacts = loadContact();
  const findName = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
  if (findName) {
    console.log(findName.name);
    console.log(findName.mobile);
    if (findName.email) {
      console.log(findName.email);  
    }
    return findName
  }else{
    console.log(`contact ${name} not exist!`);
  }
}

// delete contact
const deleteContact = (name) => {
  const contacts = loadContact();
  const findName = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());
  if (findName) {
    const remainingData = contacts.filter((contact) => contact.name.toLowerCase() !== name.toLowerCase());
    console.log(`${name} delete success`);
    // console.log(remainingData);
    overWriteFileContact(remainingData)
  }else{
    console.log(`contact ${name} not exist!`);
  }
}

// update contact
const updateContact = (oldName,newName,mobile,email) => {
  const contacts = loadContact();
  const findName = contacts.find((contact) => contact.name.toLowerCase() === oldName.toLowerCase());
  if (findName) {
    // const oldMobile = findName.mobile;
    // const oldEmail = findName.email;
    // if (newName == '' || newName === undefined || newName === null){
    //   findName.name = oldName;
    // }else if (checkDuplicate(newName)){
    //   console.log(`${newName} already exist!`);
    //   return false;
    // }else{
      findName.name = newName;
    // }

    // if (mobile == '' || mobile === undefined || mobile === null ){
    //   findName.mobile = oldMobile;
    // }else{
    //   if (validateMobile(mobile)) {
    //     console.log("mobile phone number not valid!");
    //     return false;
    //   }else{
        findName.mobile = mobile;
    //   }
    // }

    // if (email =='' || email === undefined || email === null){
    //   findName.email = oldEmail;
    // }else{
    //   if (validateEmail(email)) {
    //     console.log("email not valid!");
    //     return false;
    //   }else{
        findName.email = email;
    //   }
    // }

    // console.log(contacts);
    // console.log(findName);
    // const updateContacts={findName}
    overWriteFileContact(contacts);
    console.log(`${oldName} update success`);
  }else{
    console.log(`contact ${oldName} not exist!`);
  }
}

// overwrite save file contact to JSON
const overWriteFileContact = (contact) =>{
  const dirPath = "./data";
  const dataPath = "./data/contacts.json";
  dirPathValidator(dirPath);
  dataPathValidator(dataPath);
  const contacts = contact;
  fs.writeFileSync('data/contacts.json',JSON.stringify(contacts));

}

// save file contact with parameter and check duplicate
const saveFileContactPar = (name,mobile,email) =>{
  let contact = {name,mobile,email};
  // const file = fs.readFileSync('data/contacts.json','utf8');
  // const contacts = JSON.parse(file);
  const dirPath = "./data";
  const dataPath = "./data/contacts.json";
  dirPathValidator(dirPath);
  dataPathValidator(dataPath);

  // load contactss
  const contacts = loadContact();

  contacts.push(contact);
  fs.writeFileSync('data/contacts.json',JSON.stringify(contacts));
  console.log("Terima kasih, data anda sudah tersimpan");   
  // rl.close();
  
}

module.exports = {deleteContact,detailContact,updateContact,saveFileContactPar,listContact,loadContact,checkDuplicate,validateEmail,validateMobile};