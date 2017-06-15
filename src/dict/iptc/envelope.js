//IPTC ENVELOPE TAGS

module.exports = {
    0x0000: {
        "desc": "A binary number identifying the version of the Information Interchange Model",
        "fullname": "Iptc.Envelope.ModelVersion",
        "max": 2,
        "min": 2,
        "name": "ModelVersion",
        "repeatable": false,
        "type": "Short"
    },
    0x0005: {
        "desc": "This DataSet is to accommodate some providers who require routing information above the appropriate OSI layers.",
        "fullname": "Iptc.Envelope.Destination",
        "max": 1024,
        "min": 0,
        "name": "Destination",
        "repeatable": true,
        "type": "String"
    },
    0x0014: {
        "desc": "A binary number representing the file format. The file format must be registered with IPTC or NAA with a unique number assigned to it. The information is used to route the data to the appropriate system and to allow the receiving system to perform the appropriate actions there to.",
        "fullname": "Iptc.Envelope.FileFormat",
        "max": 2,
        "min": 2,
        "name": "FileFormat",
        "repeatable": false,
        "type": "Short"
    },
    0x0016: {
        "desc": "A binary number representing the particular version of the File Format specified by <FileFormat> tag.",
        "fullname": "Iptc.Envelope.FileVersion",
        "max": 2,
        "min": 2,
        "name": "FileVersion",
        "repeatable": false,
        "type": "Short"
    },
    0x001e: {
        "desc": "Identifies the provider and product",
        "fullname": "Iptc.Envelope.ServiceId",
        "max": 10,
        "min": 0,
        "name": "ServiceId",
        "repeatable": false,
        "type": "String"
    },
    0x0028: {
        "desc": "The characters form a number that will be unique for the date specified in <DateSent> tag and for the Service Identifier specified by <ServiceIdentifier> tag. If identical envelope numbers appear with the same date and with the same Service Identifier",
        "fullname": "Iptc.Envelope.EnvelopeNumber",
        "max": 8,
        "min": 8,
        "name": "EnvelopeNumber",
        "repeatable": false,
        "type": "String"
    },
    0x0032: {
        "desc": "Allows a provider to identify subsets of its overall service. Used to provide receiving organisation data on which to select",
        "fullname": "Iptc.Envelope.ProductId",
        "max": 32,
        "min": 0,
        "name": "ProductId",
        "repeatable": true,
        "type": "String"
    },
    0x003c: {
        "desc": "Specifies the envelope handling priority and not the editorial urgency (see <Urgency> tag). \"1\" indicates the most urgent",
        "fullname": "Iptc.Envelope.EnvelopePriority",
        "max": 1,
        "min": 1,
        "name": "EnvelopePriority",
        "repeatable": false,
        "type": "String"
    },
    0x0046: {
        "desc": "Uses the format CCYYMMDD (century",
        "fullname": "Iptc.Envelope.DateSent",
        "max": 8,
        "min": 8,
        "name": "DateSent",
        "repeatable": false,
        "type": "Date"
    },
    0x0050: {
        "desc": "Uses the format HHMMSS:HHMM where HHMMSS refers to local hour",
        "fullname": "Iptc.Envelope.TimeSent",
        "max": 11,
        "min": 11,
        "name": "TimeSent",
        "repeatable": false,
        "type": "Time"
    },
    0x005a: {
        "desc": "This tag consisting of one or more control functions used for the announcement",
        "fullname": "Iptc.Envelope.CharacterSet",
        "max": 32,
        "min": 0,
        "name": "CharacterSet",
        "repeatable": false,
        "type": "String"
    },
    0x0064: {
        "desc": "This tag provide a globally unique identification for objects as specified in the IIM",
        "fullname": "Iptc.Envelope.UNO",
        "max": 80,
        "min": 14,
        "name": "UNO",
        "repeatable": false,
        "type": "String"
    },
    0x0078: {
        "desc": "The DataSet identifies the Abstract Relationship Method identifier (ARM) which is described in a document registered by the originator of the ARM with the IPTC and NAA organizations.",
        "fullname": "Iptc.Envelope.ARMId",
        "max": 2,
        "min": 2,
        "name": "ARMId",
        "repeatable": false,
        "type": "Short"
    },
    0x007a: {
        "desc": "This tag consisting of a binary number representing the particular version of the ARM specified by tag <ARMId>.",
        "fullname": "Iptc.Envelope.ARMVersion",
        "max": 2,
        "min": 2,
        "name": "ARMVersion",
        "repeatable": false,
        "type": "Short"
    }
}
