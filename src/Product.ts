const prices: {[key: string]: number} = {
    cola: 1.0,
    chips: 0.50,
    candy: 0.65
  };
  // const stock = {
  //   cola: 0,
  //   chips: 10,
  //   candy: 10
  // };
  
  class Product{
    priceOf(productName: string): number {
      const key = productName.toLowerCase();
      if (key in prices) {
        return prices[key];
      } else {
        throw new Error('Unknown product: ' + productName);
      }
    }
  //  isSoldOut(productName: string): boolean {
  //     const key = productName.toLowerCase();
  //     if (key in stock) {
  //       return stock[key] === 0;
  //     } else {
  //       throw new Error('Unknown product: ' + productName);
  //     }
  //   }

  }
  
  export default Product;
  