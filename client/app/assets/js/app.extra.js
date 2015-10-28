$(function() {
  // Visual effect on refresh button
  $('body').on('click','.refresh-btn', function() {
    $(this).addClass('refreshing');
    setTimeout(function() {
      $('.refresh-btn').removeClass('refreshing');
    }, 1000);
  })

  $('body').on('click','.sport-item', function() {
    $('.refresh-btn').addClass('refreshing');
    setTimeout(function() {
      $('.refresh-btn').removeClass('refreshing');
    }, 1000);
  })
})