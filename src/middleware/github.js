'use strict';

const superagent = require('superagent');
const users = require('../../models/userModel.js');
require('dotenv').config();

/*
  Resources
  https://developer.github.com/apps/building-oauth-apps/
*/

const tokenServerUrl = process.env.TOKEN_SERVER;
const redirect = process.env.REMOTE_API;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const api_server = process.env.API_SERVER;

module.exports = async function authorize(req, res, next) {

  try {
    let code = req.query.code;
    console.log('(1) CODE:', code);

    let remoteToken = await exchangeCodeForToken(code);
    console.log('(2) ACCESS TOKEN:', remoteToken);

    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('(3) GITHUB USER', remoteUser);

    let [user, token] = await getUser(remoteUser);
    // req.user = user;
    // req.token = token;
    console.log('HERE!!!!!!!!!!!', user, token);
    
    console.log('(4) LOCAL USER', user);

    next();
  } catch (e) { next(`ERROR: ${e.message}`);}

};

async function exchangeCodeForToken(code) {

  let tokenResponse = await superagent.get(tokenServerUrl).send({
    code: code,
    client_id: client_id,
    client_secret: client_secret,
    redirect: redirect,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;
  return access_token;

}

async function getRemoteUserInfo(token) {

  let userResponse = await superagent.get(redirect)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);

  let user = userResponse.body;
  return user;

}

async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: 'oauthpassword',
  };

  //console.log(userRecord);

  let user = await users.save(userRecord);
  let token = users.generateToken(user);

  console.log('USER & TOKEN!!!!!!!!', user, token);
  return [user, token];

}