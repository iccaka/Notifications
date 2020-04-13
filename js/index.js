$(document).ready(() => {

    class NotificationFactory {
        static getNotification(notificationData){
            let notificationType = notificationData.type;

            if(notificationType === "text"){
                let notificationTitle = notificationData.title;
                let notificationText = notificationData.text;
                let notificationTextFinal = notificationTitle + "<br>" + notificationText;
                let notificationExpires = notificationData.expires;
                let expires = notificationExpires;

                if(notificationExpires === -1){
                    expires = "";
                }
                else {
                    expires = formatNotificationExpires(expires);
                }

                let element = `
                    <div class="row justify-content-between notifications">
                        <div class="col-8 col-8 col-md-8 col-lg-8">
                            <span>${notificationTextFinal}</span>
                        </div>
                        <div class="col-8 col-8 col-md-2 col-lg-2">
                            <span>${expires}</span>
                        </div>
                    </div>
                `;

                return element;
            }
            if(notificationType === "bonus"){
                let notificationTitle = notificationData.title;
                let notificationRequirement = notificationData.requirement;
                let notificationTextFinal = notificationTitle + "<br>" + notificationRequirement;
                let notificationExpires = notificationData.expires;
                let expires = notificationExpires;

                if(notificationExpires === -1){
                    expires = "";
                }
                else {
                    expires = formatNotificationExpires(expires);
                }

                let element = `
                    <div class="row justify-content-between notifications">
                        <div class="col-8 col-8 col-md-8 col-lg-8">
                            <span>${notificationTextFinal}</span>
                        </div>
                        <div class="col-8 col-8 col-md-2 col-lg-2">
                            <span>${expires}</span>
                        </div>
                    </div>
                `;

                return element;
            }
            if(notificationType === "promotion"){
                let notificationTitle = notificationData.title;
                let notificationImage = notificationData.image;
                let notificationLink = notificationData.link;
                let notificationExpires = notificationData.expires;
                let expires = notificationExpires;

                if(notificationExpires === -1){
                    expires = "";
                }
                else {
                    expires = formatNotificationExpires(expires);
                }

                let element = `
                    <div class="row notifications">
                        <div class="col-8 col-8 col-md-2 col-lg-2">
                            <img src="${notificationImage}">
                        </div>
                        <div class="col-8 col-8 col-md-8 col-lg-8">
                            <span><a href="${notificationLink}" target="_blank">${notificationTitle}</a></span>
                        </div>
                        <div class="col-8 col-8 col-md-2 col-lg-2">
                            <span>${expires}</span>
                        </div>
                    </div>
                `;

                return element;
            }
        }
    }

    let DEFAULT_RESET_TIME = 1;

    let currentNotificationPool = new Set();
    let currentNotificationElementsPool = new Set();

    $("#notificationBucket").hide();
    $("#notificationHeading").click(toggleNotificationBucket);

    setInterval(checkNotifications, DEFAULT_RESET_TIME * 1000);
    setInterval(updateNotificationExpires, DEFAULT_RESET_TIME * 1000);

    function toggleNotificationBucket() {
        $( "#notificationBucket" ).toggle("blind", 500);
        $("#notificationCount").toggle("fade", 300);
    }

    function checkNotifications() {

        /* Let's just pretend
        that the data below is
        the actual data that
        the ajax call returns.
        (I named it 'snapshot')

        let obj = ` 
        [
            {
                "id": 1321,
                "type": "text",
                "title": "Mom",
                "text": "Get home honey",
                "expires": 12
            },
            {
                "id": 4322,
                "type": "bonus",
                "title": "You win a bonus!",
                "requirement": "Deposit $50 to win",
                "expires": 5
            },
            {
                "id": 5453,
                "type": "promotion",
                "image": "https://www.freeiconspng.com/uploads/leistungen-promotion-icon-png-0.png",
                "title": "%30 off on sports betting",
                "link": "https://www.google.com/"
            },
            {
                "id": 5236,
                "type": "text",
                "title": "Test notification",
                "text": "Test text notification",
                "expires": 5
            }
        ]`; */

        $.ajax({
            url: "test.com"
        }).done((snapshot)=>{
            let notifications = JSON.parse(snapshot);

            for (let notification in notifications){
                let currentNotification = notifications[notification];

                if(!containsNotification(currentNotificationPool, currentNotification.id)){
                    if(currentNotification.expires === undefined){
                        currentNotification.expires = -1;

                        currentNotificationPool.add(currentNotification);
                        let element = NotificationFactory.getNotification(currentNotification);

                        currentNotificationElementsPool.add(element);
                    }
                    else if(currentNotification.expires > 0){
                        currentNotificationPool.add(currentNotification);
                        let element = NotificationFactory.getNotification(currentNotification);

                        currentNotificationElementsPool.add(element);
                    }
                }
            }

            displayNotifications();
        });
    }

    function updateNotificationExpires(){
        currentNotificationElementsPool = new Set();
        let newCurrentNotificationPool = new Set();

        for(let notification of currentNotificationPool){
            if(notification.expires === -1){
                let updatedNotificationElement = NotificationFactory.getNotification(notification);

                newCurrentNotificationPool.add(notification);
                currentNotificationElementsPool.add(updatedNotificationElement);

                continue;
            }

            notification.expires -= DEFAULT_RESET_TIME;

            if(notification.expires > 0){
                let updatedNotificationElement = NotificationFactory.getNotification(notification);

                newCurrentNotificationPool.add(notification);
                currentNotificationElementsPool.add(updatedNotificationElement);
            }
        }

        currentNotificationPool = newCurrentNotificationPool;

        displayNotifications();
    }

    function displayNotifications(){
        $("#notificationBucket").empty();

        $("#notificationCount").text(currentNotificationElementsPool.size);

        for(let notification of currentNotificationElementsPool){
            $("#notificationBucket").append(notification);
        }
    }
    
    function containsNotification(notificationPool, notificationId){
        for(let notification of notificationPool){
            if(notification.id === notificationId){
                return true;
            }
        }

        return false;
    }

    function formatNotificationExpires(notificationExpires)
    {
        let hours = ~~(notificationExpires / 3600);
        let mins = ~~((notificationExpires % 3600) / 60);
        let secs = ~~notificationExpires % 60;

        let result = "";

        if (hours > 0) {
            result += "" + hours + ":" + (mins < 10 ? "0" : "");
        }

        result += "" + mins + ":" + (secs < 10 ? "0" : "");
        result += "" + secs;

        return result;
    }
});