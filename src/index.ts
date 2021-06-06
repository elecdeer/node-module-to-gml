import {getFilesPathRecursive} from "../src/input";
import {acquireModuleDeps, resolveRequire} from "../src/moduleDeps";
import {formGraph} from "../src/format";
import {toGml, writeToFile} from "../src/output";
import path from "path";


(async () => {
	const basePath = "./discord.js-master/src";

	const filesPath = await getFilesPathRecursive(basePath);

	const {node, edge} = await formGraph(basePath, filesPath);

	console.log(node);
	console.log(edge);

	const gmlText = await toGml(node, edge);

	await writeToFile(gmlText, "dist.gml");



})();