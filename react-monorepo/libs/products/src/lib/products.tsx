import { useEffect, useState } from 'react';
import styles from './products.module.less';
import { Product, getProducts } from './odata';

/* eslint-disable-next-line */
export interface ProductsProps {}

export function Products(props: ProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  
  useEffect(() => {

    getProducts().then((res) => {
      setProducts(res)
      console.log(`Get products:`, res)
    })

  }, [])
  return (
    <div className={styles['container']}>
      <h1>Welcome to Products Lib!</h1>

      <ul>
        {products.map((product) => (
          <li key={product.Id}>{product.Name}</li>
        ))}
      </ul>
    </div>
  );
}
