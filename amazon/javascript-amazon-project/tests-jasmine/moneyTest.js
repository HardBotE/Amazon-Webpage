import {priceConverter} from "../utils/money.js";


describe('test suite: formatCurrency',()=>{
   it('converts cents into dollars',()=>{
       expect(priceConverter(2095)).toEqual('20.95');
   });
   it('works with 0',()=>{
       expect(priceConverter(0)).toEqual('0.00');
   });

   it('rounds up to the nearest cent',()=>{
       expect(priceConverter(2000.5)).toEqual('20.01');
   })
});