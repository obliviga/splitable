$(document).ready(() => {
  // Get values of subtotal, tax, and tip
  $('#addPerson').click(() => {
    $('tbody').append(
      '<tr><td><input placeholder=Bob><td>$<span id=due>0</span><td><input type=number>',
    );
  });
});
