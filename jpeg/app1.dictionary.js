/* dictionaries in this file:
    var TIFF_IMAGE_TAGS (IFD0, IFD1, general image tags)
    var TIFF_PHOTO_TAGS (Exif IFD, camera/photo tags)
    var TIFF_GPS_TAGS (GPS IFD, gps tags)
    var TIFF_IOP_TAGS (IOP IFD, interoperability tags)
*/

function getJpegTagDictionaryAttribute(tagId, dictionary, attribute) {
    //Gets given attribute of tag from it's entry in a provided dictionary
    if (dictionary) {
        var entry = dictionary[tagId];
        if (entry) {
            return value = entry[attribute];
        }
    }
};
function getJpegTagStringValues(tagId, values, dictionary) {
    //get stringvalues (values legible by humans) from provided dictionary for array of tag values
    //example for values=[2] and tagId=0x9207: "Center-weighted average"
    var output = [];
    if (dictionary) {
        var stringvalues = getJpegTagDictionaryAttribute(tagId, dictionary, "stringvalues");
        if (stringvalues) {
            for (var i = 0; i < values.length; i++) {
                var val = values[i].toString();
                if (stringvalues.hasOwnProperty(val)) {
                    val = stringvalues[val];
                }
                output.push(val);
            }
        }
        else {
            output = values;
        }
        return output;
    }
};
function parseJpegTagValue(tag, dictionary) {

    function lettersToString(letters) {
        //combine characters to a string ["E","x","i","f"] -> "Exif"
        var output = "";
        letters.forEach(function(character) {
            output += character;
        });
        return output;
    }
    function charsToString(chars) {
        //combine charcodes to a string [0x41, 0x42] -> "AB"
        var output = "";
        chars.forEach(function(charCode) {
            output += String.fromCharCode(charCode);
        });
        return output;
    }
    function lettersToCharCodes(letters) {
        //return letters as charcodes ["A", "B"] -> [0x41, 0x42]
        var output = [];
        letters.forEach(function(letter) {
            output.push(letter.charCodeAt(0));
        });
        return output;
    }
    function charsToUTF16String(chars, littleEndian) {
        //combine chars to a UTF16 string [0, 0x24, 0xD8, 0x52, 0xDF, 0x62] -> "$𤭢"
        var i = 0;
        var step = 1;
        if (littleEndian) {
            i = 1;
            step = -1;
        }
        var output = "";
        for ( ; i < chars.length; i+=2) {
            var b1 = chars[i];
            var b2 = chars[i+step];
            if (b1 < 0xD8 || b1 >= 0xE0) {
                output += String.fromCharCode(b1+b2);
            }
            else {
                i+=2;
                var b3 = chars[i];
                var b4 = chars[i+step];
                output += String.fromCharCode((b1<<8)+b2, (b3<<8)+b4);
            }
        }
        return output;
    }

    var value;

    if (tag.type === 2) {
        value = lettersToString(tag.value);
    }
    else if (tag.id === 0) {
        //add dots to GPS version tag.
        value = tag.value.slice(0, 4).join(".");
    }
    else if (tag.id === 0x9286 || tag.id === 0x927C) {
        //Exif.Photo.UserComment and Exif MakerNote. type 7 undefined. For writing comments with any encoding.
        value = charsToString(tag.value, tag.littleEndian);
    }
    else if ([0x9c9b, 0x9c9c, 0x9c9d, 0x9c9e, 0x9c9f].indexOf(tag.id) !== -1) {
        //Turn Windows XP tags with UCS2 character encoding into UTF-16 strings. (UCS2 is UTF-16's predecessor and is similar enough for us to read it as UTF16.)
        //THIS DOES NOT WORK
        if (typeof tag.value[0] === "string") {
            chars = lettersToCharCodes(tag.value);
        }
        else {
            chars = tag.value;
        }
        value = charsToUTF16String(chars, tag.littleEndian)
    }
    else {
        value = tag.value;
        if (dictionary) {
            value = getJpegTagStringValues(tag.id, tag.value, dictionary)
        }
        if (value.length === 1) {
            value = value[0];
        }
    }
    return value;
};


var TIFF_IMAGE_TAGS = {
    0xea1c: {
        "chr": "B",
        "desc": "Microsoft Padding (http://www.freepatentsonline.com/7421451.html)",
        "name": "WindowsPadding",
        "fullname": "Exif.Image.WindowsPadding",
        "type": 7,
    },    
    0x000b: {
        "chr": "B",
        "desc": "The name and version of the software used to post-process the picture.",
        "fullname": "Exif.Image.ProcessingSoftware",
        "name": "ProcessingSoftware",
        "type": 2
    },
    0x00fe: {
        "chr": "I",
        "desc": "A general indication of the kind of data contained in this subfile.",
        "fullname": "Exif.Image.NewSubfileType",
        "name": "NewSubfileType",
        "stringvalues": {
            "0x0": "Full-resolution Image",
            "0x1": "Reduced-resolution image",
            "0x10001": "Alternate reduced-resolution image",
            "0x2": "Single page of multi-page image",
            "0x3": "Single page of multi-page reduced-resolution image",
            "0x4": "Transparency mask",
            "0x5": "Transparency mask of reduced-resolution image",
            "0x6": "Transparency mask of multi-page image",
            "0x7": "Transparency mask of reduced-resolution multi-page image",
            "0xffffffff": "invalid",
            "Bit 0": "Reduced resolution",
            "Bit 1": "Single page",
            "Bit 2": "Transparency mask",
            "Bit 3": "TIFF/IT final page",
            "Bit 4": "TIFF-FX mixed raster content"
        },
        "type": 4
    },
    0x00ff: {
        "chr": "H",
        "desc": "A general indication of the kind of data contained in this subfile. This field is deprecated. The NewSubfileType field should be used instead.",
        "fullname": "Exif.Image.SubfileType",
        "name": "SubfileType",
        "stringvalues": {
            "1": "Full-resolution image",
            "2": "Reduced-resolution image",
            "3": "Single page of multi-page image"
        },
        "type": 3
    },
    0x0100: {
        "chr": "I",
        "desc": "The number of columns of image data, equal to the number of pixels per row. In JPEG compressed data a JPEG marker is used instead of this tag.",
        "fullname": "Exif.Image.ImageWidth",
        "name": "ImageWidth",
        "type": 4
    },
    0x0101: {
        "chr": "I",
        "desc": "The number of rows of image data. In JPEG compressed data a JPEG marker is used instead of this tag.",
        "fullname": "Exif.Image.ImageLength",
        "name": "ImageLength",
        "type": 4
    },
    0x0102: {
        "chr": "H",
        "desc": "The number of bits per image component. In this standard each component of the image is 8 bits, so the value for this tag is 8. See also <SamplesPerPixel>. In JPEG compressed data a JPEG marker is used instead of this tag.",
        "fullname": "Exif.Image.BitsPerSample",
        "name": "BitsPerSample",
        "type": 3
    },
    0x0103: {
        "chr": "H",
        "desc": "The compression scheme used for the image data. When a primary image is JPEG compressed, this designation is not necessary and is omitted. When thumbnails use JPEG compression, this tag value is set to 6.",
        "fullname": "Exif.Image.Compression",
        "name": "Compression",
        "type": 3
    },
    0x0106: {
        "chr": "H",
        "desc": "The pixel composition. In JPEG compressed data a JPEG marker is used instead of this tag.",
        "fullname": "Exif.Image.PhotometricInterpretation",
        "name": "PhotometricInterpretation",
        "stringvalues": {
            "0": "WhiteIsZero",
            "1": "BlackIsZero",
            "10": "ITULab",
            "2": "RGB",
            "3": "RGB Palette",
            "32803": "Color Filter Array",
            "32844": "Pixar LogL",
            "32845": "Pixar LogLuv",
            "34892": "Linear Raw",
            "4": "Transparency Mask",
            "5": "CMYK",
            "6": "YCbCr",
            "8": "CIELab",
            "9": "ICCLab"
        },
        "type": 3
    },
    0x0107: {
        "chr": "H",
        "desc": "For black and white TIFF files that represent shades of gray, the technique used to convert from gray to black and white pixels.",
        "fullname": "Exif.Image.Threshholding",
        "name": "Threshholding",
        "stringvalues": {
            "1": "No dithering or halftoning",
            "2": "Ordered dither or halftone",
            "3": "Randomized dither"
        },
        "type": 3
    },
    0x0108: {
        "chr": "H",
        "desc": "The width of the dithering or halftoning matrix used to create a dithered or halftoned bilevel file.",
        "fullname": "Exif.Image.CellWidth",
        "name": "CellWidth",
        "type": 3
    },
    0x0109: {
        "chr": "H",
        "desc": "The length of the dithering or halftoning matrix used to create a dithered or halftoned bilevel file.",
        "fullname": "Exif.Image.CellLength",
        "name": "CellLength",
        "type": 3
    },
    0x010a: {
        "chr": "H",
        "desc": "The logical order of bits within a byte",
        "fullname": "Exif.Image.FillOrder",
        "name": "FillOrder",
        "stringvalues": {
            "1": "Normal",
            "2": "Reversed"
        },
        "type": 3
    },
    0x010d: {
        "chr": "B",
        "desc": "The name of the document from which this image was scanned",
        "fullname": "Exif.Image.DocumentName",
        "name": "DocumentName",
        "type": 2
    },
    0x010e: {
        "chr": "B",
        "desc": "A character string giving the title of the image. It may be a comment such as \"1988 company picnic\" or the like. Two-bytes character codes cannot be used. When a 2-bytes code is necessary, the Exif Private tag <UserComment> is to be used.",
        "fullname": "Exif.Image.ImageDescription",
        "name": "ImageDescription",
        "type": 2
    },
    0x010f: {
        "chr": "B",
        "desc": "The manufacturer of the recording equipment. This is the manufacturer of the DSC, scanner, video digitizer or other equipment that generated the image. When the field is left blank, it is treated as unknown.",
        "fullname": "Exif.Image.Make",
        "name": "Make",
        "type": 2
    },
    0x0110: {
        "chr": "B",
        "desc": "The model name or model number of the equipment. This is the model name or number of the DSC, scanner, video digitizer or other equipment that generated the image. When the field is left blank, it is treated as unknown.",
        "fullname": "Exif.Image.Model",
        "name": "Model",
        "type": 2
    },
    0x0111: {
        "chr": "I",
        "desc": "For each strip, the byte offset of that strip. It is recommended that this be selected so the number of strip bytes does not exceed 64 Kbytes. With JPEG compressed data this designation is not needed and is omitted. See also <RowsPerStrip> and <StripByteCounts>.",
        "fullname": "Exif.Image.StripOffsets",
        "name": "StripOffsets",
        "type": 4
    },
    0x0112: {
        "chr": "H",
        "desc": "The image orientation viewed in terms of rows and columns.",
        "fullname": "Exif.Image.Orientation",
        "name": "Orientation",
        "stringvalues": {
            "1": "Horizontal (normal)",
            "2": "Mirror horizontal",
            "3": "Rotate 180",
            "4": "Mirror vertical",
            "5": "Mirror horizontal and rotate 270 CW",
            "6": "Rotate 90 CW",
            "7": "Mirror horizontal and rotate 90 CW",
            "8": "Rotate 270 CW"
        },
        "type": 3
    },
    0x0115: {
        "chr": "H",
        "desc": "The number of components per pixel. Since this standard applies to RGB and YCbCr images, the value set for this tag is 3. In JPEG compressed data a JPEG marker is used instead of this tag.",
        "fullname": "Exif.Image.SamplesPerPixel",
        "name": "SamplesPerPixel",
        "type": 3
    },
    0x0116: {
        "chr": "I",
        "desc": "The number of rows per strip. This is the number of rows in the image of one strip when an image is divided into strips. With JPEG compressed data this designation is not needed and is omitted. See also <StripOffsets> and <StripByteCounts>.",
        "fullname": "Exif.Image.RowsPerStrip",
        "name": "RowsPerStrip",
        "type": 4
    },
    0x0117: {
        "chr": "I",
        "desc": "The total number of bytes in each strip. With JPEG compressed data this designation is not needed and is omitted.",
        "fullname": "Exif.Image.StripByteCounts",
        "name": "StripByteCounts",
        "type": 4
    },
    0x011a: {
        "chr": "I",
        "desc": "The number of pixels per <ResolutionUnit> in the <ImageWidth> direction. When the image resolution is unknown, 72 [dpi] is designated.",
        "fullname": "Exif.Image.XResolution",
        "name": "XResolution",
        "type": 5
    },
    0x011b: {
        "chr": "I",
        "desc": "The number of pixels per <ResolutionUnit> in the <ImageLength> direction. The same value as <XResolution> is designated.",
        "fullname": "Exif.Image.YResolution",
        "name": "YResolution",
        "type": 5
    },
    0x011c: {
        "chr": "H",
        "desc": "Indicates whether pixel components are recorded in a chunky or planar format. In JPEG compressed files a JPEG marker is used instead of this tag. If this field does not exist, the TIFF default of 1 (chunky) is assumed.",
        "fullname": "Exif.Image.PlanarConfiguration",
        "name": "PlanarConfiguration",
        "stringvalues": {
            "1": "Chunky",
            "2": "Planar"
        },
        "type": 3
    },
    0x0122: {
        "chr": "H",
        "desc": "The precision of the information contained in the GrayResponseCurve.",
        "fullname": "Exif.Image.GrayResponseUnit",
        "name": "GrayResponseUnit",
        "stringvalues": {
            "1": "0.1",
            "2": "0.001",
            "3": "0.0001",
            "4": "1e-05",
            "5": "1e-06"
        },
        "type": 3
    },
    0x0123: {
        "chr": "H",
        "desc": "For grayscale data, the optical density of each possible pixel value.",
        "fullname": "Exif.Image.GrayResponseCurve",
        "name": "GrayResponseCurve",
        "type": 3
    },
    0x0124: {
        "chr": "I",
        "desc": "T.4-encoding options.",
        "fullname": "Exif.Image.T4Options",
        "name": "T4Options",
        "stringvalues": {
            "Bit 0": "2-Dimensional encoding",
            "Bit 1": "Uncompressed",
            "Bit 2": "Fill bits added"
        },
        "type": 4
    },
    0x0125: {
        "chr": "I",
        "desc": "T.6-encoding options.",
        "fullname": "Exif.Image.T6Options",
        "name": "T6Options",
        "stringvalues": {
            "Bit 1": "Uncompressed"
        },
        "type": 4
    },
    0x0128: {
        "chr": "H",
        "desc": "The unit for measuring <XResolution> and <YResolution>. The same unit is used for both <XResolution> and <YResolution>. If the image resolution is unknown, 2 (inches) is designated.",
        "fullname": "Exif.Image.ResolutionUnit",
        "name": "ResolutionUnit",
        "stringvalues": {
            "1": "None",
            "2": "inches",
            "3": "cm"
        },
        "type": 3
    },
    0x012d: {
        "chr": "H",
        "desc": "A transfer function for the image, described in tabular style. Normally this tag is not necessary, since color space is specified in the color space information tag (<ColorSpace>).",
        "fullname": "Exif.Image.TransferFunction",
        "name": "TransferFunction",
        "type": 3
    },
    0x0131: {
        "chr": "B",
        "desc": "This tag records the name and version of the software or firmware of the camera or image input device used to generate the image. The detailed format is not specified, but it is recommended that the example shown below be followed. When the field is left blank, it is treated as unknown.",
        "fullname": "Exif.Image.Software",
        "name": "Software",
        "type": 2
    },
    0x0132: {
        "chr": "B",
        "desc": "The date and time of image creation. In Exif standard, it is the date and time the file was changed.",
        "fullname": "Exif.Image.DateTime",
        "name": "DateTime",
        "type": 2
    },
    0x013b: {
        "chr": "B",
        "desc": "This tag records the name of the camera owner, photographer or image creator. The detailed format is not specified, but it is recommended that the information be written as in the example below for ease of Interoperability. When the field is left blank, it is treated as unknown. Ex.) \"Camera owner, John Smith; Photographer, Michael Brown; Image creator, Ken James\"",
        "fullname": "Exif.Image.Artist",
        "name": "Artist",
        "type": 2
    },
    0x013c: {
        "chr": "B",
        "desc": "This tag records information about the host computer used to generate the image.",
        "fullname": "Exif.Image.HostComputer",
        "name": "HostComputer",
        "type": 2
    },
    0x013d: {
        "chr": "H",
        "desc": "A predictor is a mathematical operator that is applied to the image data before an encoding scheme is applied.",
        "fullname": "Exif.Image.Predictor",
        "name": "Predictor",
        "stringvalues": {
            "1": "None",
            "2": "Horizontal differencing"
        },
        "type": 3
    },
    0x013e: {
        "chr": "I",
        "desc": "The chromaticity of the white point of the image. Normally this tag is not necessary, since color space is specified in the colorspace information tag (<ColorSpace>).",
        "fullname": "Exif.Image.WhitePoint",
        "name": "WhitePoint",
        "type": 5
    },
    0x013f: {
        "chr": "I",
        "desc": "The chromaticity of the three primary colors of the image. Normally this tag is not necessary, since colorspace is specified in the colorspace information tag (<ColorSpace>).",
        "fullname": "Exif.Image.PrimaryChromaticities",
        "name": "PrimaryChromaticities",
        "type": 5
    },
    0x0140: {
        "chr": "H",
        "desc": "A color map for palette color images. This field defines a Red-Green-Blue color map (often called a lookup table) for palette-color images. In a palette-color image, a pixel value is used to index into an RGB lookup table.",
        "fullname": "Exif.Image.ColorMap",
        "name": "ColorMap",
        "type": 3
    },
    0x0141: {
        "chr": "H",
        "desc": "The purpose of the HalftoneHints field is to convey to the halftone function the range of gray levels within a colorimetrically-specified image that should retain tonal detail.",
        "fullname": "Exif.Image.HalftoneHints",
        "name": "HalftoneHints",
        "type": 3
    },
    0x0142: {
        "chr": "H",
        "desc": "The tile width in pixels. This is the number of columns in each tile.",
        "fullname": "Exif.Image.TileWidth",
        "name": "TileWidth",
        "type": 3
    },
    0x0143: {
        "chr": "H",
        "desc": "The tile length (height) in pixels. This is the number of rows in each tile.",
        "fullname": "Exif.Image.TileLength",
        "name": "TileLength",
        "type": 3
    },
    0x0144: {
        "chr": "H",
        "desc": "For each tile, the byte offset of that tile, as compressed and stored on disk. The offset is specified with respect to the beginning of the TIFF file. Note that this implies that each tile has a location independent of the locations of other tiles.",
        "fullname": "Exif.Image.TileOffsets",
        "name": "TileOffsets",
        "type": 3
    },
    0x0145: {
        "chr": "H",
        "desc": "For each tile, the number of (compressed) bytes in that tile. See TileOffsets for a description of how the byte counts are ordered.",
        "fullname": "Exif.Image.TileByteCounts",
        "name": "TileByteCounts",
        "type": 3
    },
    0x014a: {
        "chr": "I",
        "desc": "Defined by Adobe Corporation to enable TIFF Trees within a TIFF file.",
        "fullname": "Exif.Image.SubIFDs",
        "name": "SubIFDs",
        "type": 4
    },
    0x014c: {
        "chr": "H",
        "desc": "The set of inks used in a separated (PhotometricInterpretation=5) image.",
        "fullname": "Exif.Image.InkSet",
        "name": "InkSet",
        "stringvalues": {
            "1": "CMYK",
            "2": "Not CMYK"
        },
        "type": 3
    },
    0x014d: {
        "chr": "B",
        "desc": "The name of each ink used in a separated (PhotometricInterpretation=5) image.",
        "fullname": "Exif.Image.InkNames",
        "name": "InkNames",
        "type": 2
    },
    0x014e: {
        "chr": "H",
        "desc": "The number of inks. Usually equal to SamplesPerPixel, unless there are extra samples.",
        "fullname": "Exif.Image.NumberOfInks",
        "name": "NumberOfInks",
        "type": 3
    },
    0x0150: {
        "chr": "B",
        "desc": "The component values that correspond to a 0% dot and 100% dot.",
        "fullname": "Exif.Image.DotRange",
        "name": "DotRange",
        "type": 1
    },
    0x0151: {
        "chr": "B",
        "desc": "A description of the printing environment for which this separation is intended.",
        "fullname": "Exif.Image.TargetPrinter",
        "name": "TargetPrinter",
        "type": 2
    },
    0x0152: {
        "chr": "H",
        "desc": "Specifies that each pixel has m extra components whose interpretation is defined by one of the values listed below.",
        "fullname": "Exif.Image.ExtraSamples",
        "name": "ExtraSamples",
        "stringvalues": {
            "0": "Unspecified",
            "1": "Associated Alpha",
            "2": "Unassociated Alpha"
        },
        "type": 3
    },
    0x0153: {
        "chr": "H",
        "desc": "This field specifies how to interpret each data sample in a pixel.",
        "fullname": "Exif.Image.SampleFormat",
        "name": "SampleFormat",
        "stringvalues": {
            "1": "Unsigned",
            "2": "Signed",
            "3": "Float",
            "4": "Undefined",
            "5": "Complex int",
            "6": "Complex float"
        },
        "type": 3
    },
    0x0154: {
        "chr": "H",
        "desc": "This field specifies the minimum sample value.",
        "fullname": "Exif.Image.SMinSampleValue",
        "name": "SMinSampleValue",
        "type": 3
    },
    0x0155: {
        "chr": "H",
        "desc": "This field specifies the maximum sample value.",
        "fullname": "Exif.Image.SMaxSampleValue",
        "name": "SMaxSampleValue",
        "type": 3
    },
    0x0156: {
        "chr": "H",
        "desc": "Expands the range of the TransferFunction",
        "fullname": "Exif.Image.TransferRange",
        "name": "TransferRange",
        "type": 3
    },
    0x0157: {
        "chr": "B",
        "desc": "A TIFF ClipPath is intended to mirror the essentials of PostScript's path creation functionality.",
        "fullname": "Exif.Image.ClipPath",
        "name": "ClipPath",
        "type": 1
    },
    0x0158: {
        "chr": "h",
        "desc": "The number of units that span the width of the image, in terms of integer ClipPath coordinates.",
        "fullname": "Exif.Image.XClipPathUnits",
        "name": "XClipPathUnits",
        "type": 8
    },
    0x0159: {
        "chr": "h",
        "desc": "The number of units that span the height of the image, in terms of integer ClipPath coordinates.",
        "fullname": "Exif.Image.YClipPathUnits",
        "name": "YClipPathUnits",
        "type": 8
    },
    0x015a: {
        "chr": "H",
        "desc": "Indexed images are images where the 'pixels' do not represent color values, but rather an index (usually 8-bit) into a separate color table, the ColorMap.",
        "fullname": "Exif.Image.Indexed",
        "name": "Indexed",
        "stringvalues": {
            "0": "Not indexed",
            "1": "Indexed"
        },
        "type": 3
    },
    0x015b: {
        "chr": "B",
        "desc": "This optional tag may be used to encode the JPEG quantization andHuffman tables for subsequent use by the JPEG decompression process.",
        "fullname": "Exif.Image.JPEGTables",
        "name": "JPEGTables",
        "type": 7
    },
    0x015f: {
        "chr": "H",
        "desc": "OPIProxy gives information concerning whether this image is a low-resolution proxy of a high-resolution image (Adobe OPI).",
        "fullname": "Exif.Image.OPIProxy",
        "name": "OPIProxy",
        "stringvalues": {
            "0": "Higher resolution image does not exist",
            "1": "Higher resolution image exists"
        },
        "type": 3
    },
    0x0200: {
        "chr": "I",
        "desc": "This field indicates the process used to produce the compressed data",
        "fullname": "Exif.Image.JPEGProc",
        "name": "JPEGProc",
        "stringvalues": {
            "1": "Baseline",
            "14": "Lossless"
        },
        "type": 4
    },
    0x0201: {
        "chr": "I",
        "desc": "The offset to the start byte (SOI) of JPEG compressed thumbnail data. This is not used for primary image JPEG data.",
        "fullname": "Exif.Image.JPEGInterchangeFormat",
        "name": "JPEGInterchangeFormat",
        "type": 4
    },
    0x0202: {
        "chr": "I",
        "desc": "The number of bytes of JPEG compressed thumbnail data. This is not used for primary image JPEG data. JPEG thumbnails are not divided but are recorded as a continuous JPEG bitstream from SOI to EOI. Appn and COM markers should not be recorded. Compressed thumbnails must be recorded in no more than 64 Kbytes, including all other data to be recorded in APP1.",
        "fullname": "Exif.Image.JPEGInterchangeFormatLength",
        "name": "JPEGInterchangeFormatLength",
        "type": 4
    },
    0x0203: {
        "chr": "H",
        "desc": "This Field indicates the length of the restart interval used in the compressed image data.",
        "fullname": "Exif.Image.JPEGRestartInterval",
        "name": "JPEGRestartInterval",
        "type": 3
    },
    0x0205: {
        "chr": "H",
        "desc": "This Field points to a list of lossless predictor-selection values, one per component.",
        "fullname": "Exif.Image.JPEGLosslessPredictors",
        "name": "JPEGLosslessPredictors",
        "type": 3
    },
    0x0206: {
        "chr": "H",
        "desc": "This Field points to a list of point transform values, one per component.",
        "fullname": "Exif.Image.JPEGPointTransforms",
        "name": "JPEGPointTransforms",
        "type": 3
    },
    0x0207: {
        "chr": "I",
        "desc": "This Field points to a list of offsets to the quantization tables, one per component.",
        "fullname": "Exif.Image.JPEGQTables",
        "name": "JPEGQTables",
        "type": 4
    },
    0x0208: {
        "chr": "I",
        "desc": "This Field points to a list of offsets to the DC Huffman tables or the lossless Huffman tables, one per component.",
        "fullname": "Exif.Image.JPEGDCTables",
        "name": "JPEGDCTables",
        "type": 4
    },
    0x0209: {
        "chr": "I",
        "desc": "This Field points to a list of offsets to the Huffman AC tables, one per component.",
        "fullname": "Exif.Image.JPEGACTables",
        "name": "JPEGACTables",
        "type": 4
    },
    0x0211: {
        "chr": "I",
        "desc": "The matrix coefficients for transformation from RGB to YCbCr image data. No default is given in TIFF; but here the value given in Appendix E, \"Color Space Guidelines\", is used as the default. The color space is declared in a color space information tag, with the default being the value that gives the optimal image characteristics Interoperability this condition.",
        "fullname": "Exif.Image.YCbCrCoefficients",
        "name": "YCbCrCoefficients",
        "type": 5
    },
    0x0212: {
        "chr": "H",
        "desc": "The sampling ratio of chrominance components in relation to the luminance component. In JPEG compressed data a JPEG marker is used instead of this tag.",
        "fullname": "Exif.Image.YCbCrSubSampling",
        "name": "YCbCrSubSampling",
        "stringvalues": {
            "1 1": "YCbCr4:4:4 (1 1)",
            "1 2": "YCbCr4:4:0 (1 2)",
            "1 4": "YCbCr4:4:1 (1 4)",
            "2 1": "YCbCr4:2:2 (2 1)",
            "2 2": "YCbCr4:2:0 (2 2)",
            "2 4": "YCbCr4:2:1 (2 4)",
            "4 1": "YCbCr4:1:1 (4 1)",
            "4 2": "YCbCr4:1:0 (4 2)"
        },
        "type": 3
    },
    0x0213: {
        "chr": "H",
        "desc": "The position of chrominance components in relation to the luminance component. This field is designated only for JPEG compressed data or uncompressed YCbCr data. The TIFF default is 1 (centered); but when Y:Cb:Cr = 4:2:2 it is recommended in this standard that 2 (co-sited) be used to record data, in order to improve the image quality when viewed on TV systems. When this field does not exist, the reader shall assume the TIFF default. In the case of Y:Cb:Cr = 4:2:0, the TIFF default (centered) is recommended. If the reader does not have the capability of supporting both kinds of <YCbCrPositioning>, it shall follow the TIFF default regardless of the value in this field. It is preferable that readers be able to support both centered and co-sited positioning.",
        "fullname": "Exif.Image.YCbCrPositioning",
        "name": "YCbCrPositioning",
        "stringvalues": {
            "1": "Centered",
            "2": "Co-sited"
        },
        "type": 3
    },
    0x0214: {
        "chr": "I",
        "desc": "The reference black point value and reference white point value. No defaults are given in TIFF, but the values below are given as defaults here. The color space is declared in a color space information tag, with the default being the value that gives the optimal image characteristics Interoperability these conditions.",
        "fullname": "Exif.Image.ReferenceBlackWhite",
        "name": "ReferenceBlackWhite",
        "type": 5
    },
    0x02bc: {
        "chr": "B",
        "desc": "XMP Metadata (Adobe technote 9-14-02)",
        "fullname": "Exif.Image.XMLPacket",
        "name": "XMLPacket",
        "type": 1
    },
    0x4746: {
        "chr": "H",
        "desc": "Rating tag used by Windows",
        "fullname": "Exif.Image.Rating",
        "name": "Rating",
        "type": 3
    },
    0x4749: {
        "chr": "H",
        "desc": "Rating tag used by Windows, value in percent",
        "fullname": "Exif.Image.RatingPercent",
        "name": "RatingPercent",
        "type": 3
    },
    0x800d: {
        "chr": "B",
        "desc": "ImageID is the full pathname of the original, high-resolution image, or any other identifying string that uniquely identifies the original image (Adobe OPI).",
        "fullname": "Exif.Image.ImageID",
        "name": "ImageID",
        "type": 2
    },
    0x828d: {
        "chr": "H",
        "desc": "Contains two values representing the minimum rows and columns to define the repeating patterns of the color filter array",
        "fullname": "Exif.Image.CFARepeatPatternDim",
        "name": "CFARepeatPatternDim",
        "type": 3
    },
    0x828e: {
        "chr": "B",
        "desc": "Indicates the color filter array (CFA) geometric pattern of the image sensor when a one-chip color area sensor is used. It does not apply to all sensing methods",
        "fullname": "Exif.Image.CFAPattern",
        "name": "CFAPattern",
        "type": 1
    },
    0x828f: {
        "chr": "I",
        "desc": "Contains a value of the battery level as a fraction or string",
        "fullname": "Exif.Image.BatteryLevel",
        "name": "BatteryLevel",
        "type": 5
    },
    0x8298: {
        "chr": "B",
        "desc": "Copyright information. In this standard the tag is used to indicate both the photographer and editor copyrights. It is the copyright notice of the person or organization claiming rights to the image. The Interoperability copyright statement including date and rights should be written in this field; e.g., \"Copyright, John Smith, 19xx. All rights reserved.\". In this standard the field records both the photographer and editor copyrights, with each recorded in a separate part of the statement. When there is a clear distinction between the photographer and editor copyrights, these are to be written in the order of photographer followed by editor copyright, separated by NULL (in this case since the statement also ends with a NULL, there are two NULL codes). When only the photographer copyright is given, it is terminated by one NULL code . When only the editor copyright is given, the photographer copyright part consists of one space followed by a terminating NULL code, then the editor copyright is given. When the field is left blank, it is treated as unknown.",
        "fullname": "Exif.Image.Copyright",
        "name": "Copyright",
        "type": 2
    },
    0x829a: {
        "chr": "I",
        "desc": "Exposure time, given in seconds.",
        "fullname": "Exif.Image.ExposureTime",
        "name": "ExposureTime",
        "type": 5
    },
    0x829d: {
        "chr": "I",
        "desc": "The F number.",
        "fullname": "Exif.Image.FNumber",
        "name": "FNumber",
        "type": 5
    },
    0x83bb: {
        "chr": "I",
        "desc": "Contains an IPTC/NAA record",
        "fullname": "Exif.Image.IPTCNAA",
        "name": "IPTCNAA",
        "type": 4
    },
    0x8649: {
        "chr": "B",
        "desc": "Contains information embedded by the Adobe Photoshop application",
        "fullname": "Exif.Image.ImageResources",
        "name": "ImageResources",
        "type": 1
    },
    0x8769: {
        "chr": "I",
        "desc": "A pointer to the Exif IFD. Interoperability, Exif IFD has the same structure as that of the IFD specified in TIFF. ordinarily, however, it does not contain image data as in the case of TIFF.",
        "fullname": "Exif.Image.ExifTag",
        "name": "ExifTag",
        "type": 4
    },
    0x8773: {
        "chr": "B",
        "desc": "Contains an InterColor Consortium (ICC) format color space characterization/profile",
        "fullname": "Exif.Image.InterColorProfile",
        "name": "InterColorProfile",
        "type": 7
    },
    0x8822: {
        "chr": "H",
        "desc": "The class of the program used by the camera to set exposure when the picture is taken.",
        "fullname": "Exif.Image.ExposureProgram",
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
        "desc": "Indicates the spectral sensitivity of each channel of the camera used.",
        "fullname": "Exif.Image.SpectralSensitivity",
        "name": "SpectralSensitivity",
        "type": 2
    },
    0x8825: {
        "chr": "I",
        "desc": "A pointer to the GPS Info IFD. The Interoperability structure of the GPS Info IFD, like that of Exif IFD, has no image data.",
        "fullname": "Exif.Image.GPSTag",
        "name": "GPSTag",
        "type": 4
    },
    0x8827: {
        "chr": "H",
        "desc": "Indicates the ISO Speed and ISO Latitude of the camera or input device as specified in ISO 12232.",
        "fullname": "Exif.Image.ISOSpeedRatings",
        "name": "ISOSpeedRatings",
        "type": 3
    },
    0x8828: {
        "chr": "B",
        "desc": "Indicates the Opto-Electric Conversion Function (OECF) specified in ISO 14524.",
        "fullname": "Exif.Image.OECF",
        "name": "OECF",
        "type": 7
    },
    0x8829: {
        "chr": "H",
        "desc": "Indicates the field number of multifield images.",
        "fullname": "Exif.Image.Interlace",
        "name": "Interlace",
        "type": 3
    },
    0x882a: {
        "chr": "h",
        "desc": "This optional tag encodes the time zone of the camera clock (relativeto Greenwich Mean Time) used to create the DataTimeOriginal tag-valuewhen the picture was taken. It may also contain the time zone offsetof the clock used to create the DateTime tag-value when the image wasmodified.",
        "fullname": "Exif.Image.TimeZoneOffset",
        "name": "TimeZoneOffset",
        "type": 8
    },
    0x882b: {
        "chr": "H",
        "desc": "Number of seconds image capture was delayed from button press.",
        "fullname": "Exif.Image.SelfTimerMode",
        "name": "SelfTimerMode",
        "type": 3
    },
    0x9003: {
        "chr": "B",
        "desc": "The date and time when the original image data was generated.",
        "fullname": "Exif.Image.DateTimeOriginal",
        "name": "DateTimeOriginal",
        "type": 2
    },
    0x9102: {
        "chr": "I",
        "desc": "Specific to compressed data; states the compressed bits per pixel.",
        "fullname": "Exif.Image.CompressedBitsPerPixel",
        "name": "CompressedBitsPerPixel",
        "type": 5
    },
    0x9201: {
        "chr": "l",
        "desc": "Shutter speed.",
        "fullname": "Exif.Image.ShutterSpeedValue",
        "name": "ShutterSpeedValue",
        "type": 10
    },
    0x9202: {
        "chr": "I",
        "desc": "The lens aperture.",
        "fullname": "Exif.Image.ApertureValue",
        "name": "ApertureValue",
        "type": 5
    },
    0x9203: {
        "chr": "l",
        "desc": "The value of brightness.",
        "fullname": "Exif.Image.BrightnessValue",
        "name": "BrightnessValue",
        "type": 10
    },
    0x9204: {
        "chr": "l",
        "desc": "The exposure bias.",
        "fullname": "Exif.Image.ExposureBiasValue",
        "name": "ExposureBiasValue",
        "type": 10
    },
    0x9205: {
        "chr": "I",
        "desc": "The smallest F number of the lens.",
        "fullname": "Exif.Image.MaxApertureValue",
        "name": "MaxApertureValue",
        "type": 5
    },
    0x9206: {
        "chr": "l",
        "desc": "The distance to the subject, given in meters.",
        "fullname": "Exif.Image.SubjectDistance",
        "name": "SubjectDistance",
        "type": 10
    },
    0x9207: {
        "chr": "H",
        "desc": "The metering mode.",
        "fullname": "Exif.Image.MeteringMode",
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
        "fullname": "Exif.Image.LightSource",
        "name": "LightSource",
        "type": 3
    },
    0x9209: {
        "chr": "H",
        "desc": "Indicates the status of flash when the image was shot.",
        "fullname": "Exif.Image.Flash",
        "name": "Flash",
        "type": 3
    },
    0x920a: {
        "chr": "I",
        "desc": "The actual focal length of the lens, in mm.",
        "fullname": "Exif.Image.FocalLength",
        "name": "FocalLength",
        "type": 5
    },
    0x920b: {
        "chr": "I",
        "desc": "Amount of flash energy (BCPS).",
        "fullname": "Exif.Image.FlashEnergy",
        "name": "FlashEnergy",
        "type": 5
    },
    0x920c: {
        "chr": "B",
        "desc": "SFR of the camera.",
        "fullname": "Exif.Image.SpatialFrequencyResponse",
        "name": "SpatialFrequencyResponse",
        "type": 7
    },
    0x920d: {
        "chr": "B",
        "desc": "Noise measurement values.",
        "fullname": "Exif.Image.Noise",
        "name": "Noise",
        "type": 7
    },
    0x920e: {
        "chr": "I",
        "desc": "Number of pixels per FocalPlaneResolutionUnit (37392) in ImageWidth direction for main image.",
        "fullname": "Exif.Image.FocalPlaneXResolution",
        "name": "FocalPlaneXResolution",
        "type": 5
    },
    0x920f: {
        "chr": "I",
        "desc": "Number of pixels per FocalPlaneResolutionUnit (37392) in ImageLength direction for main image.",
        "fullname": "Exif.Image.FocalPlaneYResolution",
        "name": "FocalPlaneYResolution",
        "type": 5
    },
    0x9210: {
        "chr": "H",
        "desc": "Unit of measurement for FocalPlaneXResolution(37390) and FocalPlaneYResolution(37391).",
        "fullname": "Exif.Image.FocalPlaneResolutionUnit",
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
    0x9211: {
        "chr": "I",
        "desc": "Number assigned to an image, e.g., in a chained image burst.",
        "fullname": "Exif.Image.ImageNumber",
        "name": "ImageNumber",
        "type": 4
    },
    0x9212: {
        "chr": "B",
        "desc": "Security classification assigned to the image.",
        "fullname": "Exif.Image.SecurityClassification",
        "name": "SecurityClassification",
        "stringvalues": {
            "C": "Confidential",
            "R": "Restricted",
            "S": "Secret",
            "T": "Top Secret",
            "U": "Unclassified"
        },
        "type": 2
    },
    0x9213: {
        "chr": "B",
        "desc": "Record of what has been done to the image.",
        "fullname": "Exif.Image.ImageHistory",
        "name": "ImageHistory",
        "type": 2
    },
    0x9214: {
        "chr": "H",
        "desc": "Indicates the location and area of the main subject in the overall scene.",
        "fullname": "Exif.Image.SubjectLocation",
        "name": "SubjectLocation",
        "type": 3
    },
    0x9215: {
        "chr": "I",
        "desc": "Encodes the camera exposure index setting when image was captured.",
        "fullname": "Exif.Image.ExposureIndex",
        "name": "ExposureIndex",
        "type": 5
    },
    0x9216: {
        "chr": "B",
        "desc": "Contains four ASCII characters representing the TIFF/EP standard version of a TIFF/EP file, eg '1', '0', '0', '0",
        "fullname": "Exif.Image.TIFFEPStandardID",
        "name": "TIFFEPStandardID",
        "type": 1
    },
    0x9217: {
        "chr": "H",
        "desc": "Type of image sensor.",
        "fullname": "Exif.Image.SensingMethod",
        "name": "SensingMethod",
        "stringvalues": {
            "1": "Monochrome area",
            "2": "One-chip color area",
            "3": "Two-chip color area",
            "4": "Three-chip color area",
            "5": "Color sequential area",
            "6": "Monochrome linear",
            "7": "Trilinear",
            "8": "Color sequential linear"
        },
        "type": 3
    },
    0x9c9b: {
        "chr": "B",
        "desc": "Title tag used by Windows, encoded in UCS2",
        "fullname": "Exif.Image.XPTitle",
        "name": "XPTitle",
        "type": 1
    },
    0x9c9c: {
        "chr": "B",
        "desc": "Comment tag used by Windows, encoded in UCS2",
        "fullname": "Exif.Image.XPComment",
        "name": "XPComment",
        "type": 1
    },
    0x9c9d: {
        "chr": "B",
        "desc": "Author tag used by Windows, encoded in UCS2",
        "fullname": "Exif.Image.XPAuthor",
        "name": "XPAuthor",
        "type": 1
    },
    0x9c9e: {
        "chr": "B",
        "desc": "Keywords tag used by Windows, encoded in UCS2",
        "fullname": "Exif.Image.XPKeywords",
        "name": "XPKeywords",
        "type": 1
    },
    0x9c9f: {
        "chr": "B",
        "desc": "Subject tag used by Windows, encoded in UCS2",
        "fullname": "Exif.Image.XPSubject",
        "name": "XPSubject",
        "type": 1
    },
    0xc4a5: {
        "chr": "B",
        "desc": "Print Image Matching, description needed.",
        "fullname": "Exif.Image.PrintImageMatching",
        "name": "PrintImageMatching",
        "type": 7
    },
    0xc612: {
        "chr": "B",
        "desc": "This tag encodes the DNG four-tier version number. For files compliant with version 1.1.0.0 of the DNG specification, this tag should contain the bytes: 1, 1, 0, 0.",
        "fullname": "Exif.Image.DNGVersion",
        "name": "DNGVersion",
        "type": 1
    },
    0xc613: {
        "chr": "B",
        "desc": "This tag specifies the oldest version of the Digital Negative specification for which a file is compatible. Readers shouldnot attempt to read a file if this tag specifies a version number that is higher than the version number of the specification the reader was based on.  In addition to checking the version tags, readers should, for all tags, check the types, counts, and values, to verify it is able to correctly read the file.",
        "fullname": "Exif.Image.DNGBackwardVersion",
        "name": "DNGBackwardVersion",
        "type": 1
    },
    0xc614: {
        "chr": "B",
        "desc": "Defines a unique, non-localized name for the camera model that created the image in the raw file. This name should include the manufacturer's name to avoid conflicts, and should not be localized, even if the camera name itself is localized for different markets (see LocalizedCameraModel). This string may be used by reader software to index into per-model preferences and replacement profiles.",
        "fullname": "Exif.Image.UniqueCameraModel",
        "name": "UniqueCameraModel",
        "type": 2
    },
    0xc615: {
        "chr": "B",
        "desc": "Similar to the UniqueCameraModel field, except the name can be localized for different markets to match the localization of the camera name.",
        "fullname": "Exif.Image.LocalizedCameraModel",
        "name": "LocalizedCameraModel",
        "type": 1
    },
    0xc616: {
        "chr": "B",
        "desc": "Provides a mapping between the values in the CFAPattern tag and the plane numbers in LinearRaw space. This is a required tag for non-RGB CFA images.",
        "fullname": "Exif.Image.CFAPlaneColor",
        "name": "CFAPlaneColor",
        "type": 1
    },
    0xc617: {
        "chr": "H",
        "desc": "Describes the spatial layout of the CFA.",
        "fullname": "Exif.Image.CFALayout",
        "name": "CFALayout",
        "stringvalues": {
            "1": "Rectangular",
            "2": "Even columns offset down 1/2 row",
            "3": "Even columns offset up 1/2 row",
            "4": "Even rows offset right 1/2 column",
            "5": "Even rows offset left 1/2 column",
            "6": "Even rows offset up by 1/2 row, even columns offset left by 1/2 column",
            "7": "Even rows offset up by 1/2 row, even columns offset right by 1/2 column",
            "8": "Even rows offset down by 1/2 row, even columns offset left by 1/2 column",
            "9": "Even rows offset down by 1/2 row, even columns offset right by 1/2 column"
        },
        "type": 3
    },
    0xc618: {
        "chr": "H",
        "desc": "Describes a lookup table that maps stored values into linear values. This tag is typically used to increase compression ratios by storing the raw data in a non-linear, more visually uniform space with fewer total encoding levels. If SamplesPerPixel is not equal to one, this single table applies to all the samples for each pixel.",
        "fullname": "Exif.Image.LinearizationTable",
        "name": "LinearizationTable",
        "type": 3
    },
    0xc619: {
        "chr": "H",
        "desc": "Specifies repeat pattern size for the BlackLevel tag.",
        "fullname": "Exif.Image.BlackLevelRepeatDim",
        "name": "BlackLevelRepeatDim",
        "type": 3
    },
    0xc61a: {
        "chr": "I",
        "desc": "Specifies the zero light (a.k.a. thermal black or black current) encoding level, as a repeating pattern. The origin of this pattern is the top-left corner of the ActiveArea rectangle. The values are stored in row-column-sample scan order.",
        "fullname": "Exif.Image.BlackLevel",
        "name": "BlackLevel",
        "type": 5
    },
    0xc61b: {
        "chr": "l",
        "desc": "If the zero light encoding level is a function of the image column, BlackLevelDeltaH specifies the difference between the zero light encoding level for each column and the baseline zero light encoding level. If SamplesPerPixel is not equal to one, this single table applies to all the samples for each pixel.",
        "fullname": "Exif.Image.BlackLevelDeltaH",
        "name": "BlackLevelDeltaH",
        "type": 10
    },
    0xc61c: {
        "chr": "l",
        "desc": "If the zero light encoding level is a function of the image row, this tag specifies the difference between the zero light encoding level for each row and the baseline zero light encoding level. If SamplesPerPixel is not equal to one, this single table applies to all the samples for each pixel.",
        "fullname": "Exif.Image.BlackLevelDeltaV",
        "name": "BlackLevelDeltaV",
        "type": 10
    },
    0xc61d: {
        "chr": "H",
        "desc": "This tag specifies the fully saturated encoding level for the raw sample values. Saturation is caused either by the sensor itself becoming highly non-linear in response, or by the camera's analog to digital converter clipping.",
        "fullname": "Exif.Image.WhiteLevel",
        "name": "WhiteLevel",
        "type": 3
    },
    0xc61e: {
        "chr": "I",
        "desc": "DefaultScale is required for cameras with non-square pixels. It specifies the default scale factors for each direction to convert the image to square pixels. Typically these factors are selected to approximately preserve total pixel count. For CFA images that use CFALayout equal to 2, 3, 4, or 5, such as the Fujifilm SuperCCD, these two values should usually differ by a factor of 2.0.",
        "fullname": "Exif.Image.DefaultScale",
        "name": "DefaultScale",
        "type": 5
    },
    0xc61f: {
        "chr": "H",
        "desc": "Raw images often store extra pixels around the edges of the final image. These extra pixels help prevent interpolation artifacts near the edges of the final image. DefaultCropOrigin specifies the origin of the final image area, in raw image coordinates (i.e., before the DefaultScale has been applied), relative to the top-left corner of the ActiveArea rectangle.",
        "fullname": "Exif.Image.DefaultCropOrigin",
        "name": "DefaultCropOrigin",
        "type": 3
    },
    0xc620: {
        "chr": "H",
        "desc": "Raw images often store extra pixels around the edges of the final image. These extra pixels help prevent interpolation artifacts near the edges of the final image. DefaultCropSize specifies the size of the final image area, in raw image coordinates (i.e., before the DefaultScale has been applied).",
        "fullname": "Exif.Image.DefaultCropSize",
        "name": "DefaultCropSize",
        "type": 3
    },
    0xc621: {
        "chr": "l",
        "desc": "ColorMatrix1 defines a transformation matrix that converts XYZ values to reference camera native color space values, under the first calibration illuminant. The matrix values are stored in row scan order. The ColorMatrix1 tag is required for all non-monochrome DNG files.",
        "fullname": "Exif.Image.ColorMatrix1",
        "name": "ColorMatrix1",
        "type": 10
    },
    0xc622: {
        "chr": "l",
        "desc": "ColorMatrix2 defines a transformation matrix that converts XYZ values to reference camera native color space values, under the second calibration illuminant. The matrix values are stored in row scan order.",
        "fullname": "Exif.Image.ColorMatrix2",
        "name": "ColorMatrix2",
        "type": 10
    },
    0xc623: {
        "chr": "l",
        "desc": "CameraClalibration1 defines a calibration matrix that transforms reference camera native space values to individual camera native space values under the first calibration illuminant. The matrix is stored in row scan order. This matrix is stored separately from the matrix specified by the ColorMatrix1 tag to allow raw converters to swap in replacement color matrices based on UniqueCameraModel tag, while still taking advantage of any per-individual camera calibration performed by the camera manufacturer.",
        "fullname": "Exif.Image.CameraCalibration1",
        "name": "CameraCalibration1",
        "type": 10
    },
    0xc624: {
        "chr": "l",
        "desc": "CameraCalibration2 defines a calibration matrix that transforms reference camera native space values to individual camera native space values under the second calibration illuminant. The matrix is stored in row scan order. This matrix is stored separately from the matrix specified by the ColorMatrix2 tag to allow raw converters to swap in replacement color matrices based on UniqueCameraModel tag, while still taking advantage of any per-individual camera calibration performed by the camera manufacturer.",
        "fullname": "Exif.Image.CameraCalibration2",
        "name": "CameraCalibration2",
        "type": 10
    },
    0xc625: {
        "chr": "l",
        "desc": "ReductionMatrix1 defines a dimensionality reduction matrix for use as the first stage in converting color camera native space values to XYZ values, under the first calibration illuminant. This tag may only be used if ColorPlanes is greater than 3. The matrix is stored in row scan order.",
        "fullname": "Exif.Image.ReductionMatrix1",
        "name": "ReductionMatrix1",
        "type": 10
    },
    0xc626: {
        "chr": "l",
        "desc": "ReductionMatrix2 defines a dimensionality reduction matrix for use as the first stage in converting color camera native space values to XYZ values, under the second calibration illuminant. This tag may only be used if ColorPlanes is greater than 3. The matrix is stored in row scan order.",
        "fullname": "Exif.Image.ReductionMatrix2",
        "name": "ReductionMatrix2",
        "type": 10
    },
    0xc627: {
        "chr": "I",
        "desc": "Normally the stored raw values are not white balanced, since any digital white balancing will reduce the dynamic range of the final image if the user decides to later adjust the white balance; however, if camera hardware is capable of white balancing the color channels before the signal is digitized, it can improve the dynamic range of the final image. AnalogBalance defines the gain, either analog (recommended) or digital (not recommended) that has been applied the stored raw values.",
        "fullname": "Exif.Image.AnalogBalance",
        "name": "AnalogBalance",
        "type": 5
    },
    0xc628: {
        "chr": "H",
        "desc": "Specifies the selected white balance at time of capture, encoded as the coordinates of a perfectly neutral color in linear reference space values. The inclusion of this tag precludes the inclusion of the AsShotWhiteXY tag.",
        "fullname": "Exif.Image.AsShotNeutral",
        "name": "AsShotNeutral",
        "type": 3
    },
    0xc629: {
        "chr": "I",
        "desc": "Specifies the selected white balance at time of capture, encoded as x-y chromaticity coordinates. The inclusion of this tag precludes the inclusion of the AsShotNeutral tag.",
        "fullname": "Exif.Image.AsShotWhiteXY",
        "name": "AsShotWhiteXY",
        "type": 5
    },
    0xc62a: {
        "chr": "l",
        "desc": "Camera models vary in the trade-off they make between highlight headroom and shadow noise. Some leave a significant amount of highlight headroom during a normal exposure. This allows significant negative exposure compensation to be applied during raw conversion, but also means normal exposures will contain more shadow noise. Other models leave less headroom during normal exposures. This allows for less negative exposure compensation, but results in lower shadow noise for normal exposures. Because of these differences, a raw converter needs to vary the zero point of its exposure compensation control from model to model. BaselineExposure specifies by how much (in EV units) to move the zero point. Positive values result in brighter default results, while negative values result in darker default results.",
        "fullname": "Exif.Image.BaselineExposure",
        "name": "BaselineExposure",
        "type": 10
    },
    0xc62b: {
        "chr": "I",
        "desc": "Specifies the relative noise level of the camera model at a baseline ISO value of 100, compared to a reference camera model. Since noise levels tend to vary approximately with the square root of the ISO value, a raw converter can use this value, combined with the current ISO, to estimate the relative noise level of the current image.",
        "fullname": "Exif.Image.BaselineNoise",
        "name": "BaselineNoise",
        "type": 5
    },
    0xc62c: {
        "chr": "I",
        "desc": "Specifies the relative amount of sharpening required for this camera model, compared to a reference camera model. Camera models vary in the strengths of their anti-aliasing filters. Cameras with weak or no filters require less sharpening than cameras with strong anti-aliasing filters.",
        "fullname": "Exif.Image.BaselineSharpness",
        "name": "BaselineSharpness",
        "type": 5
    },
    0xc62d: {
        "chr": "I",
        "desc": "Only applies to CFA images using a Bayer pattern filter array. This tag specifies, in arbitrary units, how closely the values of the green pixels in the blue/green rows track the values of the green pixels in the red/green rows. A value of zero means the two kinds of green pixels track closely, while a non-zero value means they sometimes diverge. The useful range for this tag is from 0 (no divergence) to about 5000 (quite large divergence).",
        "fullname": "Exif.Image.BayerGreenSplit",
        "name": "BayerGreenSplit",
        "type": 4
    },
    0xc62e: {
        "chr": "I",
        "desc": "Some sensors have an unpredictable non-linearity in their response as they near the upper limit of their encoding range. This non-linearity results in color shifts in the highlight areas of the resulting image unless the raw converter compensates for this effect. LinearResponseLimit specifies the fraction of the encoding range above which the response may become significantly non-linear.",
        "fullname": "Exif.Image.LinearResponseLimit",
        "name": "LinearResponseLimit",
        "type": 5
    },
    0xc62f: {
        "chr": "B",
        "desc": "CameraSerialNumber contains the serial number of the camera or camera body that captured the image.",
        "fullname": "Exif.Image.CameraSerialNumber",
        "name": "CameraSerialNumber",
        "type": 2
    },
    0xc630: {
        "chr": "I",
        "desc": "Contains information about the lens that captured the image. If the minimum f-stops are unknown, they should be encoded as 0/0.",
        "fullname": "Exif.Image.LensInfo",
        "name": "LensInfo",
        "type": 5
    },
    0xc631: {
        "chr": "I",
        "desc": "ChromaBlurRadius provides a hint to the DNG reader about how much chroma blur should be applied to the image. If this tag is omitted, the reader will use its default amount of chroma blurring. Normally this tag is only included for non-CFA images, since the amount of chroma blur required for mosaic images is highly dependent on the de-mosaic algorithm, in which case the DNG reader's default value is likely optimized for its particular de-mosaic algorithm.",
        "fullname": "Exif.Image.ChromaBlurRadius",
        "name": "ChromaBlurRadius",
        "type": 5
    },
    0xc632: {
        "chr": "I",
        "desc": "Provides a hint to the DNG reader about how strong the camera's anti-alias filter is. A value of 0.0 means no anti-alias filter (i.e., the camera is prone to aliasing artifacts with some subjects), while a value of 1.0 means a strong anti-alias filter (i.e., the camera almost never has aliasing artifacts).",
        "fullname": "Exif.Image.AntiAliasStrength",
        "name": "AntiAliasStrength",
        "type": 5
    },
    0xc633: {
        "chr": "l",
        "desc": "This tag is used by Adobe Camera Raw to control the sensitivity of its 'Shadows' slider.",
        "fullname": "Exif.Image.ShadowScale",
        "name": "ShadowScale",
        "type": 10
    },
    0xc634: {
        "chr": "B",
        "desc": "Provides a way for camera manufacturers to store private data in the DNG file for use by their own raw converters, and to have that data preserved by programs that edit DNG files.",
        "fullname": "Exif.Image.DNGPrivateData",
        "name": "DNGPrivateData",
        "type": 1
    },
    0xc635: {
        "chr": "H",
        "desc": "MakerNoteSafety lets the DNG reader know whether the EXIF MakerNote tag is safe to preserve along with the rest of the EXIF data. File browsers and other image management software processing an image with a preserved MakerNote should be aware that any thumbnail image embedded in the MakerNote may be stale, and may not reflect the current state of the full size image.",
        "fullname": "Exif.Image.MakerNoteSafety",
        "name": "MakerNoteSafety",
        "stringvalues": {
            "0": "Unsafe",
            "1": "Safe"
        },
        "type": 3
    },
    0xc65a: {
        "chr": "H",
        "desc": "The illuminant used for the first set of color calibration tags (ColorMatrix1, CameraCalibration1, ReductionMatrix1). The legal values for this tag are the same as the legal values for the LightSource EXIF tag.",
        "fullname": "Exif.Image.CalibrationIlluminant1",
        "name": "CalibrationIlluminant1",
        "type": 3
    },
    0xc65b: {
        "chr": "H",
        "desc": "The illuminant used for an optional second set of color calibration tags (ColorMatrix2, CameraCalibration2, ReductionMatrix2). The legal values for this tag are the same as the legal values for the CalibrationIlluminant1 tag; however, if both are included, neither is allowed to have a value of 0 (unknown).",
        "fullname": "Exif.Image.CalibrationIlluminant2",
        "name": "CalibrationIlluminant2",
        "type": 3
    },
    0xc65c: {
        "chr": "I",
        "desc": "For some cameras, the best possible image quality is not achieved by preserving the total pixel count during conversion. For example, Fujifilm SuperCCD images have maximum detail when their total pixel count is doubled. This tag specifies the amount by which the values of the DefaultScale tag need to be multiplied to achieve the best quality image size.",
        "fullname": "Exif.Image.BestQualityScale",
        "name": "BestQualityScale",
        "type": 5
    },
    0xc65d: {
        "chr": "B",
        "desc": "This tag contains a 16-byte unique identifier for the raw image data in the DNG file. DNG readers can use this tag to recognize a particular raw image, even if the file's name or the metadata contained in the file has been changed. If a DNG writer creates such an identifier, it should do so using an algorithm that will ensure that it is very unlikely two different images will end up having the same identifier.",
        "fullname": "Exif.Image.RawDataUniqueID",
        "name": "RawDataUniqueID",
        "type": 1
    },
    0xc68b: {
        "chr": "B",
        "desc": "If the DNG file was converted from a non-DNG raw file, then this tag contains the file name of that original raw file.",
        "fullname": "Exif.Image.OriginalRawFileName",
        "name": "OriginalRawFileName",
        "type": 1
    },
    0xc68c: {
        "chr": "B",
        "desc": "If the DNG file was converted from a non-DNG raw file, then this tag contains the compressed contents of that original raw file. The contents of this tag always use the big-endian byte order. The tag contains a sequence of data blocks. Future versions of the DNG specification may define additional data blocks, so DNG readers should ignore extra bytes when parsing this tag. DNG readers should also detect the case where data blocks are missing from the end of the sequence, and should assume a default value for all the missing blocks. There are no padding or alignment bytes between data blocks.",
        "fullname": "Exif.Image.OriginalRawFileData",
        "name": "OriginalRawFileData",
        "type": 7
    },
    0xc68d: {
        "chr": "H",
        "desc": "This rectangle defines the active (non-masked) pixels of the sensor. The order of the rectangle coordinates is: top, left, bottom, right.",
        "fullname": "Exif.Image.ActiveArea",
        "name": "ActiveArea",
        "type": 3
    },
    0xc68e: {
        "chr": "H",
        "desc": "This tag contains a list of non-overlapping rectangle coordinates of fully masked pixels, which can be optionally used by DNG readers to measure the black encoding level. The order of each rectangle's coordinates is: top, left, bottom, right. If the raw image data has already had its black encoding level subtracted, then this tag should not be used, since the masked pixels are no longer useful.",
        "fullname": "Exif.Image.MaskedAreas",
        "name": "MaskedAreas",
        "type": 3
    },
    0xc68f: {
        "chr": "B",
        "desc": "This tag contains an ICC profile that, in conjunction with the AsShotPreProfileMatrix tag, provides the camera manufacturer with a way to specify a default color rendering from camera color space coordinates (linear reference values) into the ICC profile connection space. The ICC profile connection space is an output referred colorimetric space, whereas the other color calibration tags in DNG specify a conversion into a scene referred colorimetric space. This means that the rendering in this profile should include any desired tone and gamut mapping needed to convert between scene referred values and output referred values.",
        "fullname": "Exif.Image.AsShotICCProfile",
        "name": "AsShotICCProfile",
        "type": 7
    },
    0xc690: {
        "chr": "l",
        "desc": "This tag is used in conjunction with the AsShotICCProfile tag. It specifies a matrix that should be applied to the camera color space coordinates before processing the values through the ICC profile specified in the AsShotICCProfile tag. The matrix is stored in the row scan order. If ColorPlanes is greater than three, then this matrix can (but is not required to) reduce the dimensionality of the color data down to three components, in which case the AsShotICCProfile should have three rather than ColorPlanes input components.",
        "fullname": "Exif.Image.AsShotPreProfileMatrix",
        "name": "AsShotPreProfileMatrix",
        "type": 10
    },
    0xc691: {
        "chr": "B",
        "desc": "This tag is used in conjunction with the CurrentPreProfileMatrix tag. The CurrentICCProfile and CurrentPreProfileMatrix tags have the same purpose and usage as the AsShotICCProfile and AsShotPreProfileMatrix tag pair, except they are for use by raw file editors rather than camera manufacturers.",
        "fullname": "Exif.Image.CurrentICCProfile",
        "name": "CurrentICCProfile",
        "type": 7
    },
    0xc692: {
        "chr": "l",
        "desc": "This tag is used in conjunction with the CurrentICCProfile tag. The CurrentICCProfile and CurrentPreProfileMatrix tags have the same purpose and usage as the AsShotICCProfile and AsShotPreProfileMatrix tag pair, except they are for use by raw file editors rather than camera manufacturers.",
        "fullname": "Exif.Image.CurrentPreProfileMatrix",
        "name": "CurrentPreProfileMatrix",
        "type": 10
    },
    0xc6bf: {
        "chr": "H",
        "desc": "The DNG color model documents a transform between camera colors and CIE XYZ values. This tag describes the colorimetric reference for the CIE XYZ values. 0 = The XYZ values are scene-referred. 1 = The XYZ values are output-referred, using the ICC profile perceptual dynamic range. This tag allows output-referred data to be stored in DNG files and still processed correctly by DNG readers.",
        "fullname": "Exif.Image.ColorimetricReference",
        "name": "ColorimetricReference",
        "type": 3
    },
    0xc6f3: {
        "chr": "B",
        "desc": "A UTF-8 encoded string associated with the CameraCalibration1 and CameraCalibration2 tags. The CameraCalibration1 and CameraCalibration2 tags should only be used in the DNG color transform if the string stored in the CameraCalibrationSignature tag exactly matches the string stored in the ProfileCalibrationSignature tag for the selected camera profile.",
        "fullname": "Exif.Image.CameraCalibrationSignature",
        "name": "CameraCalibrationSignature",
        "type": 1
    },
    0xc6f4: {
        "chr": "B",
        "desc": "A UTF-8 encoded string associated with the camera profile tags. The CameraCalibration1 and CameraCalibration2 tags should only be used in the DNG color transfer if the string stored in the CameraCalibrationSignature tag exactly matches the string stored in the ProfileCalibrationSignature tag for the selected camera profile.",
        "fullname": "Exif.Image.ProfileCalibrationSignature",
        "name": "ProfileCalibrationSignature",
        "type": 1
    },
    0xc6f6: {
        "chr": "B",
        "desc": "A UTF-8 encoded string containing the name of the \"as shot\" camera profile, if any.",
        "fullname": "Exif.Image.AsShotProfileName",
        "name": "AsShotProfileName",
        "type": 1
    },
    0xc6f7: {
        "chr": "I",
        "desc": "This tag indicates how much noise reduction has been applied to the raw data on a scale of 0.0 to 1.0. A 0.0 value indicates that no noise reduction has been applied. A 1.0 value indicates that the \"ideal\" amount of noise reduction has been applied, i.e. that the DNG reader should not apply additional noise reduction by default. A value of 0/0 indicates that this parameter is unknown.",
        "fullname": "Exif.Image.NoiseReductionApplied",
        "name": "NoiseReductionApplied",
        "type": 5
    },
    0xc6f8: {
        "chr": "B",
        "desc": "A UTF-8 encoded string containing the name of the camera profile. This tag is optional if there is only a single camera profile stored in the file but is required for all camera profiles if there is more than one camera profile stored in the file.",
        "fullname": "Exif.Image.ProfileName",
        "name": "ProfileName",
        "type": 1
    },
    0xc6f9: {
        "chr": "I",
        "desc": "This tag specifies the number of input samples in each dimension of the hue/saturation/value mapping tables. The data for these tables are stored in ProfileHueSatMapData1 and ProfileHueSatMapData2 tags. The most common case has ValueDivisions equal to 1, so only hue and saturation are used as inputs to the mapping table.",
        "fullname": "Exif.Image.ProfileHueSatMapDims",
        "name": "ProfileHueSatMapDims",
        "type": 4
    },
    0xc6fa: {
        "chr": "f",
        "desc": "This tag contains the data for the first hue/saturation/value mapping table. Each entry of the table contains three 32-bit IEEE floating-point values. The first entry is hue shift in degrees; the second entry is saturation scale factor; and the third entry is a value scale factor. The table entries are stored in the tag in nested loop order, with the value divisions in the outer loop, the hue divisions in the middle loop, and the saturation divisions in the inner loop. All zero input saturation entries are required to have a value scale factor of 1.0.",
        "fullname": "Exif.Image.ProfileHueSatMapData1",
        "name": "ProfileHueSatMapData1",
        "type": 11
    },
    0xc6fb: {
        "chr": "f",
        "desc": "This tag contains the data for the second hue/saturation/value mapping table. Each entry of the table contains three 32-bit IEEE floating-point values. The first entry is hue shift in degrees; the second entry is a saturation scale factor; and the third entry is a value scale factor. The table entries are stored in the tag in nested loop order, with the value divisions in the outer loop, the hue divisions in the middle loop, and the saturation divisions in the inner loop. All zero input saturation entries are required to have a value scale factor of 1.0.",
        "fullname": "Exif.Image.ProfileHueSatMapData2",
        "name": "ProfileHueSatMapData2",
        "type": 11
    },
    0xc6fc: {
        "chr": "f",
        "desc": "This tag contains a default tone curve that can be applied while processing the image as a starting point for user adjustments. The curve is specified as a list of 32-bit IEEE floating-point value pairs in linear gamma. Each sample has an input value in the range of 0.0 to 1.0, and an output value in the range of 0.0 to 1.0. The first sample is required to be (0.0, 0.0), and the last sample is required to be (1.0, 1.0). Interpolated the curve using a cubic spline.",
        "fullname": "Exif.Image.ProfileToneCurve",
        "name": "ProfileToneCurve",
        "type": 11
    },
    0xc6fd: {
        "chr": "I",
        "desc": "This tag contains information about the usage rules for the associated camera profile.",
        "fullname": "Exif.Image.ProfileEmbedPolicy",
        "name": "ProfileEmbedPolicy",
        "stringvalues": {
            "0": "Allow Copying",
            "1": "Embed if Used",
            "2": "Never Embed",
            "3": "No Restrictions"
        },
        "type": 4
    },
    0xc6fe: {
        "chr": "B",
        "desc": "A UTF-8 encoded string containing the copyright information for the camera profile. This string always should be preserved along with the other camera profile tags.",
        "fullname": "Exif.Image.ProfileCopyright",
        "name": "ProfileCopyright",
        "type": 1
    },
    0xc714: {
        "chr": "l",
        "desc": "This tag defines a matrix that maps white balanced camera colors to XYZ D50 colors.",
        "fullname": "Exif.Image.ForwardMatrix1",
        "name": "ForwardMatrix1",
        "type": 10
    },
    0xc715: {
        "chr": "l",
        "desc": "This tag defines a matrix that maps white balanced camera colors to XYZ D50 colors.",
        "fullname": "Exif.Image.ForwardMatrix2",
        "name": "ForwardMatrix2",
        "type": 10
    },
    0xc716: {
        "chr": "B",
        "desc": "A UTF-8 encoded string containing the name of the application that created the preview stored in the IFD.",
        "fullname": "Exif.Image.PreviewApplicationName",
        "name": "PreviewApplicationName",
        "type": 1
    },
    0xc717: {
        "chr": "B",
        "desc": "A UTF-8 encoded string containing the version number of the application that created the preview stored in the IFD.",
        "fullname": "Exif.Image.PreviewApplicationVersion",
        "name": "PreviewApplicationVersion",
        "type": 1
    },
    0xc718: {
        "chr": "B",
        "desc": "A UTF-8 encoded string containing the name of the conversion settings (for example, snapshot name) used for the preview stored in the IFD.",
        "fullname": "Exif.Image.PreviewSettingsName",
        "name": "PreviewSettingsName",
        "type": 1
    },
    0xc719: {
        "chr": "B",
        "desc": "A unique ID of the conversion settings (for example, MD5 digest) used to render the preview stored in the IFD.",
        "fullname": "Exif.Image.PreviewSettingsDigest",
        "name": "PreviewSettingsDigest",
        "type": 1
    },
    0xc71a: {
        "chr": "I",
        "desc": "This tag specifies the color space in which the rendered preview in this IFD is stored. The default value for this tag is sRGB for color previews and Gray Gamma 2.2 for monochrome previews.",
        "fullname": "Exif.Image.PreviewColorSpace",
        "name": "PreviewColorSpace",
        "stringvalues": {
            "0": "Unknown",
            "1": "Gray Gamma 2.2",
            "2": "sRGB",
            "3": "Adobe RGB",
            "4": "ProPhoto RGB"
        },
        "type": 4
    },
    0xc71b: {
        "chr": "B",
        "desc": "This tag is an ASCII string containing the name of the date/time at which the preview stored in the IFD was rendered. The date/time is encoded using ISO 8601 format.",
        "fullname": "Exif.Image.PreviewDateTime",
        "name": "PreviewDateTime",
        "type": 2
    },
    0xc71c: {
        "chr": "B",
        "desc": "This tag is an MD5 digest of the raw image data. All pixels in the image are processed in row-scan order. Each pixel is zero padded to 16 or 32 bits deep (16-bit for data less than or equal to 16 bits deep, 32-bit otherwise). The data for each pixel is processed in little-endian byte order.",
        "fullname": "Exif.Image.RawImageDigest",
        "name": "RawImageDigest",
        "type": 7
    },
    0xc71d: {
        "chr": "B",
        "desc": "This tag is an MD5 digest of the data stored in the OriginalRawFileData tag.",
        "fullname": "Exif.Image.OriginalRawFileDigest",
        "name": "OriginalRawFileDigest",
        "type": 7
    },
    0xc71e: {
        "chr": "I",
        "desc": "Normally, the pixels within a tile are stored in simple row-scan order. This tag specifies that the pixels within a tile should be grouped first into rectangular blocks of the specified size. These blocks are stored in row-scan order. Within each block, the pixels are stored in row-scan order. The use of a non-default value for this tag requires setting the DNGBackwardVersion tag to at least 1.2.0.0.",
        "fullname": "Exif.Image.SubTileBlockSize",
        "name": "SubTileBlockSize",
        "type": 4
    },
    0xc71f: {
        "chr": "I",
        "desc": "This tag specifies that rows of the image are stored in interleaved order. The value of the tag specifies the number of interleaved fields. The use of a non-default value for this tag requires setting the DNGBackwardVersion tag to at least 1.2.0.0.",
        "fullname": "Exif.Image.RowInterleaveFactor",
        "name": "RowInterleaveFactor",
        "type": 4
    },
    0xc725: {
        "chr": "I",
        "desc": "This tag specifies the number of input samples in each dimension of a default \"look\" table. The data for this table is stored in the ProfileLookTableData tag.",
        "fullname": "Exif.Image.ProfileLookTableDims",
        "name": "ProfileLookTableDims",
        "type": 4
    },
    0xc726: {
        "chr": "f",
        "desc": "This tag contains a default \"look\" table that can be applied while processing the image as a starting point for user adjustment. This table uses the same format as the tables stored in the ProfileHueSatMapData1 and ProfileHueSatMapData2 tags, and is applied in the same color space. However, it should be applied later in the processing pipe, after any exposure compensation and/or fill light stages, but before any tone curve stage. Each entry of the table contains three 32-bit IEEE floating-point values. The first entry is hue shift in degrees, the second entry is a saturation scale factor, and the third entry is a value scale factor. The table entries are stored in the tag in nested loop order, with the value divisions in the outer loop, the hue divisions in the middle loop, and the saturation divisions in the inner loop. All zero input saturation entries are required to have a value scale factor of 1.0.",
        "fullname": "Exif.Image.ProfileLookTableData",
        "name": "ProfileLookTableData",
        "type": 11
    },
    0xc740: {
        "chr": "B",
        "desc": "Specifies the list of opcodes that should be applied to the raw image, as read directly from the file.",
        "fullname": "Exif.Image.OpcodeList1",
        "name": "OpcodeList1",
        "type": 7
    },
    0xc741: {
        "chr": "B",
        "desc": "Specifies the list of opcodes that should be applied to the raw image, just after it has been mapped to linear reference values.",
        "fullname": "Exif.Image.OpcodeList2",
        "name": "OpcodeList2",
        "type": 7
    },
    0xc74e: {
        "chr": "B",
        "desc": "Specifies the list of opcodes that should be applied to the raw image, just after it has been demosaiced.",
        "fullname": "Exif.Image.OpcodeList3",
        "name": "OpcodeList3",
        "type": 7
    },
    0xc761: {
        "chr": "d",
        "desc": "NoiseProfile describes the amount of noise in a raw image. Specifically, this tag models the amount of signal-dependent photon (shot) noise and signal-independent sensor readout noise, two common sources of noise in raw images. The model assumes that the noise is white and spatially independent, ignoring fixed pattern effects and other sources of noise (e.g., pixel response non-uniformity, spatially-dependent thermal effects, etc.).",
        "fullname": "Exif.Image.NoiseProfile",
        "name": "NoiseProfile",
        "type": 12
    }
};






























var TIFF_PHOTO_TAGS = {
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
};


















var TIFF_GPS_TAGS = {
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
};











var TIFF_IOP_TAGS = {
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
};






