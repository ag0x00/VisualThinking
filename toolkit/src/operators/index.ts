import { symmetryOperator } from "./symmetry";
import { complexityOperator } from "./complexity";
import { colorChordOperator } from "./color-chord";
import { constructionGrammarOperator } from "./construction-grammar";
import { lineContinuityOperator } from "./line-continuity";
import { cuerdaSecaOperator } from "./cuerda-seca";
import { tileComplexityOperator } from "./tile-complexity";
import { periodicityOperator } from "./periodicity";
import type { Operator } from "./types";

export const operators: Record<string, Operator<any, any>> = {
  symmetry: symmetryOperator,
  complexity: complexityOperator,
  colorChord: colorChordOperator,
  constructionGrammar: constructionGrammarOperator,
  lineContinuity: lineContinuityOperator,
  cuerdaSeca: cuerdaSecaOperator,
  tileComplexity: tileComplexityOperator,
  periodicity: periodicityOperator,
};
