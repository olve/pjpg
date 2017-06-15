import readTag from './readTag'

export default function readIFD(offset, tiff, view, littleEndian) {
	//read exif Image File Directory

	var offset = tiff + offset; //offsets and address references consider the beginning of the tiff-header position 0.
	var entries = view.getUint16(offset, littleEndian); //number of tag entries in the ifd

	var tags = {};
	var tagList = [];

	for (var i = 0; i < entries; i++) {

		var tagOffset = offset + 2 + i*12;
		var tagId = view.getUint16(tagOffset, littleEndian);
		var tag = readTag(tagId, tagOffset, tiff, view, littleEndian);
		if (tag !== null) {
			tags[tagId] = tag;
            tagList.push(tag);
		}
	}

	//after all the tag entries, the offset of the next linked IFD is stored as an unsigned long. if it is 0, there are no linked IFDs.
	var next = view.getUint32(offset + (entries*12) + 2, littleEndian);
	return {
		entries: entries,
		tags: tags,
		tagList: tagList,
		next: next,
	};
}
