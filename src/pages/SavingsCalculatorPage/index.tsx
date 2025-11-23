import { ErrorBoundary, Suspense } from '@suspensive/react';
import { Border, ListRow, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { useSuspenseQuery } from '@tanstack/react-query';
import { fetchSavingsProducts } from '../../apis';
import { useCurrencyInput } from '../../hooks/useCurrencyInput';
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

import { useSearchParams } from 'react-router-dom';

export function SavingsCalculatorContent() {
  const { data: products } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: fetchSavingsProducts,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const term = Number(searchParams.get('term')) || 12;
  const currentTab = searchParams.get('tab') || 'products';
  const productId = searchParams.get('productId');
  const selectedProduct = products.find(p => p.id === productId) || null;

  const monthlyDepositInput = useCurrencyInput(searchParams.get('monthlyDeposit') || '', value =>
    updateParams('monthlyDeposit', value || null)
  );
  const goalAmountInput = useCurrencyInput(searchParams.get('goalAmount') || '', value =>
    updateParams('goalAmount', value || null)
  );

  const updateParams = (key: string, value: string | number | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
    setSearchParams(newParams, { replace: true });
  };

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
        onChange={value => updateParams('term', value)}
      >
        <SelectBottomSheet.Option value={6}>6개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={12}>12개월</SelectBottomSheet.Option>
        <SelectBottomSheet.Option value={24}>24개월</SelectBottomSheet.Option>
      </SelectBottomSheet>

      <Spacing size={24} />
      <Border height={16} />
      <Spacing size={8} />

      <Tab onChange={value => updateParams('tab', value)}>
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
            <ProductList
              products={filteredProducts}
              selectedProduct={selectedProduct}
              onSelect={product => updateParams('productId', product.id)}
            />
          ),
          results: () => (
            <CalculationResult
              selectedProduct={selectedProduct}
              monthlyDeposit={monthlyDepositInput.numericValue}
              term={term}
              goalAmount={goalAmountInput.numericValue}
              products={filteredProducts}
              onSelect={product => updateParams('productId', product.id)}
            />
          ),
        }}
        defaultComponent={() => <ListRow.Texts type="1RowTypeA" top="탭을 선택해주세요." />}
      />
    </>
  );
}
