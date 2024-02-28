import { ContentHandler } from "./content_main";

class Facebook extends ContentHandler {
    constructor() {
        super();
    }

    scrollLike(num) {
        let t1 = parseInt(Math.floor(Math.random() * 30000) + 1000);

        setTimeout(function () {
            window.scrollTo(0, document.body.scrollHeight);
            let total = 0;
            let videos = document.getElementsByTagName('div');

            for (let kk = 0; kk < videos.length; kk++) {
                if (videos[kk] && videos[kk].getAttribute("aria-label") && videos[kk].getAttribute("aria-label").includes("Add Friend")) {
                    total++;
                }
            }

            let counter = 0;
            let vid = parseInt(Math.floor(Math.random() * total) + 1);

            for (let kk = 0; kk < videos.length; kk++) {
                if (videos[kk] && videos[kk].getAttribute("aria-label") && videos[kk].getAttribute("aria-label").includes("Add Friend")) {
                    counter++;
                    if (vid == counter) {
                        videos[kk].click();
                        const msg_data = {
                            url: "https://facebook.com/" + videos[kk].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].getAttribute("href"),
                            username: videos[kk].parentNode.parentNode.parentNode.parentNode.parentNode.children[0].innerText,
                            img: videos[kk].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.children[0].children[0].children[0].children[0].children[0].children[0].children[1].children[0].getAttribute("xlink:href")
                        };
                        this.sendMessage("DonefacebookFollow", "User", msg_data);
                        window.scrollTo(0, document.body.scrollHeight);
                        break;
                    }
                }
            }

            if (num > 0) { scrollLike(num - 1) }
        }, t1);
    }

    onMessageReceive(msg) {
        if (msg.Tag == "Updatefacebook") {
            console.log(msg.story);
        } else if (msg.Tag == "LikeFollow") {
            window.scrollTo(0, document.body.scrollHeight);
            if (msg.story.StartfacebookFollow && msg.story.FollowedPoolfacebookSize < msg.story.MaxfacebookFollows) {
                scrollLike(5);
            }
        }
    }
}

//Runs when facebook.com is loaded
let facebook = new Facebook();
$(document).ready(function () {
    facebook.documentReady("facebook", facebook.onMessageReceive)
});