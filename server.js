const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

let users;
fs.readFile(path.resolve(__dirname, './data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) throw err;
  users = JSON.parse(data);
})

const addMsgToRequest = function (req, res, next) {
  if(users) {
    req.users = users;
    next();
  }
  else {
    return res.json({
        error: {message: 'users not found', status: 404}
    });
  }
  
}

app.use(
  cors({origin: 'http://localhost:3000'})
);
app.use('/read/usernames', addMsgToRequest);

app.get('/read/usernames', (req, res) => {
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username};
  });
  res.send(usernames);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req, res) => {
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, './data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
})

app.use('/read/username', addMsgToRequest);
app.get('/read/username/:input', (req, res) => {
  let name = req.params.input;
  let user_name = req.users.filter(function(user) {
    return user.username === name;
  });
  console.log(user_name);
  if(user_name.length === 0 ) {
    res.send({
      error:{ message: `${name} not found`, status: 400}
    });
  }
  else{
    res.send(user_name);  
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
