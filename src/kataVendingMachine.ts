import { Coin } from "./coin";
import CoinRecogniser from "./CoinRecogniser";
import Product from "./Product";

const recogniser = new CoinRecogniser();
const product = new Product();

class kataVendingMachine {
  private _insertedAmount: number;
  private _returnedCoins: Coin[];
  private _money: Coin[];
  private cola: number;
  private chips: number;
  private candy: number;
  private _productChute: string[];
  private _specialMessages: string[];
  private _insertedCoins: Coin[];
  constructor(cola: number, chips: number, candy: number, money?: Coin[]) {
    this._insertedAmount = 0.0;
    this._returnedCoins = [];
    this._productChute = [];
    this._specialMessages = [];
    this._insertedCoins = [];
    this._money = money ?? [];
    this.cola = cola;
    this.chips = chips;
    this.candy = candy;
  }

  get nextMessage() {
    return (
      this._specialMessages.shift() || defaultMessage(this._insertedAmount)
    );
  }

  insertCoin(coin: Coin) {
    const value = recogniser.recognise(coin);
    if (value > 0) {
      this._insertedAmount += value;
      this._insertedCoins.push(coin);
    } else {
      this._returnedCoins.push(coin);
    }
  }

  selectProduct(name: string) {
    if (this.soldOut(name)) {
      return;
    } else {
      const price = product.priceOf(name);
      this.dispense(name, price);
    }
  }
  // dispense product
  dispense(name: string, price: number) {
    if (this._insertedAmount >= price) {
      this._insertedAmount -= price;
      this._productChute.push(name);
      this._specialMessages.push("THANK YOU");
      // based on the name of the product, update the stock
      if (name === "cola") {
        this.cola -= 1;
      }
      if (name === "chips") {
        this.chips -= 1;
      }
      if (name === "candy") {
        this.candy -= 1;
      }
      // add the inserted coins to the money
      this._money = this._money.concat(this._insertedCoins);
      this._insertedCoins = [];
    } else {
      this._specialMessages.push("PRICE " + formatCurrency(price));
    }
  }

  soldOut(name: string) {
    name = name.toLowerCase();
    if (name === "candy" && this.candy === 0) {
      if (!this._specialMessages.includes("SOLD OUT")) {
        this._specialMessages.push("SOLD OUT");
      }
      return true;
    }

    if (name === "chips" && this.chips === 0) {
      if (!this._specialMessages.includes("SOLD OUT")) {
        this._specialMessages.push("SOLD OUT");
      }
      return true;
    }

    if (name === "cola" && this.cola === 0) {
      if (!this._specialMessages.includes("SOLD OUT")) {
        this._specialMessages.push("SOLD OUT");
      }
      return true;
    }
  }

  //Exact Change Only
  exactChangeOnly() {
    if (this._money.length === 0) {
      this._specialMessages.push("EXACT CHANGE ONLY");
    }
  }

  get productChute() {
    return this._productChute;
  }

  get coinReturn() {
    return this._returnedCoins;
  }
  get money() {
    return this._money;
  }

  get insertedAmount() {
    return this._insertedAmount;
  }

  get insertedCoins() {
    return this._insertedCoins;
  }

  clearCoinReturn() {
    this._returnedCoins = [];
  }
}

function formatCurrency(amount: number) {
  return "$" + amount.toFixed(2);
}

function defaultMessage(insertedAmount: number) {
  return insertedAmount ? formatCurrency(insertedAmount) : "INSERT COIN";
}

export default kataVendingMachine;
