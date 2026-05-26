/*-----------------------------------------------------------------------------/
/ Custom Theme JS
/-----------------------------------------------------------------------------*/

// Insert any custom theme js here...
var ur = window.location.href;
if(ur.includes('/pages/contact') || ur.includes('/pages/contact-us')){
  window.location.href = "/pages/free-estimate"
}