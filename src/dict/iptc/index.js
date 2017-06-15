var envelope = require('./envelope')
var application2 = require('./application2')

var assignHelpers = require('../helpers').assignHelpers

assignHelpers(envelope)
assignHelpers(application2)

module.exports.envelope = envelope
module.exports.application2 = application2
