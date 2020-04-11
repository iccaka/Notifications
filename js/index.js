$(document).ready(() => {

    $("#notificationBucket").hide();

    $("#notificationHeading").click(toggleNotificationBucket);

    function toggleNotificationBucket() {
        $( "#notificationBucket" ).toggle("blind", 500);

    }

    function loadNotifications() {

    }
});