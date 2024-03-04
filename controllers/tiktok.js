import { BaseController } from "./baseController";
import { TikTokDataHandler } from "../models/tiktok";

const tiktokData = new TikTokDataHandler();

class TikTokController extends BaseController {
    constructor() {
        super();
        tiktokData.saveTiktokSettings()
    }

    onMessageReceive(msg) {
        if (msg.Tag == "UpdateTikTok") {
            if (true) {
                let videos = document.getElementsByTagName('a');
                for (let kk = 0; kk < videos.length; kk++) {
                    if (videos[kk].getAttribute("class").includes("result-item")) {
                        this.sendMessage("TikTokTarget", "target", videos[kk].getAttribute("href"));
                    }
                }
            }
        } else if (msg.Tag == "LikeFollow") {
            this.sendMessage("DoneTikTok", "target", "window.location.href");
            let vid = parseInt(Math.floor(Math.random() * 6) + 1);
            let counter = 0;
            let videos = document.getElementsByTagName('a');
            for (let kk = 0; kk < videos.length; kk++) {
                if (videos[kk].getAttribute("class") && videos[kk].getAttribute("class").includes("video-feed-item")) {
                    counter++;
                    if (counter == vid) {
                        videos[kk].click();

                        setTimeout(function () {
                            let username = window.location.href.split("/")[3];
                            let url = window.location.href;
                            let img = "https://instoo.com/logo.png";
                            let videos = document.getElementsByTagName('a');
                            for (let kk = 0; kk < videos.length; kk++) {
                                if (videos[kk].getAttribute("class") && videos[kk].getAttribute("class").includes("user-avatar")) {
                                    console.log(videos[kk].firstElementChild.firstElementChild.src);
                                    img = videos[kk].firstElementChild.firstElementChild.src;
                                    break;
                                }
                            }
                            let msg_data = {
                                url: url,
                                username: username,
                                img: img,
                                website: "none",
                                twitter: "none",
                                sales: 0,
                                email: "none",
                                connected: "none"
                            };
                            this.sendMessage("DoneTikTokData", "User", msg_data);

                            if (msg.story.StartTikTokFollow && msg.story.FollowedPoolTikTokSize < msg.story.MaxTikTokFollows) {
                                let buttons = document.getElementsByTagName('button');
                                for (let jj = 0; jj < buttons.length; jj++) {
                                    if (buttons[jj].getAttribute("class").includes("follow") && !buttons[jj].innerText.includes("Following")) {
                                        buttons[jj].click();
                                        break;
                                    }

                                }
                                for (let kk = 0; kk < videos.length; kk++) {
                                    if (videos[kk].getAttribute("class") && videos[kk].getAttribute("class").includes("user-avatar")) {
                                        img = videos[kk].firstElementChild.firstElementChild.src;
                                        break;
                                    }
                                }
                                msg_data = {
                                    url: url,
                                    username: username,
                                    img: img
                                };
                                this.sendMessage("DoneTikTokFollow", "User", msg_data);
                            }

                            if (msg.story.StartTikTokLike && msg.story.LikedMediaTikTokSize < msg.story.MaxTikTokLikes) {
                                setTimeout(function () {
                                    let buttons = document.getElementsByTagName('div');
                                    for (let jj = 0; jj < buttons.length; jj++) {
                                        if (buttons[jj].getAttribute("class") && buttons[jj].getAttribute("class").includes("engagement-icon")) {
                                            buttons[jj].click();
                                            break;
                                        }
                                    }
                                    buttons = document.getElementsByTagName('span');
                                    for (let jj = 0; jj < buttons.length; jj++) {
                                        if (buttons[jj].getAttribute("class") && buttons[jj].getAttribute("class").includes("icons like")) {
                                            buttons[jj].click();
                                            break;
                                        }
                                    }
                                    let url = window.location.href;
                                    let username = window.location.href.split("/")[3];
                                    let img = "https://instoo.com/logo.png";
                                    let videos = document.getElementsByTagName('a');
                                    for (let kk = 0; kk < videos.length; kk++) {
                                        if (videos[kk].getAttribute("class") && videos[kk].getAttribute("class").includes("user-avatar")) {
                                            console.log(videos[kk].firstElementChild.firstElementChild.src);
                                            img = videos[kk].firstElementChild.firstElementChild.src;
                                            break;
                                        }
                                    }
                                    const msg_data = {
                                        url: url,
                                        username: username,
                                        img: img
                                    };
                                    this.sendMessage("DoneTikTokLike", "User", msg_data);
                                }, 4000);
                            }
                        }, 5000);
                        break;
                    }
                }
            }
        }
    }
}

//Runs when tiktok.com is loaded
const tiktok = new TikTokController();
$(document).ready(function () {
    tiktok.documentReady("tiktok", tiktok.onMessageReceive)
});