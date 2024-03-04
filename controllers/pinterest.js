import { BaseController } from "./baseController";

class PintrestController extends BaseController {
    constructor() {
        super();
    }

    onMessageReceive(msg) {
        if (msg.Tag == "UpdatePinterest") {
            if (true) {
                let videos = document.getElementsByTagName('a');
                for (let kk = 0; kk < videos.length; kk++) {
                    if (videos[kk].getAttribute("class").includes("result-item")) {
                        this.sendMessage("PinterestTarget", "target", videos[kk].getAttribute("href"));
                    }
                }
            }
        } else if (msg.Tag == "LikeFollow") {
            this.sendMessage("DonePinterest", "target", "window.location.href");
            let vid = parseInt(Math.floor(Math.random() * 20) + 1);
            let counter = 0;
            let videos = document.getElementsByTagName('a');
            for (let kk = 0; kk < videos.length; kk++) {
                if (videos[kk].getAttribute("href") && videos[kk].getAttribute("href").includes("/pin/")) {
                    counter++;
                    if (counter == vid) {
                        videos[kk].click();

                        setTimeout(function () {
                            let username = window.location.href.split("/")[3];
                            let url = window.location.href;
                            let img = "https://instoo.com/logo.png";
                            let videos = document.getElementsByTagName('img');
                            let counter = 0;
                            for (let kk = 0; kk < videos.length; kk++) {
                                if (videos[kk].getAttribute("src") && videos[kk].getAttribute("src").includes("pinimg")) {
                                    counter++;
                                    if (counter == 2) {
                                        img = videos[kk].src;

                                        break;
                                    }
                                }
                            }

                            videos = document.getElementsByTagName('div');
                            for (let kk = 0; kk < videos.length; kk++) {
                                if (videos[kk].getAttribute("data-test-id") && videos[kk].getAttribute("data-test-id").includes("creator-profile-name")) {
                                    username = videos[kk].innerText;
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
                            console.log(msg_data);
                            this.sendMessage("DonePinterestData", "User", msg_data);

                            if (msg.story.StartPinterestFollow && msg.story.FollowedPoolPinterestSize < msg.story.MaxPinterestFollows) {
                                var buttons = document.getElementsByTagName('button');
                                for (var jj = 0; jj < buttons.length; jj++) {
                                    if (buttons[jj].innerText.includes("Follow") && !buttons[jj].innerText.includes("Following")) {
                                        buttons[jj].click();
                                        break;
                                    }
                                }
                                url = window.location.href;
                                msg_data = {
                                    url: url,
                                    username: username,
                                    img: img
                                };
                                this.sendMessage("DonePinterestFollow", "User", msg_data);
                            }

                            if (msg.story.StartPinterestLike && msg.story.LikedMediaPinterestSize < msg.story.MaxPinterestLikes) {
                                setTimeout(function () {
                                    let buttons = document.getElementsByTagName('div');
                                    for (var jj = 0; jj < buttons.length; jj++) {
                                        if (buttons[jj].getAttribute("class") && buttons[jj].getAttribute("class").includes("engagement-icon")) {
                                            buttons[jj].click();
                                            break;
                                        }
                                    }
                                    buttons = document.getElementsByTagName('button');
                                    for (let jj = 0; jj < buttons.length; jj++) {
                                        if (buttons[jj].getAttribute("aria-label") && buttons[jj].getAttribute("aria-label").includes("reaction")) {
                                            buttons[jj].click();
                                            break;
                                        }

                                    }
                                    let url = window.location.href;

                                    const msg_data = {
                                        url: url,
                                        username: username,
                                        img: img
                                    };

                                    this.sendMessage("DonePinterestLike", "User", msg_data);
                                }, 4000);
                            }
                        }, 5000);
                        break;
                    }
                }
            }
        }
    }

    onDocumentStart(comPortName, OnMessageReceive) {
        this.createComPort(comPortName, OnMessageReceive);
        if (window.location.href.includes("videos")) {
            window.scrollTo(0, document.body.scrollHeight);
            this.sendMessage("GetPinterest", "target", "");
        }
    }
}

//Runs when pinterest.com or pinterest.co.uk is loaded
const pinterest = new PintrestController();
$(document).ready(function () {
    pinterest.onDocumentStart("pinterest", pinterest.onMessageReceive);
});