/* eslint-disable */
export const registerGlobalAPI = () => {
  Date.prototype.toHawkDateString = function () {
    const Y = this.getFullYear()
    const M = this.getMonth() + 1
    const D = this.getDate()
    return `${Y}-${M > 9 ? M : `0${M}`}-${D > 9 ? D : `0${D}`}`
  }

  Date.prototype.toHawkTimeString = function () {
    const h = this.getHours()
    const m = this.getMinutes()
    const s = this.getSeconds()
    return `${h > 9 ? h : `0${h}`}:${m > 9 ? m : `0${m}`}:${s > 9 ? s : `0${s}`}`
  }

  Date.prototype.toHawkString = function () {
    return this.toHawkDateString() + ' ' + this.toHawkTimeString()
  }
  Date.parseHawkDateString = function(hawk_date_string/* YYYY-MM-DD */) {
    if (!hawk_date_string) return new Date();
    let parts = hawk_date_string.split('-').map(p => parseInt(p));
    if (parts.length != 3) return new Date();
    parts[1] -= 1;

    let milliseconds = Date.UTC(...parts) - 8*3600*1000; // minus GMT+8
    return new Date(milliseconds);
  }

  Date.parseHawkString = function(hawk_string/* YYYY-MM-DD HH:MM:SS */) {
    if (!hawk_string) return new Date();
    let datetime = hawk_string.split(/[- :]/);
    if (datetime.length != 6) return new Date();
    datetime[1] -= 1;

    let milliseconds = Date.UTC(...datetime) - 8*3600*1000; // minus GMT+8
    return new Date(milliseconds);
  }
  console.log('[init] install global API')
}
export const init = () => {
  registerGlobalAPI()
}

export default {
  init
}
