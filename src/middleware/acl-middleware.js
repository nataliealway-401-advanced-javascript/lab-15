'use strict';

module.exports = capabilities => {
  return (req, res, next) => {
    try {
      if (req.user[0].userRoles.capabilities.includes(capabilities)) {
        console.log('OK!');
        next();
      } else {
        next(`Access Denied`);
      }
    } catch (e) {
      next('Invalid Login');
    }
  };
};