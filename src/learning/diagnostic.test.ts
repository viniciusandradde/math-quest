import {describe,expect,it} from 'vitest';
import {diagnosticQuestions,evaluateDiagnostic} from './diagnostic';

describe('diagnostic assessment',()=>{
 it('covers the five foundational multiplication skills',()=>{
  expect(new Set(diagnosticQuestions.map(q=>q.skill)).size).toBe(5);
 });
 it('classifies each skill without turning the result into a grade',()=>{
  const result=evaluateDiagnostic([{questionId:'groups-1',skill:'equal-groups',selected:'3 grupos de 4',correct:true}]);
  expect(result.bySkill['equal-groups'].level).toBe('secure');
  expect(result.bySkill.arrays.level).toBe('not-assessed');
  expect(result.bySkill.arrays.total).toBe(0);
 });
 it('keeps the response and explanation traceable by question id',()=>{
  expect(diagnosticQuestions.find(q=>q.id==='facts-1')?.explanation).toContain('não uma falha');
 });
});
