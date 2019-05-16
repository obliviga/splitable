
require('normalize.css/normalize.css');
require('./styles/index.scss');
require('jquery');

$(document).ready(() => {
  // Get values of subtotal, tax, and tip
  $('.input').on('input', () => {
    const subtotal = $('#subtotal').val();
    const tax = $('#tax').val();
    const tip = $('#tip').val();
    const total = +subtotal + +tax + +tip;

    $('#total').html(total);
  });
});
