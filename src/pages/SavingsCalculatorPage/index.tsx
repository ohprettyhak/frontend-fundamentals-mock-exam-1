import { ErrorBoundary, Suspense } from '@suspensive/react';
import { Border, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSavingsProducts, type SavingsProduct } from '../../apis';
import { useCurrencyInput } from '../../hooks/useCurrencyInput';
import { useState } from 'react';
import { SwitchCase } from 'react-simplikit';
import { ProductList } from './_components/ProductList';
import { CalculationResult } from './_components/CalculationResult';

export function SavingsCalculatorPage() {
  return (
    <ErrorBoundary
      fallback={error => {
        console.error(error);
        return <ListRow contents={<ListRow.Texts type="1RowTypeA" top="에러가 발생했습니다." />} />;
      }}
    >
      <Suspense fallback={<ListRow.Texts type="1RowTypeA" top="로딩 중..." />} clientOnly>
        <SavingsCalculatorContent />
      </Suspense>
    </ErrorBoundary>
  );
}

export function SavingsCalculatorContent() {
  const { data: products } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: fetchSavingsProducts,
  });

  const monthlyDepositInput = useCurrencyInput('');
  const goalAmountInput = useCurrencyInput('');
  const [term, setTerm] = useState<number>(12);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('products');

  const filteredProducts = products.filter(product => {
    const deposit = monthlyDepositInput.numericValue;
    const isTermValid = product.availableTerms === term;

    if (deposit === 0) {
      return isTermValid;
    }

    const isDepositValid = deposit >= product.minMonthlyAmount && deposit <= product.maxMonthlyAmount;
    return isDepositValid && isTermValid;
  });

  return (
    <>
      <NavigationBar title="적금 계산기" />

      <Spacing size={16} />

      <TextField
        label="목표 금액"
        placeholder="목표 금액을 입력하세요"
        suffix="원"
        value={goalAmountInput.value}
        onChange={goalAmountInput.onChange}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyDepositInput.value}
        onChange={monthlyDepositInput.onChange}
      />
      <Spacing size={16} />
      <SelectBottomSheet
        label="저축 기간"
        title="저축 기간을 선택해주세요"
        value={term}
        onChange={value => setTerm(value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => setCurrentTab(value)}>
        <Tab.Item value="products" selected={currentTab === 'products'}>
          적금 상품
        </Tab.Item>
        <Tab.Item value="results" selected={currentTab === 'results'}>
          계산 결과
        </Tab.Item>
      </Tab>

      <SwitchCase
        value={currentTab}
        caseBy={{
          products: () => (
            <ProductList products={filteredProducts} selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
          ),
          results: () => (
            <CalculationResult
              selectedProduct={selectedProduct}
              monthlyDeposit={monthlyDepositInput.numericValue}
              term={term}
              goalAmount={goalAmountInput.numericValue}
              products={filteredProducts}
              onSelect={setSelectedProduct}
            />
          ),
        }}
        defaultComponent={() => <ListRow.Texts type="1RowTypeA" top="탭을 선택해주세요." />}
      />
    </>
  );
}
