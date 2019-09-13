import $ from 'jquery';

const date = new Date();
const yearsOfFriendship = date.getFullYear() - 2009;

// Appending years of friendship with Bryan to modal content
$('#yearsOfFriendship').append(yearsOfFriendship);
