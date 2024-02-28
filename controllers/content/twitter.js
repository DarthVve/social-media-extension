import { ContentHandler } from "./content_main.js";

class Twitter extends ContentHandler {
    constructor() {
        super();
        this.lastMsg = {};
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    scrollLike(num) {
        window.scrollBy(0, 600);

        let links = document.getElementsByTagName('div');

        if (num > 0) {
            let timer = this.getRandomInt(50000, 120000);
            setTimeout(function () {
                this.scrollLike(num - 1)
            }
                , timer);
        }
        for (let kk = 0; kk < links.length; kk++) {
            if (links[kk] && links[kk].getAttribute("aria-label") && (links[kk].getAttribute("aria-label").includes("Like")) && links[kk].getAttribute("data-testid") && links[kk].getAttribute("data-testid") == "like") {

                links[kk].parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild.focus();

                let url = window.location.href;
                let username = links[kk].parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild.getAttribute("href").split("/").join("");
                let img = links[kk].parentNode.parentNode.parentNode.parentNode.parentNode.firstElementChild.firstElementChild.firstElementChild.firstElementChild.children[0].children[1].children[0].children[1].getAttribute("src");
                const msg_data = {
                    url: url,
                    username: username,
                    img: img
                };

                if (this.lastMsg.story.StartTwitterLike) {
                    links[kk].click();
                    this.sendMessage("DoneTwitterLike", "User", msg_data);
                }

                setTimeout(function () {
                    links[kk].parentNode.parentNode.children[1].children[0].click();
                    setTimeout(function () {
                        let links2 = document.getElementsByTagName('div');//tweetButton testid
                        for (let kk = 0; kk < links2.length; kk++) {
                            if (links2[kk].getAttribute("testid") && links2[kk].getAttribute("testid").includes("tweetButton") && this.lastMsg.story.StartTwitterFollow) {
                                links2[kk].firstElementChild.firstElementChild.firstElementChild.click();
                                this.sendMessage("DoneTwitterRetweet", "User", msg_data);
                            }
                        }

                        links2 = document.getElementsByTagName('span');//tweetButton testid
                        for (let kk = 0; kk < links2.length; kk++) {
                            if (links2[kk].innerHTML.includes("Retweet") && this.lastMsg.story.StartTwitterFollow) {
                                console.log("try rewtweet");
                                links2[kk].click();
                                this.sendMessage("DoneTwitterRetweet", "User", msg_data);
                            }
                        }
                    }, 5000);

                    setTimeout(function () {
                        let links2 = document.getElementsByTagName('span');//tweetButton testid
                        for (let kk = 0; kk < links2.length; kk++) {
                            if (links2[kk].innerText.includes("Retweet") && this.lastMsg.story.StartTwitterFollow) {
                                links2[kk].click();
                                this.sendMessage("DoneTwitterRetweet", "User", msg_data);
                            }
                        }
                    }, 5000);
                }, 1000);
                break;
            }
        }
    }

    onMessageReceive(msg) {
        this.lastMsg = msg;
        if (msg.Tag == "UpdateTwitter") {
            console.log(msg.story);
        } else if (msg.Tag == "LikeFollow") {
            this.scrollLike(3);
        }
    }
}

//Runs when twitter.com is loaded
let twitter = new Twitter();
$(document).ready(function () {
    twitter.documentReady("twitter", twitter.onMessageReceive)
});