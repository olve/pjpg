//TIFF GPS TAGS

import { assignHelpers } from '../helpers'

export default assignHelpers({
    0xea1c: {
        "chr": "B",
        "desc": "Microsoft Padding (http://www.freepatentsonline.com/7421451.html)",
        "name": "WindowsPadding",
        "fullname": "Exif.Image.WindowsPadding",
        "type": 7,
    },
    0x0000: {
        "chr": "B",
        "desc": "Indicates the version of <GPSInfoIFD>. The version is given as 2.0.0.0. This tag is mandatory when <GPSInfo> tag is present. (Note: The <GPSVersionID> tag is given in bytes, unlike the <ExifVersion> tag. When the version is 2.0.0.0, the tag value is 02000000.H).",
        "fullname": "Exif.GPSInfo.GPSVersionID",
        "name": "GPSVersionID",
        "type": 1
    },
    0x0001: {
        "chr": "B",
        "desc": "Indicates whether the latitude is north or south latitude. The ASCII value 'N' indicates north latitude, and 'S' is south latitude.",
        "fullname": "Exif.GPSInfo.GPSLatitudeRef",
        "name": "GPSLatitudeRef",
        "stringvalues": {
            "N": "North",
            "S": "South"
        },
        "type": 2
    },
    0x0002: {
        "chr": "I",
        "desc": "Indicates the latitude. The latitude is expressed as three RATIONAL values giving the degrees, minutes, and seconds, respectively. When degrees, minutes and seconds are expressed, the format is dd/1,mm/1,ss/1. When degrees and minutes are used and, for example, fractions of minutes are given up to two decimal places, the format is dd/1,mmmm/100,0/1.",
        "fullname": "Exif.GPSInfo.GPSLatitude",
        "name": "GPSLatitude",
        "type": 5
    },
    0x0003: {
        "chr": "B",
        "desc": "Indicates whether the longitude is east or west longitude. ASCII 'E' indicates east longitude, and 'W' is west longitude.",
        "fullname": "Exif.GPSInfo.GPSLongitudeRef",
        "name": "GPSLongitudeRef",
        "stringvalues": {
            "E": "East",
            "W": "West"
        },
        "type": 2
    },
    0x0004: {
        "chr": "I",
        "desc": "Indicates the longitude. The longitude is expressed as three RATIONAL values giving the degrees, minutes, and seconds, respectively. When degrees, minutes and seconds are expressed, the format is ddd/1,mm/1,ss/1. When degrees and minutes are used and, for example, fractions of minutes are given up to two decimal places, the format is ddd/1,mmmm/100,0/1.",
        "fullname": "Exif.GPSInfo.GPSLongitude",
        "name": "GPSLongitude",
        "type": 5
    },
    0x0005: {
        "chr": "B",
        "desc": "Indicates the altitude used as the reference altitude. If the reference is sea level and the altitude is above sea level, 0 is given. If the altitude is below sea level, a value of 1 is given and the altitude is indicated as an absolute value in the GSPAltitude tag. The reference unit is meters. Note that this tag is BYTE type, unlike other reference tags.",
        "fullname": "Exif.GPSInfo.GPSAltitudeRef",
        "name": "GPSAltitudeRef",
        "stringvalues": {
            "0": "Above Sea Level",
            "1": "Below Sea Level"
        },
        "type": 1
    },
    0x0006: {
        "chr": "I",
        "desc": "Indicates the altitude based on the reference in GPSAltitudeRef. Altitude is expressed as one RATIONAL value. The reference unit is meters.",
        "fullname": "Exif.GPSInfo.GPSAltitude",
        "name": "GPSAltitude",
        "type": 5
    },
    0x0007: {
        "chr": "I",
        "desc": "Indicates the time as UTC (Coordinated Universal Time). <TimeStamp> is expressed as three RATIONAL values giving the hour, minute, and second (atomic clock).",
        "fullname": "Exif.GPSInfo.GPSTimeStamp",
        "name": "GPSTimeStamp",
        "type": 5
    },
    0x0008: {
        "chr": "B",
        "desc": "Indicates the GPS satellites used for measurements. This tag can be used to describe the number of satellites, their ID number, angle of elevation, azimuth, SNR and other information in ASCII notation. The format is not specified. If the GPS receiver is incapable of taking measurements, value of the tag is set to NULL.",
        "fullname": "Exif.GPSInfo.GPSSatellites",
        "name": "GPSSatellites",
        "type": 2
    },
    0x0009: {
        "chr": "B",
        "desc": "Indicates the status of the GPS receiver when the image is recorded. \"A\" means measurement is in progress, and \"V\" means the measurement is Interoperability.",
        "fullname": "Exif.GPSInfo.GPSStatus",
        "name": "GPSStatus",
        "stringvalues": {
            "A": "Measurement Active",
            "V": "Measurement Void"
        },
        "type": 2
    },
    0x000a: {
        "chr": "B",
        "desc": "Indicates the GPS measurement mode. \"2\" means two-dimensional measurement and \"3\" means three-dimensional measurement is in progress.",
        "fullname": "Exif.GPSInfo.GPSMeasureMode",
        "name": "GPSMeasureMode",
        "stringvalues": {
            "2": "2-Dimensional Measurement",
            "3": "3-Dimensional Measurement"
        },
        "type": 2
    },
    0x000b: {
        "chr": "I",
        "desc": "Indicates the GPS DOP (data degree of precision). An HDOP value is written during two-dimensional measurement, and PDOP during three-dimensional measurement.",
        "fullname": "Exif.GPSInfo.GPSDOP",
        "name": "GPSDOP",
        "type": 5
    },
    0x000c: {
        "chr": "B",
        "desc": "Indicates the unit used to express the GPS receiver speed of movement. \"K\" \"M\" and \"N\" represents kilometers per hour, miles per hour, and knots.",
        "fullname": "Exif.GPSInfo.GPSSpeedRef",
        "name": "GPSSpeedRef",
        "stringvalues": {
            "K": "km/h",
            "M": "mph",
            "N": "knots"
        },
        "type": 2
    },
    0x000d: {
        "chr": "I",
        "desc": "Indicates the speed of GPS receiver movement.",
        "fullname": "Exif.GPSInfo.GPSSpeed",
        "name": "GPSSpeed",
        "type": 5
    },
    0x000e: {
        "chr": "B",
        "desc": "Indicates the reference for giving the direction of GPS receiver movement. \"T\" denotes true direction and \"M\" is magnetic direction.",
        "fullname": "Exif.GPSInfo.GPSTrackRef",
        "name": "GPSTrackRef",
        "stringvalues": {
            "M": "Magnetic North",
            "T": "True North"
        },
        "type": 2
    },
    0x000f: {
        "chr": "I",
        "desc": "Indicates the direction of GPS receiver movement. The range of values is from 0.00 to 359.99.",
        "fullname": "Exif.GPSInfo.GPSTrack",
        "name": "GPSTrack",
        "type": 5
    },
    0x0010: {
        "chr": "B",
        "desc": "Indicates the reference for giving the direction of the image when it is captured. \"T\" denotes true direction and \"M\" is magnetic direction.",
        "fullname": "Exif.GPSInfo.GPSImgDirectionRef",
        "name": "GPSImgDirectionRef",
        "stringvalues": {
            "M": "Magnetic North",
            "T": "True North"
        },
        "type": 2
    },
    0x0011: {
        "chr": "I",
        "desc": "Indicates the direction of the image when it was captured. The range of values is from 0.00 to 359.99.",
        "fullname": "Exif.GPSInfo.GPSImgDirection",
        "name": "GPSImgDirection",
        "type": 5
    },
    0x0012: {
        "chr": "B",
        "desc": "Indicates the geodetic survey data used by the GPS receiver. If the survey data is restricted to Japan, the value of this tag is \"TOKYO\" or \"WGS-84\".",
        "fullname": "Exif.GPSInfo.GPSMapDatum",
        "name": "GPSMapDatum",
        "type": 2
    },
    0x0013: {
        "chr": "B",
        "desc": "Indicates whether the latitude of the destination point is north or south latitude. The ASCII value \"N\" indicates north latitude, and \"S\" is south latitude.",
        "fullname": "Exif.GPSInfo.GPSDestLatitudeRef",
        "name": "GPSDestLatitudeRef",
        "stringvalues": {
            "N": "North",
            "S": "South"
        },
        "type": 2
    },
    0x0014: {
        "chr": "I",
        "desc": "Indicates the latitude of the destination point. The latitude is expressed as three RATIONAL values giving the degrees, minutes, and seconds, respectively. If latitude is expressed as degrees, minutes and seconds, a typical format would be dd/1,mm/1,ss/1. When degrees and minutes are used and, for example, fractions of minutes are given up to two decimal places, the format would be dd/1,mmmm/100,0/1.",
        "fullname": "Exif.GPSInfo.GPSDestLatitude",
        "name": "GPSDestLatitude",
        "type": 5
    },
    0x0015: {
        "chr": "B",
        "desc": "Indicates whether the longitude of the destination point is east or west longitude. ASCII \"E\" indicates east longitude, and \"W\" is west longitude.",
        "fullname": "Exif.GPSInfo.GPSDestLongitudeRef",
        "name": "GPSDestLongitudeRef",
        "stringvalues": {
            "E": "East",
            "W": "West"
        },
        "type": 2
    },
    0x0016: {
        "chr": "I",
        "desc": "Indicates the longitude of the destination point. The longitude is expressed as three RATIONAL values giving the degrees, minutes, and seconds, respectively. If longitude is expressed as degrees, minutes and seconds, a typical format would be ddd/1,mm/1,ss/1. When degrees and minutes are used and, for example, fractions of minutes are given up to two decimal places, the format would be ddd/1,mmmm/100,0/1.",
        "fullname": "Exif.GPSInfo.GPSDestLongitude",
        "name": "GPSDestLongitude",
        "type": 5
    },
    0x0017: {
        "chr": "B",
        "desc": "Indicates the reference used for giving the bearing to the destination point. \"T\" denotes true direction and \"M\" is magnetic direction.",
        "fullname": "Exif.GPSInfo.GPSDestBearingRef",
        "name": "GPSDestBearingRef",
        "stringvalues": {
            "M": "Magnetic North",
            "T": "True North"
        },
        "type": 2
    },
    0x0018: {
        "chr": "I",
        "desc": "Indicates the bearing to the destination point. The range of values is from 0.00 to 359.99.",
        "fullname": "Exif.GPSInfo.GPSDestBearing",
        "name": "GPSDestBearing",
        "type": 5
    },
    0x0019: {
        "chr": "B",
        "desc": "Indicates the unit used to express the distance to the destination point. \"K\", \"M\" and \"N\" represent kilometers, miles and knots.",
        "fullname": "Exif.GPSInfo.GPSDestDistanceRef",
        "name": "GPSDestDistanceRef",
        "stringvalues": {
            "K": "Kilometers",
            "M": "Miles",
            "N": "Nautical Miles"
        },
        "type": 2
    },
    0x001a: {
        "chr": "I",
        "desc": "Indicates the distance to the destination point.",
        "fullname": "Exif.GPSInfo.GPSDestDistance",
        "name": "GPSDestDistance",
        "type": 5
    },
    0x001b: {
        "chr": "B",
        "desc": "A character string recording the name of the method used for location finding. The first byte indicates the character code used, and this is followed by the name of the method.",
        "fullname": "Exif.GPSInfo.GPSProcessingMethod",
        "name": "GPSProcessingMethod",
        "type": 7
    },
    0x001c: {
        "chr": "B",
        "desc": "A character string recording the name of the GPS area. The first byte indicates the character code used, and this is followed by the name of the GPS area.",
        "fullname": "Exif.GPSInfo.GPSAreaInformation",
        "name": "GPSAreaInformation",
        "type": 7
    },
    0x001d: {
        "chr": "B",
        "desc": "A character string recording date and time information relative to UTC (Coordinated Universal Time). The format is \"YYYY:MM:DD.\".",
        "fullname": "Exif.GPSInfo.GPSDateStamp",
        "name": "GPSDateStamp",
        "type": 2
    },
    0x001e: {
        "chr": "H",
        "desc": "Indicates whether differential correction is applied to the GPS receiver.",
        "fullname": "Exif.GPSInfo.GPSDifferential",
        "name": "GPSDifferential",
        "stringvalues": {
            "0": "No Correction",
            "1": "Differential Corrected"
        },
        "type": 3
    }
})
