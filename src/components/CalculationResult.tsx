import { colors, ListRow } from 'tosslib';
import { SavingsProduct } from '../models/savings';

interface CalculationResultProps {
  selectedProduct: SavingsProduct | null;
  monthlyDeposit: number;
  term: number;
  goalAmount: number;
}

export function CalculationResult({ selectedProduct, monthlyDeposit, term, goalAmount }: CalculationResultProps) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const annualRate = selectedProduct.annualRate / 100;
  const expectedTotalAmount = Math.floor(monthlyDeposit * term * (1 + annualRate * 0.5));
  const differenceFromGoal = goalAmount - expectedTotalAmount;
  const recommendedMonthlyDeposit = Math.round(goalAmount / (term * (1 + annualRate * 0.5)) / 1000) * 1000;

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${expectedTotalAmount.toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="목표 금액과의 차이"
            topProps={{ color: colors.grey600 }}
            bottom={`${differenceFromGoal.toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="추천 월 납입 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${recommendedMonthlyDeposit.toLocaleString()}원`}
            bottomProps={{ fontWeight: 'bold', color: colors.blue600 }}
          />
        }
      />
    </>
  );
}
