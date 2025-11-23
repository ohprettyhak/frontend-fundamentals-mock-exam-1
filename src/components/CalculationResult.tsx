import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { SavingsProduct } from '../models/savings';
import { ProductList } from './ProductList';

interface CalculationResultProps {
  selectedProduct: SavingsProduct | null;
  monthlyDeposit: number;
  term: number;
  goalAmount: number;
  products: SavingsProduct[];
  onSelect: (product: SavingsProduct) => void;
}

export function CalculationResult({
  selectedProduct,
  monthlyDeposit,
  term,
  goalAmount,
  products,
  onSelect,
}: CalculationResultProps) {
  if (!selectedProduct) {
    return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="상품을 선택해주세요." />} />;
  }

  const annualRate = selectedProduct.annualRate / 100;
  const expectedTotalAmount = Math.floor(monthlyDeposit * term * (1 + annualRate * 0.5));
  const differenceFromGoal = goalAmount - expectedTotalAmount;
  const recommendedMonthlyDeposit = Math.round(goalAmount / (term * (1 + annualRate * 0.5)) / 1000) * 1000;

  const recommendedProducts = [...products].sort((a, b) => b.annualRate - a.annualRate).slice(0, 2);

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

      <Spacing size={8} />
      <Border height={16} />
      <Spacing size={8} />

      <ListHeader title={<ListHeader.TitleParagraph fontWeight="bold">추천 상품 목록</ListHeader.TitleParagraph>} />
      <Spacing size={12} />

      <ProductList products={recommendedProducts} selectedProduct={selectedProduct} onSelect={onSelect} />
    </>
  );
}
