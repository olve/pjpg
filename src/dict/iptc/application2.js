//IPTC APPLICATION2 TAGS
export default {
    0x0000: {
        "desc": "A binary number identifying the version of the Information Interchange Model",
        "fullname": "Iptc.Application2.RecordVersion",
        "max": 2,
        "min": 2,
        "name": "RecordVersion",
        "repeatable": false,
        "type": "Short"
    },
    0x0003: {
        "desc": "The Object Type is used to distinguish between different types of objects within the IIM. The first part is a number representing a language independent international reference to an Object Type followed by a colon separator. The second part",
        "fullname": "Iptc.Application2.ObjectType",
        "max": 67,
        "min": 3,
        "name": "ObjectType",
        "repeatable": false,
        "type": "String"
    },
    0x0004: {
        "desc": "The Object Attribute defines the nature of the object independent of the Subject. The first part is a number representing a language independent international reference to an Object Attribute followed by a colon separator. The second part",
        "fullname": "Iptc.Application2.ObjectAttribute",
        "max": 68,
        "min": 4,
        "name": "ObjectAttribute",
        "repeatable": true,
        "type": "String"
    },
    0x0005: {
        "desc": "Used as a shorthand reference for the object. Changes to exist-ing data",
        "fullname": "Iptc.Application2.ObjectName",
        "max": 64,
        "min": 0,
        "name": "ObjectName",
        "repeatable": false,
        "type": "String"
    },
    0x0007: {
        "desc": "Status of the object data",
        "fullname": "Iptc.Application2.EditStatus",
        "max": 64,
        "min": 0,
        "name": "EditStatus",
        "repeatable": false,
        "type": "String"
    },
    0x0008: {
        "desc": "Indicates the type of update that this object provides to a previous object. The link to the previous object is made using the tags <ARMIdentifier> and <ARMVersion>",
        "fullname": "Iptc.Application2.EditorialUpdate",
        "max": 2,
        "min": 2,
        "name": "EditorialUpdate",
        "repeatable": false,
        "type": "String"
    },
    0x000a: {
        "desc": "Specifies the editorial urgency of content and not necessarily the envelope handling priority (see tag <EnvelopePriority>). The \"1\" is most urgent",
        "fullname": "Iptc.Application2.Urgency",
        "max": 1,
        "min": 1,
        "name": "Urgency",
        "repeatable": false,
        "type": "String"
    },
    0x000c: {
        "desc": "The Subject Reference is a structured definition of the subject matter.",
        "fullname": "Iptc.Application2.Subject",
        "max": 236,
        "min": 13,
        "name": "Subject",
        "repeatable": true,
        "type": "String"
    },
    0x000f: {
        "desc": "Identifies the subject of the object data in the opinion of the provider. A list of categories will be maintained by a regional registry",
        "fullname": "Iptc.Application2.Category",
        "max": 3,
        "min": 0,
        "name": "Category",
        "repeatable": false,
        "type": "String"
    },
    0x0014: {
        "desc": "Supplemental categories further refine the subject of an object data. A supplemental category may include any of the recognised categories as used in tag <Category>. Otherwise",
        "fullname": "Iptc.Application2.SuppCategory",
        "max": 32,
        "min": 0,
        "name": "SuppCategory",
        "repeatable": true,
        "type": "String"
    },
    0x0016: {
        "desc": "Identifies object data that recurs often and predictably. Enables users to immediately find or recall such an object.",
        "fullname": "Iptc.Application2.FixtureId",
        "max": 32,
        "min": 0,
        "name": "FixtureId",
        "repeatable": false,
        "type": "String"
    },
    0x0019: {
        "desc": "Used to indicate specific information retrieval words. It is expected that a provider of various types of data that are related in subject matter uses the same keyword",
        "fullname": "Iptc.Application2.Keywords",
        "max": 64,
        "min": 0,
        "name": "Keywords",
        "repeatable": true,
        "type": "String"
    },
    0x001a: {
        "desc": "Indicates the code of a country/geographical location referenced by the content of the object. Where ISO has established an appropriate country code under ISO 3166",
        "fullname": "Iptc.Application2.LocationCode",
        "max": 3,
        "min": 3,
        "name": "LocationCode",
        "repeatable": true,
        "type": "String"
    },
    0x001b: {
        "desc": "Provides a full",
        "fullname": "Iptc.Application2.LocationName",
        "max": 64,
        "min": 0,
        "name": "LocationName",
        "repeatable": true,
        "type": "String"
    },
    0x001e: {
        "desc": "Designates in the form CCYYMMDD the earliest date the provider intends the object to be used. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.ReleaseDate",
        "max": 8,
        "min": 8,
        "name": "ReleaseDate",
        "repeatable": false,
        "type": "Date"
    },
    0x0023: {
        "desc": "Designates in the form HHMMSS:HHMM the earliest time the provider intends the object to be used. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.ReleaseTime",
        "max": 11,
        "min": 11,
        "name": "ReleaseTime",
        "repeatable": false,
        "type": "Time"
    },
    0x0025: {
        "desc": "Designates in the form CCYYMMDD the latest date the provider or owner intends the object data to be used. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.ExpirationDate",
        "max": 8,
        "min": 8,
        "name": "ExpirationDate",
        "repeatable": false,
        "type": "Date"
    },
    0x0026: {
        "desc": "Designates in the form HHMMSS:HHMM the latest time the provider or owner intends the object data to be used. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.ExpirationTime",
        "max": 11,
        "min": 11,
        "name": "ExpirationTime",
        "repeatable": false,
        "type": "Time"
    },
    0x0028: {
        "desc": "Other editorial instructions concerning the use of the object data",
        "fullname": "Iptc.Application2.SpecialInstructions",
        "max": 256,
        "min": 0,
        "name": "SpecialInstructions",
        "repeatable": false,
        "type": "String"
    },
    0x002a: {
        "desc": "Indicates the type of action that this object provides to a previous object. The link to the previous object is made using tags <ARMIdentifier> and <ARMVersion>",
        "fullname": "Iptc.Application2.ActionAdvised",
        "max": 2,
        "min": 2,
        "name": "ActionAdvised",
        "repeatable": false,
        "type": "String"
    },
    0x002d: {
        "desc": "Identifies the Service Identifier of a prior envelope to which the current object refers.",
        "fullname": "Iptc.Application2.ReferenceService",
        "max": 10,
        "min": 0,
        "name": "ReferenceService",
        "repeatable": true,
        "type": "String"
    },
    0x002f: {
        "desc": "Identifies the date of a prior envelope to which the current object refers.",
        "fullname": "Iptc.Application2.ReferenceDate",
        "max": 8,
        "min": 8,
        "name": "ReferenceDate",
        "repeatable": true,
        "type": "Date"
    },
    0x0032: {
        "desc": "Identifies the Envelope Number of a prior envelope to which the current object refers.",
        "fullname": "Iptc.Application2.ReferenceNumber",
        "max": 8,
        "min": 8,
        "name": "ReferenceNumber",
        "repeatable": true,
        "type": "String"
    },
    0x0037: {
        "desc": "Represented in the form CCYYMMDD to designate the date the intellectual content of the object data was created rather than the date of the creation of the physical representation. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.DateCreated",
        "max": 8,
        "min": 8,
        "name": "DateCreated",
        "repeatable": false,
        "type": "Date"
    },
    0x003c: {
        "desc": "Represented in the form HHMMSS:HHMM to designate the time the intellectual content of the object data current source material was created rather than the creation of the physical representation. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.TimeCreated",
        "max": 11,
        "min": 11,
        "name": "TimeCreated",
        "repeatable": false,
        "type": "Time"
    },
    0x003e: {
        "desc": "Represented in the form CCYYMMDD to designate the date the digital representation of the object data was created. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.DigitizationDate",
        "max": 8,
        "min": 8,
        "name": "DigitizationDate",
        "repeatable": false,
        "type": "Date"
    },
    0x003f: {
        "desc": "Represented in the form HHMMSS:HHMM to designate the time the digital representation of the object data was created. Follows ISO 8601 standard.",
        "fullname": "Iptc.Application2.DigitizationTime",
        "max": 11,
        "min": 11,
        "name": "DigitizationTime",
        "repeatable": false,
        "type": "Time"
    },
    0x0041: {
        "desc": "Identifies the type of program used to originate the object data.",
        "fullname": "Iptc.Application2.Program",
        "max": 32,
        "min": 0,
        "name": "Program",
        "repeatable": false,
        "type": "String"
    },
    0x0046: {
        "desc": "Used to identify the version of the program mentioned in tag <Program>.",
        "fullname": "Iptc.Application2.ProgramVersion",
        "max": 10,
        "min": 0,
        "name": "ProgramVersion",
        "repeatable": false,
        "type": "String"
    },
    0x004b: {
        "desc": "Used to identify the editorial cycle of object data.",
        "fullname": "Iptc.Application2.ObjectCycle",
        "max": 1,
        "min": 1,
        "name": "ObjectCycle",
        "repeatable": false,
        "type": "String"
    },
    0x0050: {
        "desc": "Contains name of the creator of the object data",
        "fullname": "Iptc.Application2.Byline",
        "max": 32,
        "min": 0,
        "name": "Byline",
        "repeatable": true,
        "type": "String"
    },
    0x0055: {
        "desc": "A by-line title is the title of the creator or creators of an object data. Where used",
        "fullname": "Iptc.Application2.BylineTitle",
        "max": 32,
        "min": 0,
        "name": "BylineTitle",
        "repeatable": true,
        "type": "String"
    },
    0x005a: {
        "desc": "Identifies city of object data origin according to guidelines established by the provider.",
        "fullname": "Iptc.Application2.City",
        "max": 32,
        "min": 0,
        "name": "City",
        "repeatable": false,
        "type": "String"
    },
    0x005c: {
        "desc": "Identifies the location within a city from which the object data originates",
        "fullname": "Iptc.Application2.SubLocation",
        "max": 32,
        "min": 0,
        "name": "SubLocation",
        "repeatable": false,
        "type": "String"
    },
    0x005f: {
        "desc": "Identifies Province/State of origin according to guidelines established by the provider.",
        "fullname": "Iptc.Application2.ProvinceState",
        "max": 32,
        "min": 0,
        "name": "ProvinceState",
        "repeatable": false,
        "type": "String"
    },
    0x0064: {
        "desc": "Indicates the code of the country/primary location where the intellectual property of the object data was created",
        "fullname": "Iptc.Application2.CountryCode",
        "max": 3,
        "min": 3,
        "name": "CountryCode",
        "repeatable": false,
        "type": "String"
    },
    0x0065: {
        "desc": "Provides full",
        "fullname": "Iptc.Application2.CountryName",
        "max": 64,
        "min": 0,
        "name": "CountryName",
        "repeatable": false,
        "type": "String"
    },
    0x0067: {
        "desc": "A code representing the location of original transmission according to practices of the provider.",
        "fullname": "Iptc.Application2.TransmissionReference",
        "max": 32,
        "min": 0,
        "name": "TransmissionReference",
        "repeatable": false,
        "type": "String"
    },
    0x0069: {
        "desc": "A publishable entry providing a synopsis of the contents of the object data.",
        "fullname": "Iptc.Application2.Headline",
        "max": 256,
        "min": 0,
        "name": "Headline",
        "repeatable": false,
        "type": "String"
    },
    0x006e: {
        "desc": "Identifies the provider of the object data",
        "fullname": "Iptc.Application2.Credit",
        "max": 32,
        "min": 0,
        "name": "Credit",
        "repeatable": false,
        "type": "String"
    },
    0x0073: {
        "desc": "Identifies the original owner of the intellectual content of the object data. This could be an agency",
        "fullname": "Iptc.Application2.Source",
        "max": 32,
        "min": 0,
        "name": "Source",
        "repeatable": false,
        "type": "String"
    },
    0x0074: {
        "desc": "Contains any necessary copyright notice.",
        "fullname": "Iptc.Application2.Copyright",
        "max": 128,
        "min": 0,
        "name": "Copyright",
        "repeatable": false,
        "type": "String"
    },
    0x0076: {
        "desc": "Identifies the person or organisation which can provide further background information on the object data.",
        "fullname": "Iptc.Application2.Contact",
        "max": 128,
        "min": 0,
        "name": "Contact",
        "repeatable": true,
        "type": "String"
    },
    0x0078: {
        "desc": "A textual description of the object data.",
        "fullname": "Iptc.Application2.Caption",
        "max": 2000,
        "min": 0,
        "name": "Caption",
        "repeatable": false,
        "type": "String"
    },
    0x007a: {
        "desc": "Identification of the name of the person involved in the writing",
        "fullname": "Iptc.Application2.Writer",
        "max": 32,
        "min": 0,
        "name": "Writer",
        "repeatable": true,
        "type": "String"
    },
    0x007d: {
        "desc": "Contains the rasterized object data description and is used where characters that have not been coded are required for the caption.",
        "fullname": "Iptc.Application2.RasterizedCaption",
        "max": 7360,
        "min": 7360,
        "name": "RasterizedCaption",
        "repeatable": false,
        "type": "Undefined"
    },
    0x0082: {
        "desc": "Indicates the color components of an image.",
        "fullname": "Iptc.Application2.ImageType",
        "max": 2,
        "min": 2,
        "name": "ImageType",
        "repeatable": false,
        "type": "String"
    },
    0x0083: {
        "desc": "Indicates the layout of an image.",
        "fullname": "Iptc.Application2.ImageOrientation",
        "max": 1,
        "min": 1,
        "name": "ImageOrientation",
        "repeatable": false,
        "type": "String"
    },
    0x0087: {
        "desc": "Describes the major national language of the object",
        "fullname": "Iptc.Application2.Language",
        "max": 3,
        "min": 2,
        "name": "Language",
        "repeatable": false,
        "type": "String"
    },
    0x0096: {
        "desc": "Indicates the type of an audio content.",
        "fullname": "Iptc.Application2.AudioType",
        "max": 2,
        "min": 2,
        "name": "AudioType",
        "repeatable": false,
        "type": "String"
    },
    0x0097: {
        "desc": "Indicates the sampling rate in Hertz of an audio content.",
        "fullname": "Iptc.Application2.AudioRate",
        "max": 6,
        "min": 6,
        "name": "AudioRate",
        "repeatable": false,
        "type": "String"
    },
    0x0098: {
        "desc": "Indicates the sampling resolution of an audio content.",
        "fullname": "Iptc.Application2.AudioResolution",
        "max": 2,
        "min": 2,
        "name": "AudioResolution",
        "repeatable": false,
        "type": "String"
    },
    0x0099: {
        "desc": "Indicates the duration of an audio content.",
        "fullname": "Iptc.Application2.AudioDuration",
        "max": 6,
        "min": 6,
        "name": "AudioDuration",
        "repeatable": false,
        "type": "String"
    },
    0x009a: {
        "desc": "Identifies the content of the end of an audio object data",
        "fullname": "Iptc.Application2.AudioOutcue",
        "max": 64,
        "min": 0,
        "name": "AudioOutcue",
        "repeatable": false,
        "type": "String"
    },
    0x00c8: {
        "desc": "A binary number representing the file format of the object data preview. The file format must be registered with IPTC or NAA organizations with a unique number assigned to it.",
        "fullname": "Iptc.Application2.PreviewFormat",
        "max": 2,
        "min": 2,
        "name": "PreviewFormat",
        "repeatable": false,
        "type": "Short"
    },
    0x00c9: {
        "desc": "A binary number representing the particular version of the object data preview file format specified in tag <PreviewFormat>.",
        "fullname": "Iptc.Application2.PreviewVersion",
        "max": 2,
        "min": 2,
        "name": "PreviewVersion",
        "repeatable": false,
        "type": "Short"
    },
    0x00ca: {
        "desc": "Binary image preview data.",
        "fullname": "Iptc.Application2.Preview",
        "max": 256000,
        "min": 0,
        "name": "Preview",
        "repeatable": false,
        "type": "Undefined"
    }
}
