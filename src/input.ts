import recursive from "recursive-readdir";

export const getFilesPathRecursive = async (path: string) => {

	const files = await recursive(path, [".DS_Store"]);

	console.log(files);
	return files;
}