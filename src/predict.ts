/**
 * 가짜 ML 추론 함수.
 * 실제 모델 대신 입력 features 의 가중평균을 점수로 반환한다.
 * 실습 목적상 의도적으로 단순하게 작성되어 있다.
 */
export interface PredictInput {
  features: number[];
}

export interface PredictOutput {
  score: number;
  label: 'positive' | 'negative';
}

const WEIGHTS = [0.4, 0.3, 0.2, 0.1];

export function predict(input: PredictInput): PredictOutput {
  const { features } = input;

  const weightedSum = features.reduce((acc, value, idx) => {
    const w = WEIGHTS[idx] ?? 0.1;
    return acc + value * w;
  }, 0);

  const normalized = 1 / (1 + Math.exp(-weightedSum));

  return {
    score: Number(normalized.toFixed(4)),
    label: normalized >= 0.5 ? 'positive' : 'negative'
  };
}
