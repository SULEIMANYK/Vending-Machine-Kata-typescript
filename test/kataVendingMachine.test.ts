import kataVendingMachine from "../src/kataVendingMachine";
import { NICKEL, DIME, QUARTER, PENNY } from "../src/coins";
import { Coin } from "../src/coin";

describe("The vending machine KATA", () => {
  let machine: kataVendingMachine;

  beforeEach(() => {
    machine = new kataVendingMachine(100, 100, 100);
  });

  it("should display INSERT COIN if no money has been inserted", () => {
    expect(machine.nextMessage).toEqual("INSERT COIN");
  });

  describe("accepting coins", () => {
    it("should accept one nickel", () => {
      machine.insertCoin(NICKEL);
      expect(machine.nextMessage).toEqual("$0.05");
    });

    it("should accept one dime", () => {
      machine.insertCoin(DIME);
      expect(machine.nextMessage).toEqual("$0.10");
    });

    it("should accept one quarter", () => {
      machine.insertCoin(QUARTER);
      expect(machine.nextMessage).toEqual("$0.25");
    });

    it("should accept multiple coins", () => {
      machine.insertCoin(NICKEL);
      machine.insertCoin(QUARTER);
      machine.insertCoin(DIME);
      machine.insertCoin(QUARTER);
      expect(machine.nextMessage).toEqual("$0.65");
    });

    it("should reject a penny", () => {
      machine.insertCoin(PENNY);
      expect(machine.nextMessage).toEqual("INSERT COIN");
      expect(machine.coinReturn).toContain(PENNY);
    });

    it("should reject bogus coins mixed with valid coins", () => {
      const bogusCoin: Coin = {
        mass: 3,
        diameter: 18,
        thickness: 1.5,
      };

      machine.insertCoin(bogusCoin);
      machine.insertCoin(DIME);
      machine.insertCoin(QUARTER);
      machine.insertCoin(bogusCoin);
      machine.insertCoin(NICKEL);
      machine.insertCoin(NICKEL);
      expect(machine.nextMessage).toEqual("$0.45");
      expect(machine.coinReturn).toContain(bogusCoin);
    });
  });

  describe("coin return", () => {
    const bogusCoin1 = copyCoin(NICKEL, { mass: 0.1 });
    const bogusCoin2 = copyCoin(NICKEL, { mass: 0.2 });

    beforeEach(() => {
      machine.insertCoin(bogusCoin1);
      machine.insertCoin(bogusCoin2);
    });

    it("should keep invalid coins in there", () => {
      expect(machine.coinReturn).toContain(bogusCoin1);
      expect(machine.coinReturn).toContain(bogusCoin2);
    });

    it("should be able to clear", () => {
      machine.clearCoinReturn();
      expect(machine.coinReturn.length).toBe(0);
    });
  });

  describe("selecting a product", () => {
    describe("when you have inserted exact change", () => {
      beforeEach(() => {
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.selectProduct("Cola");
      });

      it("dispenses the product", () => {
        expect(machine.productChute).toContain("Cola");
      });

      it("should display THANK YOU, then INSERT COIN", () => {
        expect(machine.nextMessage).toBe("THANK YOU");
        expect(machine.nextMessage).toBe("INSERT COIN");
      });
    });

    describe("when you have inserted more than enough money", () => {
      beforeEach(() => {
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.insertCoin(DIME);
        machine.insertCoin(NICKEL);
        machine.selectProduct("Chips");
      });

      it("dispenses the product", () => {
        expect(machine.productChute).toContain("Chips");
      });

      it("should display THANK YOU, then remaining balance", () => {
        expect(machine.nextMessage).toBe("THANK YOU");
        expect(machine.nextMessage).toBe("$0.15");
      });
    });

    describe("when you have not inserted enough money", () => {
      beforeEach(() => {
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.insertCoin(DIME);

        machine.selectProduct("Candy");
      });

      it("dispenses nothing", () => {
        expect(machine.productChute).toEqual([]);
      });

      it("should display the price, then the amount tendered", () => {
        expect(machine.nextMessage).toBe("PRICE $0.65");
        expect(machine.nextMessage).toBe("$0.60");
      });
    });

    describe("when the product is sold out", () => {
      beforeEach(() => {
        machine = new kataVendingMachine(0, 10, 10);
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.selectProduct("Cola");
      });

      it("dispenses nothing", () => {
        expect(machine.productChute).toEqual([]);
      });

      it("should display the price, then the amount tendered", () => {
        expect(machine.nextMessage).toBe("SOLD OUT");
        expect(machine.nextMessage).toBe("$1.00");
      });
    });

    describe("when the product is sold out and you have not inserted enough money", () => {
      beforeEach(() => {
        machine = new kataVendingMachine(0, 10, 10);
        machine.insertCoin(QUARTER);
        machine.insertCoin(QUARTER);
        machine.insertCoin(DIME);
        machine.selectProduct("cola");
      });

      it("dispenses nothing", () => {
        expect(machine.productChute).toEqual([]);
      });

      it("should display the price, then the amount tendered", () => {
        expect(machine.nextMessage).toBe("SOLD OUT");
        expect(machine.nextMessage).toBe("$0.60");
      });
    });
  });

  describe("exact change only", () => {

    beforeEach(() => {
      machine = new kataVendingMachine(10, 10, 10 );
      machine.exactChangeOnly();
    });
    it("should display EXACT CHANGE ONLY when exact change only", () => {
      expect(machine.nextMessage).toEqual("EXACT CHANGE ONLY");
    });

  
  });
  describe("exact change only", () => {
    let money = [NICKEL, DIME, QUARTER];
    for (let i = 0; i < 200; i++) {
      let random = Math.floor(Math.random() * money.length);
      money.push(money[random]);
    }
 

    beforeEach(() => {
      machine = new kataVendingMachine(10, 10, 10 , money );
      machine.exactChangeOnly();
    });
    it("should display INSERT COIN", () => {
      expect(machine.nextMessage).toEqual("INSERT COIN");
    });
  });
});

function copyCoin(baseCoin: Coin, updates: Partial<Coin>): Coin {
  return { ...baseCoin, ...updates };
}
