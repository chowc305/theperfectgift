(function () {
  const giftResultPages = [
    "giftresults.html",
    "2giftresults.html",
    "3giftresults.html",
    "4giftresults.html",
  ];

  function getRandomGiftResultsPage() {
    const randomIndex = Math.floor(Math.random() * giftResultPages.length);
    return giftResultPages[randomIndex];
  }

  window.getRandomGiftResultsPage = getRandomGiftResultsPage;
})();
