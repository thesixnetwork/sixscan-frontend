import ENV from "../utils/ENV";
import axios from "axios";


export const getTHB = async () => {
  try {
    const res = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD?fbclid=IwY2xjawI3W4lleHRuA2FlbQIxMAABHahw0KLS-bw2D6ZB0vukwCWw0_FshYGXSbOPAqVbUEV1M1J-FMri7b2cHw_aem_bEYXAGqo6ecgsF6MZEevcQ`);
    const price = res.data.rates.THB;
    // console.log('price', price)
    if (!price) {
      return null;
    }
    return price;
  } catch (error) {
    console.error(error);
    return null;
  }
};