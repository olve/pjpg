//JPEG MARKERS

export default {
      // Microsoft patented padding (http://www.freepatentsonline.com/7421451.html)
      0xEA1C: "MicrosoftPadding",

      // Start of Frame markers, non-differential, Huffman coding
      0xFFC0: "HuffBaselineDCT",
      0xFFC1: "HuffExtSequentialDCT",
      0xFFC2: "HuffProgressiveDCT",
      0xFFC3: "HuffLosslessSeq",

      // Start of Frame markers, differential, Huffman coding
      0xFFC5: "HuffDiffSequentialDCT",
      0xFFC6: "HuffDiffProgressiveDCT",
      0xFFC7: "HuffDiffLosslessSeq",

      // Start of Frame markers, non-differential, arithmetic coding
      0xFFC8: "ArthBaselineDCT",
      0xFFC9: "ArthExtSequentialDCT",
      0xFFCA: "ArthProgressiveDCT",
      0xFFCB: "ArthLosslessSeq",

      // Start of Frame markers, differential, arithmetic coding
      0xFFCD: "ArthDiffSequentialDCT",
      0xFFCE: "ArthDiffProgressiveDCT",
      0xFFCF: "ArthDiffLosslessSeq",

      // Huffman table spec
      0xFFC4: "HuffmanTableDef",

      // Arithmetic table spec
      0xFFCC: "ArithmeticTableDef",

      // Restart Interval termination
      0xFFD0: "RestartIntervalStart",
      0xFFD7: "RestartIntervalEnd",

      // Other markers
      0xFFD8: "StartOfImage",
      0xFFD9: "EndOfImage",
      0xFFDA: "StartOfScan",
      0xFFDB: "QuantTableDef",
      0xFFDC: "NumberOfLinesDef",
      0xFFDD: "RestartIntervalDef",
      0xFFDE: "HierarchProgressionDef",
      0xFFDF: "ExpandRefComponents",

      // App segments
      0xFFE0: "App0",
      0xFFE1: "App1",
      0xFFE2: "App2",
      0xFFE3: "App3",
      0xFFE4: "App4",
      0xFFE5: "App5",
      0xFFE6: "App6",
      0xFFE7: "App7",
      0xFFE8: "App8",
      0xFFE9: "App9",
      0xFFEA: "App10",
      0xFFEB: "App11",
      0xFFEC: "App12",
      0xFFED: "App13",
      0xFFEE: "App14",
      0xFFEF: "App15",

      // Jpeg Extensions
      0xFFF0: "JpegExt0",
      0xFFF1: "JpegExt1",
      0xFFF2: "JpegExt2",
      0xFFF3: "JpegExt3",
      0xFFF4: "JpegExt4",
      0xFFF5: "JpegExt5",
      0xFFF6: "JpegExt6",
      0xFFF7: "JpegExt7",
      0xFFF8: "JpegExt8",
      0xFFF9: "JpegExt9",
      0xFFFA: "JpegExtA",
      0xFFFB: "JpegExtB",
      0xFFFC: "JpegExtC",
      0xFFFD: "JpegExtD",

      // Comments
      0xFFFE: "Comment",

      // Reserved
      0xFF01: "ArithTemp",
      0xFF02: "ReservedStart",
      0xFFB: "ReservedEnd",
}
