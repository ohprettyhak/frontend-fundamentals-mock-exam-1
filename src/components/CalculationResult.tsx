import { Border, colors, ListHeader, ListRow, Spacing } from 'tosslib';
import { INTEREST_RATE_FACTOR, RECOMMENDED_PRODUCT_COUNT, ROUNDING_UNIT } from '../constants/savings';
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

  const 연_이자율 = selectedProduct.annualRate / 100;
  const 예상_수익_금액 = Math.floor(monthlyDeposit * term * (1 + 연_이자율 * INTEREST_RATE_FACTOR));
  const 목표_금액과의_차이 = goalAmount - 예상_수익_금액;
  const 추천_월_납입_금액 =
    Math.round(goalAmount / (term * (1 + 연_이자율 * INTEREST_RATE_FACTOR)) / ROUNDING_UNIT) * ROUNDING_UNIT;

  const recommendedProducts = [...products]
    .sort((a, b) => b.annualRate - a.annualRate)
    .slice(0, RECOMMENDED_PRODUCT_COUNT);

  return (
    <>
      <ListRow
        contents={
          <ListRow.Texts
            type="2RowTypeA"
            top="예상 수익 금액"
            topProps={{ color: colors.grey600 }}
            bottom={`${예상_수익_금액.toLocaleString()} 원`}
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
            bottom={`${목표_금액과의_차이.toLocaleString()} 원`}
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
            bottom={`${추천_월_납입_금액.toLocaleString()} 원`}
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
