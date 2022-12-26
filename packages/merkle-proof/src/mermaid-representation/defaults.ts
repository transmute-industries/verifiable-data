
import { AutographEdge } from "./types";

const linkStyle = (e: AutographEdge) => {
  return e.label ? `-- ${e.label} -->`: `-.->`;
}

export const defaults = {linkStyle}

