const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("basic")
 .readAny("product")
 .createOwn("favourite")
 .readOwn("favourite")
 .deleteOwn("favourite")

ac.grant("admin")
 .extend("basic")
 .createOwn("product")
 .updateAny("product")
 .deleteAny("product")
 .readAny("user")

  return ac; 
})();