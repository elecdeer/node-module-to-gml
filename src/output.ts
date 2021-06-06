import {GraphEdge, GraphNode} from "../src/types";
import {promises as fs} from "fs";


export const toGml = (nodes: GraphNode[], edges: GraphEdge[]) => {
	return `graph [
  directed 1
    ${nodes.map(node => `
      node [
        id ${node.id}
        label "${node.label}"
      ]`).join("")}
    
    ${edges.map(edge => `
      edge [
        source ${edge.source}
        target ${edge.target}
      ]`).join("")}
  ]
  `
}


export const writeToFile = async (gmlString: string, path: string) => {
	await fs.writeFile(path, gmlString)
		.then(() => {
			console.log("complete");
		})
		.catch((err) => {
			console.error(err);
		})
}