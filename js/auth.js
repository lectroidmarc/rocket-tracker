/**
 *
 */

firebase.auth().onAuthStateChanged(function (user) {
  var cardTitles = document.querySelectorAll('.rocket .mdl-card__title-text');
  Array.prototype.forEach.call(cardTitles, function (title) {
    title.contentEditable = (user) ? true : false;
  });

  document.querySelector('.login').classList.toggle('hidden', user);
  document.querySelector('.logout').classList.toggle('hidden', !user);
});

document.querySelector('.login').onclick = function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');

  firebase.auth().signInWithPopup(provider).then(function(result) {
    document.body.querySelector('.mdl-layout__obfuscator.is-visible').click();
    showToastAlert('Successfully Logged In.');
  }).catch(function (error) {
    document.body.querySelector('.mdl-layout__obfuscator.is-visible').click();
    showToastAlert(error.message);
  });
};

document.querySelector('.logout').onclick = function () {
  document.body.querySelector('.mdl-layout__obfuscator.is-visible').click();
  firebase.auth().signOut().then(function() {
    showToastAlert('Successfully Logged Out.');
  }).catch(function (error) {
    showToastAlert(error.message);
  });
};
