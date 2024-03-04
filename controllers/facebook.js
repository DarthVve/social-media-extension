import { BaseController } from "./baseController";
import { FacebookViewHandler } from "../views/facebook";

const facebookViewHandler = new FacebookViewHandler();

class FacebookController extends BaseController {
    constructor() {
        super();
    }



    onMessageReceive(msg) {
        if (msg.Tag == "Updatefacebook") {
            console.log(msg.story);
        } else if (msg.Tag == "LikeFollow") {
            window.scrollTo(0, document.body.scrollHeight);
            if (msg.story.StartfacebookFollow && msg.story.FollowedPoolfacebookSize < msg.story.MaxfacebookFollows) {
                facebookViewHandler.scrollLike(5);
            }
        }
    }
}

//Runs when facebook.com is loaded
const facebook = new FacebookController();
$(document).ready(function () {
    facebook.documentReady("facebook", facebook.onMessageReceive)
});