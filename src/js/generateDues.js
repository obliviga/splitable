import getPeopleQuantity from './utils/getPeopleQuantity';

export default function generateDues() {
  $(document).ready(() => {
    const peopleQuantity = getPeopleQuantity();

    // For every person
    for (let i = 0; i < peopleQuantity; i += 1) {
      // Define the index to be plus 1
      const index = i + 1;

      // When the appropriate input changes
      $(`.person${index}`).on('input', () => {
        let sum = 0;

        // Change what is due for each person, based on the input's value
        $(`.due${index}`).html($(`.person${index}`).val());

        // Get all class names with the word "due" in it and store the sum
        $('[class*="due"]').each(
          function getSum() {
            sum += +$(this).text() || 0;
          },
        );

        // Apply the stored sum
        $('#itemized-total').html(sum);
      });
    }
  });
}

// Call the function immediately, to affect the two default people
generateDues();
