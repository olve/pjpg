import gps from './gps'
import image from './image'
import iop from './iop'
import photo from './photo'

import {assignHelpers} from '../helpers'

assignHelpers(gps)
assignHelpers(image)
assignHelpers(iop)
assignHelpers(photo)

export const gps = gps
export const image = image
export const photo = photo
export const iop = iop
