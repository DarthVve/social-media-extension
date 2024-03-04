import { BaseController } from "./baseController";

class TinderController extends BaseController {
    constructor() {
        super();
    }

    onMessageReceive(msg) {
        if (msg.Tag == "UpdateTinder") {

        } else if (msg.Tag == "LikeFollow") {
            if (msg.story.StartTinderLike && msg.story.LikedMediaTinderSize < msg.story.MaxTinderLikes) {
                setTimeout(function () {
                    let username;
                    let img;
                    let span = document.getElementsByTagName('span');
                    for (let kk = 0; kk < span.length; kk++) {
                        if (span[kk].getAttribute("itemprop") == "name") {
                            username = span[kk].innerText;
                        }
                    }

                    span = document.getElementsByTagName('div');
                    for (let kk = 0; kk < span.length; kk++) {
                        if (span[kk].getAttribute("aria-label") == username && span[kk].getAttribute("style")) {
                            img = span[kk].getAttribute("style").split('"')[1];
                        }
                    }
                    const msg_data = { url: "tinder.com", username: username, img: img };
                    let buttons = document.getElementsByTagName('button');
                    for (let kk = 0; kk < buttons.length; kk++) {
                        //Super Like
                        if (buttons[kk].innerHTML.includes("Like") && !buttons[kk].innerHTML.includes("Super Like")) {
                            buttons[kk].click();
                            console.log(buttons[kk]);
                            break;
                        }
                    }

                    this.sendMessage("DoneTinderLike", "User", msg_data);
                    setTimeout(function () {
                        let buttons = document.getElementsByTagName('button');
                        for (let kk = 0; kk < buttons.length; kk++) {
                            //Super Like
                            if (buttons[kk].innerText.includes("NO THANKS")) {
                                buttons[kk].click();
                                break;
                            }
                        }
                    }, 5000)
                }, 4000);
            }
        }
    }
}

//Runs when tinder.com is loaded
const tinder = new TinderController();
$(document).ready(function () {
    tinder.documentReady("tinder", tinder.onMessageReceive, 20)
});