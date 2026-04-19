import { useEffect, useState, useCallback } from 'react';
import {
  initConnection,
  fetchProducts,
  requestPurchase,
  purchaseUpdatedListener,
  purchaseErrorListener,
  finishTransaction,
  endConnection,
  Product,
  PurchaseError,
} from 'react-native-iap';
import { loadPurchases, savePurchase, PRODUCT_IDS } from '../store/purchases';

const ALL_PRODUCT_IDS = Object.values(PRODUCT_IDS);

export type PurchaseState = 'idle' | 'loading' | 'success' | 'error';

export function usePurchases() {
  const [ownedProductIds, setOwnedProductIds] = useState<Set<string>>(new Set());
  const [products, setProducts] = useState<Product[]>([]);
  const [purchaseState, setPurchaseState] = useState<PurchaseState>('idle');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let purchaseListener: ReturnType<typeof purchaseUpdatedListener>;
    let errorListener: ReturnType<typeof purchaseErrorListener>;

    async function setup() {
      try {
        await initConnection();
        setConnected(true);

        const stored = await loadPurchases();
        setOwnedProductIds(stored);

        const fetched = await fetchProducts({ skus: ALL_PRODUCT_IDS });
        setProducts((fetched as Product[]) ?? []);

        purchaseListener = purchaseUpdatedListener(async (purchase) => {
          await finishTransaction({ purchase });
          await savePurchase(purchase.productId);
          setOwnedProductIds((prev) => new Set([...prev, purchase.productId]));
          setPurchaseState('success');
        });

        errorListener = purchaseErrorListener((_error: PurchaseError) => {
          setPurchaseState('error');
        });
      } catch {
        // IAP not available (e.g. Expo Go) — load stored purchases only
        const stored = await loadPurchases();
        setOwnedProductIds(stored);
      }
    }

    setup();

    return () => {
      purchaseListener?.remove();
      errorListener?.remove();
      endConnection();
    };
  }, []);

  const purchase = useCallback(
    async (productId: string) => {
      if (__DEV__ && !connected) {
        // Simulate purchase in Expo Go / dev without native IAP
        await savePurchase(productId);
        setOwnedProductIds((prev) => new Set([...prev, productId]));
        setPurchaseState('success');
        return;
      }
      try {
        setPurchaseState('loading');
        await requestPurchase({
          request: {
            apple: { sku: productId },
            google: { skus: [productId] },
          },
          type: 'in-app',
        });
      } catch {
        setPurchaseState('error');
      }
    },
    [connected],
  );

  const resetState = useCallback(() => setPurchaseState('idle'), []);

  const priceFor = useCallback(
    (productId: string): string => {
      const product = products.find((p) => p.id === productId);
      return product?.displayPrice ?? '£0.99';
    },
    [products],
  );

  return { ownedProductIds, purchase, purchaseState, resetState, priceFor };
}
