import smssxck from './index.js';
(async () => {
  try {
    const apikey = 'YOUR APIKEY';
    const smshub = new smssxck(apikey, 'smshub');
    const { ACCESS_BALANCE } = await smshub.getBalance();
    if (ACCESS_BALANCE > 0) {
      const maxPrice = 0.112;
      const MAX_WAIT_TIME = 90000;
      const CHECK_INTERVAL = 3000;
      const { ORDER_ID, PHONE_NUMBER } = await smshub.getNumber(
        '',
        6,
        'telkomsel',
        maxPrice
      );
      let phoneNum = PHONE_NUMBER.replace(/^62/, '');
      console.log('phonenum');

      console.log(phoneNum);

      // delay input number
      await new Promise((resolve) => setTimeout(resolve, 20000));
      console.log('DELAY COMPLETED');

      let totalTimeWaited = 0;
      while (totalTimeWaited <= MAX_WAIT_TIME) {
        console.log('get otp');
        await new Promise((resolve) => setTimeout(resolve, CHECK_INTERVAL));
        const { CODE } = await smshub.getCode(ORDER_ID);
        if (CODE !== undefined) {
          console.log(otp);

          console.log(CODE);
        }
        totalTimeWaited += CHECK_INTERVAL;
        if (totalTimeWaited >= MAX_WAIT_TIME) {
          console.log('no otp');
          break;
        }
        continue;
      }
    } else {
      console.log('no balance');
    }
  } catch (error) {
    console.log(error);
  }
})();
