import { type StringTypeMapping } from "../TypeBuilder";
import { type TypeGraph } from "../TypeGraph";
export declare function inferMaps(graph: TypeGraph, stringTypeMapping: StringTypeMapping, conflateNumbers: boolean, debugPrintReconstitution: boolean): TypeGraph;
