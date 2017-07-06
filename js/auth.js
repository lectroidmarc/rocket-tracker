/**
 *
 */

firebase.auth().onAuthStateChanged(function (user) {
  var cardTitles = Array.from(document.querySelectorAll('.rocket .mdl-card__title-text') || []);
  cardTitles.forEach(title => {
    title.contentEditable = !!user;
  });

  document.querySelector('.login').classList.toggle('hidden', user);
  document.querySelector('.logout').classList.toggle('hidden', !user);
});

document.querySelector('.login').onclick = function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');

  firebase.auth().signInWithPopup(provider).then(function () {
    closeDrawer();
    showToastAlert('Successfully Logged In.');
  }).catch(function (error) {
    closeDrawer();
    showToastAlert(error.message);
  });
};

document.querySelector('.logout').onclick = function () {
  closeDrawer();
  firebase.auth().signOut().then(function () {
    showToastAlert('Successfully Logged Out.');
  }).catch(function (error) {
    showToastAlert(error.message);
  });
};
