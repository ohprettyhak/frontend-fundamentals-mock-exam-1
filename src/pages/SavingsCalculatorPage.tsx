import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Border, NavigationBar, SelectBottomSheet, Spacing, Tab, TextField } from 'tosslib';
import { fetchSavingsProducts } from '../apis/savings';
import { CalculationResult } from '../components/CalculationResult';
import { ProductList } from '../components/ProductList';

import { SavingsProduct } from '../models/savings';

export function SavingsCalculatorPage() {
  const { data: products } = useSuspenseQuery({
    queryKey: ['savings-products'],
    queryFn: fetchSavingsProducts,
  });

  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('');
  const [term, setTerm] = useState<number>(12);
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(null);
  const [goalAmount, setGoalAmount] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<string>('products');

  const filteredProducts = products.filter(product => {
    const deposit = Number(monthlyDeposit.replace(/,/g, ''));
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
        value={goalAmount}
        onChange={e => {
          const value = e.target.value.replace(/,/g, '');
          if (isNaN(Number(value))) {
            return;
          }
          setGoalAmount(Number(value).toLocaleString());
        }}
      />
      <Spacing size={16} />
      <TextField
        label="월 납입액"
        placeholder="희망 월 납입액을 입력하세요"
        suffix="원"
        value={monthlyDeposit}
        onChange={e => {
          const value = e.target.value.replace(/,/g, '');
          if (isNaN(Number(value))) {
            return;
          }
          setMonthlyDeposit(Number(value).toLocaleString());
        }}
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

      {currentTab === 'products' ? (
        <ProductList products={filteredProducts} selectedProduct={selectedProduct} onSelect={setSelectedProduct} />
      ) : (
        <CalculationResult
          selectedProduct={selectedProduct}
          monthlyDeposit={Number(monthlyDeposit.replace(/,/g, ''))}
          term={term}
          goalAmount={Number(goalAmount.replace(/,/g, ''))}
          products={filteredProducts}
          onSelect={setSelectedProduct}
        />
      )}
    </>
  );
}
