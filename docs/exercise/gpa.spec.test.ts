/**
 * 🧑‍💻 사람이 명세(docs/gpa-spec.md)를 읽고 규칙마다 하나씩 만든 테스트입니다.
 *    AI가 만든 tests/gpa.test.ts와 무엇이 다른지 비교해 보세요.
 */

import { calculateGpa, Course } from '../src/gpa';

describe('학점 계산기 명세 (docs/gpa-spec.md)', () => {
  it('규칙 2·3: P 과목은 평점에서 빠지고 취득 학점에는 들어간다', () => {
    const result = calculateGpa([
      { name: '자료구조', credits: 3, grade: 'A+' },
      { name: '사회봉사', credits: 1, grade: 'P' },
    ]);

    expect(result.gpa).toBe(4.5);
    expect(result.gradedCredits).toBe(3);
    expect(result.earnedCredits).toBe(4);
  });

  it('규칙 3: NP 과목은 취득 학점에 들어가지 않는다', () => {
    const result = calculateGpa([
      { name: '자료구조', credits: 3, grade: 'B0' },
      { name: '사회봉사', credits: 1, grade: 'NP' },
    ]);

    expect(result.earnedCredits).toBe(3);
  });

  it('규칙 4: 평점 대상 과목이 없으면 gpa는 null이다', () => {
    expect(calculateGpa([]).gpa).toBeNull();
    expect(calculateGpa([{ name: '사회봉사', credits: 1, grade: 'P' }]).gpa).toBeNull();
  });

  it('규칙 5: 소수 셋째 자리에서 반올림한다', () => {
    // (4.5×3 + 3.5×2 + 3.0×1) ÷ 6 = 3.9166… → 3.92
    const result = calculateGpa([
      { name: '자료구조', credits: 3, grade: 'A+' },
      { name: '운영체제', credits: 2, grade: 'B+' },
      { name: '글쓰기', credits: 1, grade: 'B0' },
    ]);

    expect(result.gpa).toBe(3.92);
  });

  it('규칙 6: 입력 배열을 바꾸지 않는다', () => {
    const courses: Course[] = [
      { name: '자료구조', credits: 3, grade: 'C0' },
      { name: '자료구조', credits: 3, grade: 'A0' },
    ];
    const before = JSON.stringify(courses);

    calculateGpa(courses);

    expect(JSON.stringify(courses)).toBe(before);
  });

  it('규칙 7: 재수강 과목은 가장 뒤에 있는 기록만 계산한다', () => {
    const result = calculateGpa([
      { name: '자료구조', credits: 3, grade: 'A0' },
      { name: '자료구조', credits: 3, grade: 'F' },
    ]);

    expect(result.gpa).toBe(0);
    expect(result.earnedCredits).toBe(0);
  });
});
