import getPeopleQuantity from './getPeopleQuantity';

export default function generateDues() {
  $(document).ready(() => {
    const peopleQuantity = getPeopleQuantity();

    for (let i = 0; i < peopleQuantity; i += 1) {
      $(`.item${i}`).on('input', () => {
        let sum = 0;

        $(`.due${i}`).html($(`.item${i}`).val());

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
