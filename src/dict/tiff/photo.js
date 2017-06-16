//TIFF PHOTO TAGS (exif)

export default {
    0xea1c: {
        "chr": "B",
        "desc": "Microsoft Padding (http://www.freepatentsonline.com/7421451.html)",
        "name": "WindowsPadding",
        "fullname": "Exif.Image.WindowsPadding",
        "type": 7,
    },
    0x829a: {
        "chr": "I",
        "desc": "Exposure time, given in seconds (sec).",
        "fullname": "Exif.Photo.ExposureTime",
        "name": "ExposureTime",
        "type": 5
    },
    0x829d: {
        "chr": "I",
        "desc": "The F number.",
        "fullname": "Exif.Photo.FNumber",
        "name": "FNumber",
        "type": 5
    },
    0x8822: {
        "chr": "H",
        "desc": "The class of the program used by the camera to set exposure when the picture is taken.",
        "fullname": "Exif.Photo.ExposureProgram",
        "name": "ExposureProgram",
        "stringvalues": {
            "0": "Not Defined",
            "1": "Manual",
            "2": "Program AE",
            "3": "Aperture-priority AE",
            "4": "Shutter speed priority AE",
            "5": "Creative (Slow speed)",
            "6": "Action (High speed)",
            "7": "Portrait",
            "8": "Landscape",
            "9": "Bulb"
        },
        "type": 3
    },
    0x8824: {
        "chr": "B",
        "desc": "Indicates the spectral sensitivity of each channel of the camera used. The tag value is an ASCII string compatible with the standard developed by the ASTM Technical Committee.",
        "fullname": "Exif.Photo.SpectralSensitivity",
        "name": "SpectralSensitivity",
        "type": 2
    },
    0x8827: {
        "chr": "H",
        "desc": "Indicates the ISO Speed and ISO Latitude of the camera or input device as specified in ISO 12232.",
        "fullname": "Exif.Photo.ISOSpeedRatings",
        "name": "ISOSpeedRatings",
        "type": 3
    },
    0x8828: {
        "chr": "B",
        "desc": "Indicates the Opto-Electoric Conversion Function (OECF) specified in ISO 14524. <OECF> is the relationship between the camera optical input and the image values.",
        "fullname": "Exif.Photo.OECF",
        "name": "OECF",
        "type": 7
    },
    0x8830: {
        "chr": "H",
        "desc": "The SensitivityType tag indicates PhotographicSensitivity tag. which one of the parameters of ISO12232 is the Although it is an optional tag, it should be recorded when a PhotographicSensitivity tag is recorded. Value = 4, 5, 6, or 7 may be used in case that the values of plural parameters are the same.",
        "fullname": "Exif.Photo.SensitivityType",
        "name": "SensitivityType",
        "stringvalues": {
            "0": "Unknown",
            "1": "Standard Output Sensitivity",
            "2": "Recommended Exposure Index",
            "3": "ISO Speed",
            "4": "Standard Output Sensitivity and Recommended Exposure Index",
            "5": "Standard Output Sensitivity and ISO Speed",
            "6": "Recommended Exposure Index and ISO Speed",
            "7": "Standard Output Sensitivity, Recommended Exposure Index and ISO Speed"
        },
        "type": 3
    },
    0x8831: {
        "chr": "I",
        "desc": "This tag indicates the standard output sensitivity value of a camera or input device defined in ISO 12232. When recording this tag, the PhotographicSensitivity and SensitivityType tags shall also be recorded.",
        "fullname": "Exif.Photo.StandardOutputSensitivity",
        "name": "StandardOutputSensitivity",
        "type": 4
    },
    0x8832: {
        "chr": "I",
        "desc": "This tag indicates the recommended exposure index value of a camera or input device defined in ISO 12232. When recording this tag, the PhotographicSensitivity and SensitivityType tags shall also be recorded.",
        "fullname": "Exif.Photo.RecommendedExposureIndex",
        "name": "RecommendedExposureIndex",
        "type": 4
    },
    0x8833: {
        "chr": "I",
        "desc": "This tag indicates the ISO speed value of a camera or input device that is defined in ISO 12232. When recording this tag, the PhotographicSensitivity and SensitivityType tags shall also be recorded.",
        "fullname": "Exif.Photo.ISOSpeed",
        "name": "ISOSpeed",
        "type": 4
    },
    0x8834: {
        "chr": "I",
        "desc": "This tag indicates the ISO speed latitude yyy value of a camera or input device that is defined in ISO 12232. However, this tag shall not be recorded without ISOSpeed and ISOSpeedLatitudezzz.",
        "fullname": "Exif.Photo.ISOSpeedLatitudeyyy",
        "name": "ISOSpeedLatitudeyyy",
        "type": 4
    },
    0x8835: {
        "chr": "I",
        "desc": "This tag indicates the ISO speed latitude zzz value of a camera or input device that is defined in ISO 12232. However, this tag shall not be recorded without ISOSpeed and ISOSpeedLatitudeyyy.",
        "fullname": "Exif.Photo.ISOSpeedLatitudezzz",
        "name": "ISOSpeedLatitudezzz",
        "type": 4
    },
    0x9000: {
        "chr": "B",
        "desc": "The version of this standard supported. Nonexistence of this field is taken to mean nonconformance to the standard.",
        "fullname": "Exif.Photo.ExifVersion",
        "name": "ExifVersion",
        "type": 7
    },
    0x9003: {
        "chr": "B",
        "desc": "The date and time when the original image data was generated. For a digital still camera the date and time the picture was taken are recorded.",
        "fullname": "Exif.Photo.DateTimeOriginal",
        "name": "DateTimeOriginal",
        "type": 2
    },
    0x9004: {
        "chr": "B",
        "desc": "The date and time when the image was stored as digital data.",
        "fullname": "Exif.Photo.DateTimeDigitized",
        "name": "DateTimeDigitized",
        "type": 2
    },
    0x9101: {
        "chr": "B",
        "desc": "Information specific to compressed data. The channels of each component are arranged in order from the 1st component to the 4th. For uncompressed data the data arrangement is given in the <PhotometricInterpretation> tag. However, since <PhotometricInterpretation> can only express the order of Y, Cb and Cr, this tag is provided for cases when compressed data uses components other than Y, Cb, and Cr and to enable support of other sequences.",
        "fullname": "Exif.Photo.ComponentsConfiguration",
        "name": "ComponentsConfiguration",
        "stringvalues": {
            "0": "-",
            "1": "Y",
            "2": "Cb",
            "3": "Cr",
            "4": "R",
            "5": "G",
            "6": "B"
        },
        "type": 7
    },
    0x9102: {
        "chr": "I",
        "desc": "Information specific to compressed data. The compression mode used for a compressed image is indicated in unit bits per pixel.",
        "fullname": "Exif.Photo.CompressedBitsPerPixel",
        "name": "CompressedBitsPerPixel",
        "type": 5
    },
    0x9201: {
        "chr": "l",
        "desc": "Shutter speed. The unit is the APEX (Additive System of Photographic Exposure) setting.",
        "fullname": "Exif.Photo.ShutterSpeedValue",
        "name": "ShutterSpeedValue",
        "type": 10
    },
    0x9202: {
        "chr": "I",
        "desc": "The lens aperture. The unit is the APEX value.",
        "fullname": "Exif.Photo.ApertureValue",
        "name": "ApertureValue",
        "type": 5
    },
    0x9203: {
        "chr": "l",
        "desc": "The value of brightness. The unit is the APEX value. Ordinarily it is given in the range of -99.99 to 99.99.",
        "fullname": "Exif.Photo.BrightnessValue",
        "name": "BrightnessValue",
        "type": 10
    },
    0x9204: {
        "chr": "l",
        "desc": "The exposure bias. The units is the APEX value. Ordinarily it is given in the range of -99.99 to 99.99.",
        "fullname": "Exif.Photo.ExposureBiasValue",
        "name": "ExposureBiasValue",
        "type": 10
    },
    0x9205: {
        "chr": "I",
        "desc": "The smallest F number of the lens. The unit is the APEX value. Ordinarily it is given in the range of 00.00 to 99.99, but it is not limited to this range.",
        "fullname": "Exif.Photo.MaxApertureValue",
        "name": "MaxApertureValue",
        "type": 5
    },
    0x9206: {
        "chr": "I",
        "desc": "The distance to the subject, given in meters.",
        "fullname": "Exif.Photo.SubjectDistance",
        "name": "SubjectDistance",
        "type": 5
    },
    0x9207: {
        "chr": "H",
        "desc": "The metering mode.",
        "fullname": "Exif.Photo.MeteringMode",
        "name": "MeteringMode",
        "stringvalues": {
            "0": "Unknown",
            "1": "Average",
            "2": "Center-weighted average",
            "255": "Other",
            "3": "Spot",
            "4": "Multi-spot",
            "5": "Multi-segment",
            "6": "Partial"
        },
        "type": 3
    },
    0x9208: {
        "chr": "H",
        "desc": "The kind of light source.",
        "fullname": "Exif.Photo.LightSource",
        "name": "LightSource",
        "type": 3
    },
    0x9209: {
        "chr": "H",
        "desc": "This tag is recorded when an image is taken using a strobe light (flash).",
        "fullname": "Exif.Photo.Flash",
        "name": "Flash",
        "type": 3
    },
    0x920a: {
        "chr": "I",
        "desc": "The actual focal length of the lens, in mm. Conversion is not made to the focal length of a 35 mm film camera.",
        "fullname": "Exif.Photo.FocalLength",
        "name": "FocalLength",
        "type": 5
    },
    0x9214: {
        "chr": "H",
        "desc": "This tag indicates the location and area of the main subject in the overall scene.",
        "fullname": "Exif.Photo.SubjectArea",
        "name": "SubjectArea",
        "type": 3
    },
    0x927c: {
        "chr": "B",
        "desc": "A tag for manufacturers of Exif writers to record any desired information. The contents are up to the manufacturer.",
        "fullname": "Exif.Photo.MakerNote",
        "name": "MakerNote",
        "type": 7
    },
    0x9286: {
        "chr": "B",
        "desc": "A tag for Exif users to write keywords or comments on the image besides those in <ImageDescription>, and without the character code limitations of the <ImageDescription> tag.",
        "fullname": "Exif.Photo.UserComment",
        "name": "UserComment",
        "type": 7
    },
    0x9290: {
        "chr": "B",
        "desc": "A tag used to record fractions of seconds for the <DateTime> tag.",
        "fullname": "Exif.Photo.SubSecTime",
        "name": "SubSecTime",
        "type": 2
    },
    0x9291: {
        "chr": "B",
        "desc": "A tag used to record fractions of seconds for the <DateTimeOriginal> tag.",
        "fullname": "Exif.Photo.SubSecTimeOriginal",
        "name": "SubSecTimeOriginal",
        "type": 2
    },
    0x9292: {
        "chr": "B",
        "desc": "A tag used to record fractions of seconds for the <DateTimeDigitized> tag.",
        "fullname": "Exif.Photo.SubSecTimeDigitized",
        "name": "SubSecTimeDigitized",
        "type": 2
    },
    0xa000: {
        "chr": "B",
        "desc": "The FlashPix format version supported by a FPXR file.",
        "fullname": "Exif.Photo.FlashpixVersion",
        "name": "FlashpixVersion",
        "type": 7
    },
    0xa001: {
        "chr": "H",
        "desc": "The color space information tag is always recorded as the color space specifier. Normally sRGB is used to define the color space based on the PC monitor conditions and environment. If a color space other than sRGB is used, Uncalibrated is set. Image data recorded as Uncalibrated can be treated as sRGB when it is converted to FlashPix.",
        "fullname": "Exif.Photo.ColorSpace",
        "name": "ColorSpace",
        "stringvalues": {
            "0x1": "sRGB",
            "0x2": "Adobe RGB",
            "0xfffd": "Wide Gamut RGB",
            "0xfffe": "ICC Profile",
            "0xffff": "Uncalibrated"
        },
        "type": 3
    },
    0xa002: {
        "chr": "I",
        "desc": "Information specific to compressed data. When a compressed file is recorded, the valid width of the meaningful image must be recorded in this tag, whether or not there is padding data or a restart marker. This tag should not exist in an uncompressed file.",
        "fullname": "Exif.Photo.PixelXDimension",
        "name": "PixelXDimension",
        "type": 4
    },
    0xa003: {
        "chr": "I",
        "desc": "Information specific to compressed data. When a compressed file is recorded, the valid height of the meaningful image must be recorded in this tag, whether or not there is padding data or a restart marker. This tag should not exist in an uncompressed file. Since data padding is unnecessary in the vertical direction, the number of lines recorded in this valid image height tag will in fact be the same as that recorded in the SOF.",
        "fullname": "Exif.Photo.PixelYDimension",
        "name": "PixelYDimension",
        "type": 4
    },
    0xa004: {
        "chr": "B",
        "desc": "This tag is used to record the name of an audio file related to the image data. The only relational information recorded here is the Exif audio file name and extension (an ASCII string consisting of 8 characters + '.' + 3 characters). The path is not recorded.",
        "fullname": "Exif.Photo.RelatedSoundFile",
        "name": "RelatedSoundFile",
        "type": 2
    },
    0xa005: {
        "chr": "I",
        "desc": "Interoperability IFD is composed of tags which stores the information to ensure the Interoperability and pointed by the following tag located in Exif IFD. The Interoperability structure of Interoperability IFD is the same as TIFF defined IFD structure but does not contain the image data characteristically compared with normal TIFF IFD.",
        "fullname": "Exif.Photo.InteroperabilityTag",
        "name": "InteroperabilityTag",
        "type": 4
    },
    0xa20b: {
        "chr": "I",
        "desc": "Indicates the strobe energy at the time the image is captured, as measured in Beam Candle Power Seconds (BCPS).",
        "fullname": "Exif.Photo.FlashEnergy",
        "name": "FlashEnergy",
        "type": 5
    },
    0xa20c: {
        "chr": "B",
        "desc": "This tag records the camera or input device spatial frequency table and SFR values in the direction of image width, image height, and diagonal direction, as specified in ISO 12233.",
        "fullname": "Exif.Photo.SpatialFrequencyResponse",
        "name": "SpatialFrequencyResponse",
        "type": 7
    },
    0xa20e: {
        "chr": "I",
        "desc": "Indicates the number of pixels in the image width (X) direction per <FocalPlaneResolutionUnit> on the camera focal plane.",
        "fullname": "Exif.Photo.FocalPlaneXResolution",
        "name": "FocalPlaneXResolution",
        "type": 5
    },
    0xa20f: {
        "chr": "I",
        "desc": "Indicates the number of pixels in the image height (V) direction per <FocalPlaneResolutionUnit> on the camera focal plane.",
        "fullname": "Exif.Photo.FocalPlaneYResolution",
        "name": "FocalPlaneYResolution",
        "type": 5
    },
    0xa210: {
        "chr": "H",
        "desc": "Indicates the unit for measuring <FocalPlaneXResolution> and <FocalPlaneYResolution>. This value is the same as the <ResolutionUnit>.",
        "fullname": "Exif.Photo.FocalPlaneResolutionUnit",
        "name": "FocalPlaneResolutionUnit",
        "stringvalues": {
            "1": "None",
            "2": "inches",
            "3": "cm",
            "4": "mm",
            "5": "um"
        },
        "type": 3
    },
    0xa214: {
        "chr": "H",
        "desc": "Indicates the location of the main subject in the scene. The value of this tag represents the pixel at the center of the main subject relative to the left edge, prior to rotation processing as per the <Rotation> tag. The first value indicates the X column number and second indicates the Y row number.",
        "fullname": "Exif.Photo.SubjectLocation",
        "name": "SubjectLocation",
        "type": 3
    },
    0xa215: {
        "chr": "I",
        "desc": "Indicates the exposure index selected on the camera or input device at the time the image is captured.",
        "fullname": "Exif.Photo.ExposureIndex",
        "name": "ExposureIndex",
        "type": 5
    },
    0xa217: {
        "chr": "H",
        "desc": "Indicates the image sensor type on the camera or input device.",
        "fullname": "Exif.Photo.SensingMethod",
        "name": "SensingMethod",
        "stringvalues": {
            "1": "Not defined",
            "2": "One-chip color area",
            "3": "Two-chip color area",
            "4": "Three-chip color area",
            "5": "Color sequential area",
            "7": "Trilinear",
            "8": "Color sequential linear"
        },
        "type": 3
    },
    0xa300: {
        "chr": "B",
        "desc": "Indicates the image source. If a DSC recorded the image, this tag value of this tag always be set to 3, indicating that the image was recorded on a DSC.",
        "fullname": "Exif.Photo.FileSource",
        "name": "FileSource",
        "stringvalues": {
            "\"\\x03\\x00\\x00\\x00\"": "Sigma Digital Camera",
            "1": "Film Scanner",
            "2": "Reflection Print Scanner",
            "3": "Digital Camera"
        },
        "type": 7
    },
    0xa301: {
        "chr": "B",
        "desc": "Indicates the type of scene. If a DSC recorded the image, this tag value must always be set to 1, indicating that the image was directly photographed.",
        "fullname": "Exif.Photo.SceneType",
        "name": "SceneType",
        "stringvalues": {
            "1": "Directly photographed"
        },
        "type": 7
    },
    0xa302: {
        "chr": "B",
        "desc": "Indicates the color filter array (CFA) geometric pattern of the image sensor when a one-chip color area sensor is used. It does not apply to all sensing methods.",
        "fullname": "Exif.Photo.CFAPattern",
        "name": "CFAPattern",
        "type": 7
    },
    0xa401: {
        "chr": "H",
        "desc": "This tag indicates the use of special processing on image data, such as rendering geared to output. When special processing is performed, the reader is expected to disable or minimize any further processing.",
        "fullname": "Exif.Photo.CustomRendered",
        "name": "CustomRendered",
        "stringvalues": {
            "0": "Normal",
            "1": "Custom"
        },
        "type": 3
    },
    0xa402: {
        "chr": "H",
        "desc": "This tag indicates the exposure mode set when the image was shot. In auto-bracketing mode, the camera shoots a series of frames of the same scene at different exposure settings.",
        "fullname": "Exif.Photo.ExposureMode",
        "name": "ExposureMode",
        "stringvalues": {
            "0": "Auto",
            "1": "Manual",
            "2": "Auto bracket"
        },
        "type": 3
    },
    0xa403: {
        "chr": "H",
        "desc": "This tag indicates the white balance mode set when the image was shot.",
        "fullname": "Exif.Photo.WhiteBalance",
        "name": "WhiteBalance",
        "stringvalues": {
            "0": "Auto",
            "1": "Manual"
        },
        "type": 3
    },
    0xa404: {
        "chr": "I",
        "desc": "This tag indicates the digital zoom ratio when the image was shot. If the numerator of the recorded value is 0, this indicates that digital zoom was not used.",
        "fullname": "Exif.Photo.DigitalZoomRatio",
        "name": "DigitalZoomRatio",
        "type": 5
    },
    0xa405: {
        "chr": "H",
        "desc": "This tag indicates the equivalent focal length assuming a 35mm film camera, in mm. A value of 0 means the focal length is unknown. Note that this tag differs from the <FocalLength> tag.",
        "fullname": "Exif.Photo.FocalLengthIn35mmFilm",
        "name": "FocalLengthIn35mmFilm",
        "type": 3
    },
    0xa406: {
        "chr": "H",
        "desc": "This tag indicates the type of scene that was shot. It can also be used to record the mode in which the image was shot. Note that this differs from the <SceneType> tag.",
        "fullname": "Exif.Photo.SceneCaptureType",
        "name": "SceneCaptureType",
        "stringvalues": {
            "0": "Standard",
            "1": "Landscape",
            "2": "Portrait",
            "3": "Night"
        },
        "type": 3
    },
    0xa407: {
        "chr": "H",
        "desc": "This tag indicates the degree of overall image gain adjustment.",
        "fullname": "Exif.Photo.GainControl",
        "name": "GainControl",
        "stringvalues": {
            "0": "None",
            "1": "Low gain up",
            "2": "High gain up",
            "3": "Low gain down",
            "4": "High gain down"
        },
        "type": 3
    },
    0xa408: {
        "chr": "H",
        "desc": "This tag indicates the direction of contrast processing applied by the camera when the image was shot.",
        "fullname": "Exif.Photo.Contrast",
        "name": "Contrast",
        "stringvalues": {
            "0": "Normal",
            "1": "Low",
            "2": "High"
        },
        "type": 3
    },
    0xa409: {
        "chr": "H",
        "desc": "This tag indicates the direction of saturation processing applied by the camera when the image was shot.",
        "fullname": "Exif.Photo.Saturation",
        "name": "Saturation",
        "stringvalues": {
            "0": "Normal",
            "1": "Low",
            "2": "High"
        },
        "type": 3
    },
    0xa40a: {
        "chr": "H",
        "desc": "This tag indicates the direction of sharpness processing applied by the camera when the image was shot.",
        "fullname": "Exif.Photo.Sharpness",
        "name": "Sharpness",
        "stringvalues": {
            "0": "Normal",
            "1": "Soft",
            "2": "Hard"
        },
        "type": 3
    },
    0xa40b: {
        "chr": "B",
        "desc": "This tag indicates information on the picture-taking conditions of a particular camera model. The tag is used only to indicate the picture-taking conditions in the reader.",
        "fullname": "Exif.Photo.DeviceSettingDescription",
        "name": "DeviceSettingDescription",
        "type": 7
    },
    0xa40c: {
        "chr": "H",
        "desc": "This tag indicates the distance to the subject.",
        "fullname": "Exif.Photo.SubjectDistanceRange",
        "name": "SubjectDistanceRange",
        "stringvalues": {
            "0": "Unknown",
            "1": "Macro",
            "2": "Close",
            "3": "Distant"
        },
        "type": 3
    },
    0xa420: {
        "chr": "B",
        "desc": "This tag indicates an identifier assigned uniquely to each image. It is recorded as an ASCII string equivalent to hexadecimal notation and 128-bit fixed length.",
        "fullname": "Exif.Photo.ImageUniqueID",
        "name": "ImageUniqueID",
        "type": 2
    },
    0xa430: {
        "chr": "B",
        "desc": "This tag records the owner of a camera used in photography as an ASCII string.",
        "fullname": "Exif.Photo.CameraOwnerName",
        "name": "CameraOwnerName",
        "type": 2
    },
    0xa431: {
        "chr": "B",
        "desc": "This tag records the serial number of the body of the camera that was used in photography as an ASCII string.",
        "fullname": "Exif.Photo.BodySerialNumber",
        "name": "BodySerialNumber",
        "type": 2
    },
    0xa432: {
        "chr": "I",
        "desc": "This tag notes minimum focal length, maximum focal length, minimum F number in the minimum focal length, and minimum F number in the maximum focal length, which are specification information for the lens that was used in photography. When the minimum F number is unknown, the notation is 0/0",
        "fullname": "Exif.Photo.LensSpecification",
        "name": "LensSpecification",
        "type": 5
    },
    0xa433: {
        "chr": "B",
        "desc": "This tag records the lens manufactor as an ASCII string.",
        "fullname": "Exif.Photo.LensMake",
        "name": "LensMake",
        "type": 2
    },
    0xa434: {
        "chr": "B",
        "desc": "This tag records the lens's model name and model number as an ASCII string.",
        "fullname": "Exif.Photo.LensModel",
        "name": "LensModel",
        "type": 2
    },
    0xa435: {
        "chr": "B",
        "desc": "This tag records the serial number of the interchangeable lens that was used in photography as an ASCII string.",
        "fullname": "Exif.Photo.LensSerialNumber",
        "name": "LensSerialNumber",
        "type": 2
    }
}
