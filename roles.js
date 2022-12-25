const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("basic")
 .readAny("product")

ac.grant("admin")
 .extend("basic")
 .createOwn("product")
 .updateAny("product")
 .deleteAny("product")

  return ac; 
})();