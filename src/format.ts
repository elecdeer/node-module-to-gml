import {GraphEdge, GraphNode} from "../src/types";
import {acquireModuleDeps} from "../src/moduleDeps";


export const formGraph = async (basePath: string, filesPath: string[]): Promise<{
	node: GraphNode[],
	edge: GraphEdge[]
}> => {

	const nodeMap: {[key: string]: GraphNode} = {};
	const edgeList: GraphEdge[] = [];
	let idCounter = 0;


	const getNode = (path: string) => {
		const key = path.replace(basePath, "").replace(".js", "");
		if(!nodeMap[key]){
			nodeMap[key] = {
				id: idCounter++,
				label: key,
				path: path
			}
		}
		return nodeMap[key];
	}

	const fileNodes = filesPath
		.map(path => getNode(path));

	await Promise.all(
		fileNodes.map(node => {
			return acquireModuleDeps(node.path).then(deps => {
				console.log(`${node.path}  deps  [${deps}]`);

				const childNodes = deps.map(value => {
					const childNode = getNode(value);
					return {
						source: node.id,
						target: childNode.id
					}
				})

				childNodes.forEach(node => {
					if(!edgeList.some(value => value.source === node.source && value.target === node.target)){
						edgeList.push(node);
					}
				})

			});
		})
	)


	//暗黙的に読み込まれている奴ら
	//は保留

	// fileNodes.forEach(node => {
	//
	// 	if(node.label.startsWith("/index")) return;
	//
	// 	const fileName = path.basename(node.label);
	// 	if(!fileName.startsWith("index")) return;
	// 	console.log(`tacit parent: ${}`)
	//
	// 	const dirName = path.dirname(node.label)
	//
	// 	const dirChildrenEdges: GraphEdge[] = fileNodes
	// 		.filter(item => item.path.startsWith(dirName))
	// 		.map(item => ({
	// 			source: node.id,
	// 			target: item.id
	// 		}));
	// 	edgeList.push(...dirChildrenEdges);
	// })


	return {
		node: Object.values(nodeMap),
		edge: edgeList
	}

}