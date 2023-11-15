import styles from './products.module.less';

/* eslint-disable-next-line */
export interface ProductsProps {}

export function Products(props: ProductsProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Products Lib!</h1>
    </div>
  );
}
