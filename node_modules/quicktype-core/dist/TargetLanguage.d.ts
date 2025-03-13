import { type DateTimeRecognizer } from "./DateTime";
import { type RenderContext, type Renderer } from "./Renderer";
import { type Option, type OptionDefinition } from "./RendererOptions";
import { type SerializedRenderResult } from "./Source";
import { type Comment } from "./support/Comments";
import { type Type } from "./Type";
import { type StringTypeMapping } from "./TypeBuilder";
import { type TypeGraph } from "./TypeGraph";
import { type FixMeOptionsAnyType, type FixMeOptionsType } from "./types";
export type MultiFileRenderResult = ReadonlyMap<string, SerializedRenderResult>;
export declare abstract class TargetLanguage {
    readonly displayName: string;
    readonly names: string[];
    readonly extension: string;
    constructor(displayName: string, names: string[], extension: string);
    protected abstract getOptions(): Array<Option<FixMeOptionsAnyType>>;
    get optionDefinitions(): OptionDefinition[];
    get cliOptionDefinitions(): {
        actual: OptionDefinition[];
        display: OptionDefinition[];
    };
    get name(): string;
    protected abstract makeRenderer(renderContext: RenderContext, optionValues: FixMeOptionsType): Renderer;
    renderGraphAndSerialize(typeGraph: TypeGraph, givenOutputFilename: string, alphabetizeProperties: boolean, leadingComments: Comment[] | undefined, rendererOptions: FixMeOptionsType, indentation?: string): MultiFileRenderResult;
    protected get defaultIndentation(): string;
    get stringTypeMapping(): StringTypeMapping;
    get supportsOptionalClassProperties(): boolean;
    get supportsUnionsWithBothNumberTypes(): boolean;
    get supportsFullObjectType(): boolean;
    needsTransformerForType(_t: Type): boolean;
    get dateTimeRecognizer(): DateTimeRecognizer;
}
