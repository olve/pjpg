//TIFF_IOP_TAGS (interoperability, exif)

export default {
    0xea1c: {
        "chr": "B",
        "desc": "Microsoft Padding (http://www.freepatentsonline.com/7421451.html)",
        "name": "WindowsPadding",
        "fullname": "Exif.Image.WindowsPadding",
        "type": 7,
    },
    0x0001: {
        "chr": "B",
        "desc": "Indicates the identification of the Interoperability rule. Use \"R98\" for stating ExifR98 Rules. Four bytes used including the termination code (NULL). see the separate volume of Recommended Exif Interoperability Rules (ExifR98) for other tags used for ExifR98.",
        "fullname": "Exif.Iop.InteroperabilityIndex",
        "name": "InteroperabilityIndex",
        "stringvalues": {
            "R03": "R03 - DCF option file (Adobe RGB)",
            "R98": "R98 - DCF basic file (sRGB)",
            "THM": "THM - DCF thumbnail file"
        },
        "type": 2
    },
    0x0002: {
        "chr": "B",
        "desc": "Interoperability version",
        "fullname": "Exif.Iop.InteroperabilityVersion",
        "name": "InteroperabilityVersion",
        "type": 7
    },
    0x1000: {
        "chr": "B",
        "desc": "File format of image file",
        "fullname": "Exif.Iop.RelatedImageFileFormat",
        "name": "RelatedImageFileFormat",
        "type": 2
    },
    0x1001: {
        "chr": "I",
        "desc": "Image width",
        "fullname": "Exif.Iop.RelatedImageWidth",
        "name": "RelatedImageWidth",
        "type": 4
    },
    0x1002: {
        "chr": "I",
        "desc": "Image height",
        "fullname": "Exif.Iop.RelatedImageLength",
        "name": "RelatedImageLength",
        "type": 4
    }
}
