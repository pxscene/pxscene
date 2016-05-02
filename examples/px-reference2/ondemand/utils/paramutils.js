/**
 * Created by tjcarroll2
 * on 2/27/16.
 */

module.exports = {
     getParam:function(params, key, defaultValue) {
         if( params.hasOwnProperty(key) ) {
           return params[key];
         } else {
           return defaultValue;
         }
     }
};