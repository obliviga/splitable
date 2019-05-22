import getPeopleQuantity from './utils/getPeopleQuantity';

export default function generateDues() {
  $(document).ready(() => {
    const peopleQuantity = getPeopleQuantity();

    for (let i = 0; i < peopleQuantity; i += 1) {
      const index = i + 1;

      $(`.person${index}`).on('input', () => {
        let sum = 0;

        $(`.due${index}`).html($(`.person${index}`).val());

        $('[class*="due"]').each(
          function getSum() {
            sum += +$(this).text() || 0;
          },
        );

        $('#itemized-total').html(sum);
      });
    }
  });
}


// Call the function immediately, to affect the two default people
generateDues();
