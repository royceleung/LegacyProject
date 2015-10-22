$(function() {

  $.get( "/userinfo", function( data ) {
    console.log(data);
  });

$('button').on('click', function() {
  console.log("click");
    var post = { "name": "Greenfield"};

  $.post( "/userinfo", post, function( data ) {
    console.log(data);
  });
})



});