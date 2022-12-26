import base64url from "base64url";
export const makeMermaidSafe = (graph: any) => {
  graph.nodes.forEach((n: any) => {
    n.id = base64url.toBuffer(n.id).toString("hex");
  });
  graph.links.forEach((e: any) => {
    e.source = base64url.toBuffer(e.source).toString("hex");
    e.target = base64url.toBuffer(e.target).toString("hex");
  });
};
