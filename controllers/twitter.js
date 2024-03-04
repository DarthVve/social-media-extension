import { BaseController } from "./baseController";
import { TwitterViewHandler } from "../views/twitter";

const twitterViewHandler = new TwitterViewHandler();

class TwitterController extends BaseController {
    constructor() {
        super();
        this.lastMsg = {};
    }

    onMessageReceive(msg) {
        this.lastMsg = msg;
        if (msg.Tag == "UpdateTwitter") {
            console.log(msg.story);
        } else if (msg.Tag == "LikeFollow") {
            twitterViewHandler.scrollLike(3);
        }
    }
}

//Runs when twitter.com is loaded
const twitter = new TwitterController();
$(document).ready(function () {
    twitter.documentReady("twitter", twitter.onMessageReceive)
});