import { InputData } from "./input/Inputs";
import { type SerializedRenderResult } from "./Source";
import { type Comment } from "./support/Comments";
import { type MultiFileRenderResult, type TargetLanguage } from "./TargetLanguage";
import { type TransformedStringTypeKind } from "./Type";
import { type StringTypeMapping } from "./TypeBuilder";
export declare function getTargetLanguage(nameOrInstance: string | TargetLanguage): TargetLanguage;
export interface RendererOptions {
    [name: string]: string | boolean;
}
export interface InferenceFlag {
    description: string;
    explanation: string;
    negationDescription: string;
    order: number;
    stringType?: TransformedStringTypeKind;
}
export declare const inferenceFlagsObject: {
    /** Whether to infer map types from JSON data */
    inferMaps: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
    /** Whether to infer enum types from JSON data */
    inferEnums: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
    /** Whether to convert UUID strings to UUID objects */
    inferUuids: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: "time" | "date" | "date-time" | "uuid" | "uri" | "integer-string" | "bool-string";
        order: number;
    };
    /** Whether to assume that JSON strings that look like dates are dates */
    inferDateTimes: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: "time" | "date" | "date-time" | "uuid" | "uri" | "integer-string" | "bool-string";
        order: number;
    };
    /** Whether to convert stringified integers to integers */
    inferIntegerStrings: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: "time" | "date" | "date-time" | "uuid" | "uri" | "integer-string" | "bool-string";
        order: number;
    };
    /** Whether to convert stringified booleans to boolean values */
    inferBooleanStrings: {
        description: string;
        negationDescription: string;
        explanation: string;
        stringType: "time" | "date" | "date-time" | "uuid" | "uri" | "integer-string" | "bool-string";
        order: number;
    };
    /** Combine similar classes.  This doesn't apply to classes from a schema, only from inference. */
    combineClasses: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
    /** Whether to treat $ref as references within JSON */
    ignoreJsonRefs: {
        description: string;
        negationDescription: string;
        explanation: string;
        order: number;
    };
};
export type InferenceFlagName = keyof typeof inferenceFlagsObject;
export declare const inferenceFlagNames: ("inferMaps" | "inferEnums" | "inferUuids" | "inferDateTimes" | "inferIntegerStrings" | "inferBooleanStrings" | "combineClasses" | "ignoreJsonRefs")[];
export declare const inferenceFlags: {
    [F in InferenceFlagName]: InferenceFlag;
};
export type InferenceFlags = {
    [F in InferenceFlagName]: boolean;
};
/**
 * The options type for the main quicktype entry points,
 * `quicktypeMultiFile` and `quicktype`.
 */
export interface NonInferenceOptions {
    /** Make all class property optional */
    allPropertiesOptional: boolean;
    /** Put class properties in alphabetical order, instead of in the order found in the JSON */
    alphabetizeProperties: boolean;
    /** Check that we're propagating all type attributes (unless we actually can't) */
    checkProvenance: boolean;
    /**
     * Print name gathering debug information to the console.  This might help to figure out why
     * your types get weird names, but the output is quite arcane.
     */
    debugPrintGatherNames: boolean;
    /** Print the type graph to the console at every processing step */
    debugPrintGraph: boolean;
    /**
     * Print type reconstitution debug information to the console.  You'll only ever need this if
     * you're working deep inside quicktype-core.
     */
    debugPrintReconstitution: boolean;
    /** Print schema resolving steps */
    debugPrintSchemaResolving: boolean;
    /** Print the time it took for each pass to run */
    debugPrintTimes: boolean;
    /** Print all transformations to the console prior to generating code */
    debugPrintTransformations: boolean;
    /**
     * Make top-levels classes from JSON fixed.  That means even if two top-level classes are exactly
     * the same, quicktype will still generate two separate types for them.
     */
    fixedTopLevels: boolean;
    /** String to use for one indentation level.  If not given, use the target language's default. */
    indentation: string | undefined;
    /** The input data from which to produce types */
    inputData: InputData;
    /**
     * The target language for which to produce code.  This can be either an instance of `TargetLanguage`,
     * or a string specifying one of the names for quicktype's built-in target languages.  For example,
     * both `cs` and `csharp` will generate C#.
     */
    lang: string | TargetLanguage;
    /** If given, output these comments at the beginning of the main output file */
    leadingComments?: Comment[];
    /** Don't render output.  This is mainly useful for benchmarking. */
    noRender: boolean;
    /** Name of the output file.  Note that quicktype will not write that file, but you'll get its name
     * back as a key in the resulting `Map`.
     */
    outputFilename: string;
    /** Options for the target language's renderer */
    rendererOptions: RendererOptions;
}
export type Options = NonInferenceOptions & InferenceFlags;
export interface RunContext {
    debugPrintReconstitution: boolean;
    debugPrintSchemaResolving: boolean;
    debugPrintTransformations: boolean;
    stringTypeMapping: StringTypeMapping;
    time: <T>(name: string, f: () => T) => T;
    timeSync: <T>(name: string, f: () => Promise<T>) => Promise<T>;
}
export declare const defaultInferenceFlags: InferenceFlags;
/**
 * Run quicktype and produce one or more output files.
 *
 * @param options Partial options.  For options that are not defined, the
 * defaults will be used.
 */
export declare function quicktypeMultiFile(options: Partial<Options>): Promise<MultiFileRenderResult>;
export declare function quicktypeMultiFileSync(options: Partial<Options>): MultiFileRenderResult;
/**
 * Combines a multi-file render result into a single output.  All the files
 * are concatenated and prefixed with a `//`-style comment giving the
 * filename.
 */
export declare function combineRenderResults(result: MultiFileRenderResult): SerializedRenderResult;
/**
 * Run quicktype like `quicktypeMultiFile`, but if there are multiple
 * output files they will all be squashed into one output, with comments at the
 * start of each file.
 *
 * @param options Partial options.  For options that are not defined, the
 * defaults will be used.
 */
export declare function quicktype(options: Partial<Options>): Promise<SerializedRenderResult>;
