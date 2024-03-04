import { BaseModel } from "./models/baseModel";
import { BaseView } from "./views/baseView";
import { BaseController } from "./controllers/baseController";
import { FacebookViewHandler } from "./views/facebook";
import { InstagramViewHandler } from "./views/instagram";
import { LinkedInViewHandler } from "./views/linkedin";
import { PinterestViewHandler } from "./views/pinterest";
import { TiktokViewHandler } from "./views/tiktok";
import { TinderViewHandler } from "./views/tinder";
import { TwitterViewHandler } from "./views/twitter";
import { InstagramDataHandler } from "./models/instagram";
import { LinkedinDataHandler } from "./models/linkedin";

export const model = new BaseModel();
export const view = new BaseView();
export const controller = new BaseController();

export const facecbookView = new FacebookViewHandler();
export const instagramView = new InstagramViewHandler();
export const linkedinView = new LinkedInViewHandler();
export const pinterestView = new PinterestViewHandler();
export const tiktokView = new TiktokViewHandler();
export const tinderView = new TinderViewHandler();
export const twitterView = new TwitterViewHandler();

export const instagramData = new InstagramDataHandler();
export const linkedinData = new LinkedinDataHandler();


//Entry point for the extension/application
$(document).ready(function () {
    model.version = chrome.runtime.getManifest().version;
    controller.createComPort();
    view.init();
    model.init();
    tinderView.tinderInit();
    tiktokView.tiktokInit();
    pinterestView.pinterestInit();
    linkedinView.linkedinInit();
    instagramView.instagramInit();
    facecbookView.facebookInit();
    twitterView.twitterInit();
    controller.init();
});