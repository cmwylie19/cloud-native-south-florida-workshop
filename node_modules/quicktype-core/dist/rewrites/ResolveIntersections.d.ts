import { type StringTypeMapping } from "../TypeBuilder";
import { type TypeGraph } from "../TypeGraph";
export declare function resolveIntersections(graph: TypeGraph, stringTypeMapping: StringTypeMapping, debugPrintReconstitution: boolean): [TypeGraph, boolean];
