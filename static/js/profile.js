$('.double-editable').on('dblclick', function() {
  $(this).attr('readonly', false);
  $(this).removeClass('border-0');
});

$('.double-editable').on('focusout', function() {
  $(this).attr('readonly', true);
  $(this).addClass('border-0');
});