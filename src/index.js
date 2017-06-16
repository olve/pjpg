module.exports.readMicrosoftPadding = require('./read/microsoftPadding')
module.exports.readComment = require('./read/comment')
module.exports.readMarkers = require('./read/markers')
module.exports.readSegment = require('./read/generic')
module.exports.readAdobe = require('./read/adobe')
module.exports.readIPTC = require('./read/iptc')
module.exports.readJFIF = require('./read/jfif')
module.exports.readExif = require('./read/exif')
module.exports.app1 = require('./read/app1')
module.exports.dict = require('./dict')
module.exports.util = require('./util')

module.exports.parseJpeg = require('./parse').default
