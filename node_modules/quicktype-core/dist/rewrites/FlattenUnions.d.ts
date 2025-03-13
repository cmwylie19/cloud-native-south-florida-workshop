import { type StringTypeMapping } from "../TypeBuilder";
import { type TypeGraph } from "../TypeGraph";
export declare function flattenUnions(graph: TypeGraph, stringTypeMapping: StringTypeMapping, conflateNumbers: boolean, makeObjectTypes: boolean, debugPrintReconstitution: boolean): [TypeGraph, boolean];
