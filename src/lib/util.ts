export const fixID = (document: any) => {
	document._id = document._id.toString();
	return document;
};
