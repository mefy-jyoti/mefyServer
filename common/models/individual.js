'use strict';

const Composer = require('../lib/composer.js');

module.exports = function (individual) {

   // HIDE UNUSED REMORE METHODS
  const enabledRemoteMethods = ["findById", "updateProfile", "deleteById"];
  individual.sharedClass.methods().forEach(method => {
    const methodName = method.stringName.replace(/.*?(?=\.)/, '').substr(1);
    if (enabledRemoteMethods.indexOf(methodName) === -1) {
      individual.disableRemoteMethodByName(methodName);
    }
  });

  /*********************UPDATE INDIVIDUAL STARTS ****************************** */

  individual.remoteMethod('updateProfile', {
    http: { path: '/profile/:userId', verb: 'put' },
    description:"update individual profile by userId",
    accepts: [
      { arg: 'userId', type: 'string', required: true, http: { source: 'path' } },
      { arg: 'data', type: 'obj' }
    ],
    returns: { arg: 'result', type: 'string' },
  });


  // UPDATE INDIVIDUAL PROFILE WITH PASSED FIELDS
  individual.updateProfile = function (userId, data, cb) {
    //check user existence
    individual.findOne({ where: { userId: 'resource:io.mefy.commonModel.User#' + userId } }, function (err, exists) {
      console.log('result', exists)
      if (exists != null && Object.keys(exists).length != 0) {
        // update attributes
        exists.updateAttributes(data, function (err, result) {
          console.log('response from update', result);

          let success = {
            error: false,
            result: result,
            message: 'Profile updated Sucessfully'
          }
          cb(null, success);
        })

      }
      else {
        let error = {
          error: true,
          message: 'User not found'
        }
        cb(null, error)
      }
    })
  }

  /********************************ENDS ************************************ */
};
