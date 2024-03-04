import { BaseController } from "./baseController";
import { LinkedInViewHandler } from "../views/linkedin";

const linkedinViewHandler = new LinkedInViewHandler();

class LinkedinController extends BaseController {
    constructor() {
        super();
        this.result = "";
        this.target = "";
        this.completed = [];
        this.story = {};
    }

    onMessageReceive(msg) {
        if (msg.Tag == "LikeFollow") {
            target = msg.story.target;
            story = msg.story;
            linkedinViewHandler.scrollLike(10);
        }
    }
};

//Runs when linkedin.com is loaded
const linkedin = new LinkedinController();
$(document).ready(function () {
    linkedin.documentReady("linkedin", linkedin.onMessageReceive, 20)
});