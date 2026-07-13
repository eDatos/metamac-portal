$(function() {
  window.keydown = {};
  
  function keyName(event) {
    return jQuery.hotkeys.specialKeys[event.which] ||
      String.fromCharCode(event.which).toLowerCase();
  }
  
  $(document).on("keydown", function(event) {
    keydown[keyName(event)] = true;
  });
  
  $(document).on("keyup", function(event) {
    keydown[keyName(event)] = false;
  });
});
