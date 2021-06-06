
import fs from "fs";
import * as readline from "readline";
import path from "path";


const requireRegex = /(?<=require\(['"]).*(?=['"]\))/

export const acquireModuleDeps = (pathStr: string): Promise<string[]> => new Promise((resolve, reject) => {

	const depsPathList: string[] = [];

	const readStream = fs.createReadStream(pathStr);
	const readLineStream = readline.createInterface({
		input: readStream
	});

	readLineStream.on("line", lineString => {
		// console.log(`line: ${lineString}`)
		const regexTest = lineString.match(requireRegex);
		if(!regexTest) return;
		const importStr = regexTest[0];

		// console.log(`import: ${importStr}`)

		if(importStr.startsWith("../") || importStr.startsWith("./")){
			depsPathList.push(resolveRequire(importStr, pathStr));
		}else{
			depsPathList.push(`!dependencies/${importStr}`);
		}
	}).on("close", () => {
		resolve(depsPathList);
	})

	// const file = await fs.readFile(pathStr);
	//
	// console.log(file.toString());
});

export const resolveRequire = (importStr: string, filePath: string): string => {
	const dirName = path.dirname(filePath);
	const result = require.resolve(importStr, {
		paths: [dirName]
	});

	return result;
}