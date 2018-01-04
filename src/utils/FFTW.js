
var FFTWModule = require('fftw-js/src/FFTW');
var fftwModule = FFTWModule({});

var fftw_plan_dft_r2c_1d = fftwModule.cwrap(
    'fftw_plan_dft_r2c_1d', 'number', ['number', 'number', 'number', 'number']
);

var fftw_plan_dft_c2r_1d = fftwModule.cwrap(
    'fftw_plan_dft_c2r_1d', 'number', ['number', 'number', 'number', 'number']
);

var fftw_plan_r2r_1d = fftwModule.cwrap(
    'fftw_plan_r2r_1d', 'number', ['number', 'number', 'number', 'number']
);

var fftw_execute = fftwModule.cwrap(
    'fftw_execute', 'void', ['number']
);

var fftw_destroy_plan = fftwModule.cwrap(
    'fftw_destroy_plan', 'void', ['number']
);

var FFTW_ESTIMATE = (1 << 6);
var FFTW_R2HC = 0;
var FFTW_HC2R = 1;

const kElementSize = 8

export function FFT(size) {

  this.size = size;
  this.rptr = fftwModule._malloc(size * kElementSize + (size+2) * kElementSize);
  this.cptr = this.rptr + size * kElementSize;
  this.r = new Float64Array(fftwModule.HEAPU8.buffer, this.rptr, size);
  this.c = new Float64Array(fftwModule.HEAPU8.buffer, this.cptr, size+2);

  this.fplan = fftw_plan_dft_r2c_1d(size, this.rptr, this.cptr, FFTW_ESTIMATE);
  this.iplan = fftw_plan_dft_c2r_1d(size, this.cptr, this.rptr, FFTW_ESTIMATE);

  this.forward = function(real) {
    this.r.set(real);
    fftw_execute(this.fplan);
    return new Float64Array(fftwModule.HEAPU8.buffer, this.cptr, this.size+2);
  }

  this.inverse = function(cpx) {
    this.c.set(cpx);
    fftw_execute(this.iplan);
    return new Float64Array(fftwModule.HEAPU8.buffer, this.rptr, this.size);
  }

  this.dispose = function() {
    fftw_destroy_plan(this.fplan);
    fftw_destroy_plan(this.iplan);
    fftwModule._free(this.rptr);
  }
}


export function RFFT(size) {
  this.size = size;
  this.rptr = fftwModule._malloc(size * kElementSize + size * kElementSize);
  this.cptr = this.rptr;
  this.r = new Float64Array(fftwModule.HEAPU8.buffer, this.rptr, size);
  this.c = new Float64Array(fftwModule.HEAPU8.buffer, this.cptr, size);

  this.fplan = fftw_plan_r2r_1d(size, this.rptr, this.cptr, FFTW_R2HC, FFTW_ESTIMATE);
  this.iplan = fftw_plan_r2r_1d(size, this.cptr, this.rptr, FFTW_HC2R, FFTW_ESTIMATE);

  this.forward = function(real) {
    this.r.set(real);
    fftw_execute(this.fplan);
    return new Float64Array(fftwModule.HEAPU8.buffer, this.cptr, this.size);
  };

  this.inverse = function(cpx) {
    this.c.set(cpx);
    fftw_execute(this.iplan);
    return new Float64Array(fftwModule.HEAPU8.buffer, this.rptr, this.size);
  };

  this.dispose = function() {
    fftw_destroy_plan(this.fplan);
    fftw_destroy_plan(this.iplan);
    fftwModule._free(this.rptr);
  }
}
