import { request } from 'undici';
class smssxck {
  #baseUrl;
  #url;

  constructor(apiKey, service) {
    if (!apiKey) {
      throw new Error('Failed: no API key provided');
    }

    if (service === 'smshub' || !service) {
      this.#baseUrl = `https://smshub.org/stubs/handler_api.php?api_key=${apiKey}`;
    } else if (service === 'smsActivate') {
      this.#baseUrl = `https://api.sms-activate.io/stubs/handler_api.php?api_key=${apiKey}`;
    }
  }
  #checkResponse(res) {
    switch (res) {
      case 'BAD_KEY':
        throw new Error('Invalid API KEY');
      case 'ERROR_SQL':
        throw new Error('Error SQL-server');
      case 'BAD_ACTION':
        throw new Error('General query malformed');
      case 'BAD_CURRENCY':
        throw new Error('Bad currency value');
      case 'NO_ACTIVATION':
        throw new Error('No activation found');
      case 'BAD_SERVICE':
        throw new Error('No service found');
      default:
        return res;
    }
  }

  async getBalance() {
    try {
      this.#url = `${this.#baseUrl}&action=getBalance`;
      const { body, statusCode } = await request(this.#url, {
        method: 'GET',
      });
      if (statusCode != 200) {
        throw new Error('failed get balance statusCode ' + statusCode);
      }
      const response = await body.text();
      const data = this.#checkResponse(response);
      if (data.includes('ACCESS_BALANCE')) {
        const balance = data.split(':')[1];
        return {
          ACCESS_BALANCE: parseFloat(balance),
        };
      } else {
        throw new Error('no access balance');
      }
    } catch (error) {
      return error;
    }
  }
  async getNumber(service, country, operator = 'any', maxPrice = '') {
    try {
      if (!service) throw new Error('Error No service');
      if (!country) throw new Error('Error no country');
      this.#url = `${
        this.#baseUrl
      }&action=getNumber&service=${service}&operator=${operator}&country=${country}&maxPrice=${maxPrice}`;
      const { body, statusCode } = await request(this.#url, { method: 'GET' });
      if (statusCode != 200) {
        throw new Error('failed get number statusCode ' + statusCode);
      }
      const response = await body.text();
      const data = this.#checkResponse(response);
      if (data.includes('ACCESS_NUMBER')) {
        const orderid = data.split(':')[1];
        const phoneNum = data.split(':')[2];
        return {
          ORDER_ID: orderid,
          PHONE_NUMBER: phoneNum,
        };
      } else {
        throw new Error('failed get number reason ' + data);
      }
    } catch (error) {
      return error;
    }
  }
  async getCode(orderid) {
    try {
      if (!orderid) throw new Error('No orderid');

      this.#url = `${this.#baseUrl}&action=getStatus$id=${orderid}`;
      const { body, statusCode } = await request(this.#url, { method: 'GET' });
      if (statusCode != 200) {
        throw new Error('failed getCode statusCode ' + statusCode);
      }
      const response = await body.text();
      const code = response.split(':')[1]?.trim();
      if (code !== undefined) {
        return {
          CODE: code,
        };
      }
      return {
        CODE: undefined,
      };
    } catch (error) {
      return error;
    }
  }
  async changeStatus(orderid, status) {
    try {
      if (!orderid) throw new Error('No orderid');
      if (!status) throw new Error('No status');
      this.#url = `${
        this.#baseUrl
      }&action=setStatus&status=${status}&id=${orderid}`;
      const { body, statusCode } = await request(this.#url, { method: 'GET' });
      if (statusCode != 200) {
        throw new Error('failed changeStatus statusCode ' + statusCode);
      }
      const response = await body.text();
      return {
        STATUS: response,
      };
    } catch (error) {
      return error;
    }
  }
}
export default smssxck;
