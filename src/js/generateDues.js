import getPeopleQuantity from './utils/getPeopleQuantity';

export default function generateDues() {
  $(document).ready(() => {
    const peopleQuantity = getPeopleQuantity();

    for (let i = 0; i < peopleQuantity; i += 1) {
      $(`.person${i + 1}`).on('input', () => {
        let sum = 0;

        $(`.due${i + 1}`).html($(`.person${i + 1}`).val());

        $('[class*="due"]').each(function () {
          sum += +$(this).text() || 0;
        });

        $('#itemized-total').html(sum);
      });
    }
  });
}


// Call the function immediately, to affect the two default people
generateDues();
