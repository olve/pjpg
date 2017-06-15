var gps = require('./gps')
var image = require('./image')
var iop = require('./iop')
var photo = require('./photo')

var assignHelpers = require('../helpers').assignHelpers


assignHelpers(gps)
assignHelpers(image)
assignHelpers(iop)
assignHelpers(photo)


module.exports.gps = gps
module.exports.image = image
module.exports.iop = iop
module.exports.photo = photo
