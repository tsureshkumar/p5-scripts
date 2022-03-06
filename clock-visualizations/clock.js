class Clock {

  constructor() {
    this.precision = 2;
    this._v = 0;
    this._v90 = [];
    this.worker = new Worker(`clock.worker3.js`);

    this.worker.addEventListener('message', this._messageHandler.bind(this), false);
      this.worker.postMessage('start');

  }


  _messageHandler(e) {
    if (e.data.method === 'updateValue') {
      this._v = parseFloat(e.data.value);
    } else if (e.data.method === 'got90') {
      console.log(e.data);
      this._v90.push(e.data.value);
    } else {
      console.log(e.data);
    }
  }


  getValue() {
    return this._v.toFixed(this.precision);
  }

    get90s() {
        return this._v90;
    }

    toggleRunning() {
        this.worker.postMessage('toggle');
    }

}
