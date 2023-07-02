import { Coin } from "./coin";
class CoinRecogniser {
  recognise(coin: Coin): number {
    if (CoinRecogniser.isNickel(coin)) {
      return 0.05;
    } else if (CoinRecogniser.isDime(coin)) {
      return 0.1;
    } else if (CoinRecogniser.isQuarter(coin)) {
      return 0.25;
    } else {
      return 0.0;
    }
  }

  private static isNickel(coin: Coin): boolean {
    return (
      coin.mass === 5 && coin.diameter === 21.21 && coin.thickness === 1.95
    );
  }

  private static isDime(coin: Coin): boolean {
    return (
      coin.mass === 2.268 && coin.diameter === 17.91 && coin.thickness === 1.35
    );
  }

  private static isQuarter(coin: Coin): boolean {
    return (
      coin.mass === 5.67 && coin.diameter === 24.26 && coin.thickness === 1.75
    );
  }
}

export default CoinRecogniser;
