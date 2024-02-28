import { ContentHandler } from "./content_main.js";

class Linkedin extends ContentHandler {
    constructor() {
        super();
        this.result = "";
        this.target = "";
        this.completed = [];
        this.story = {};
    }

    scrollLike(num) {
        window.scrollBy(0, 300);

        let counter = 0;
        let vid = parseInt(Math.floor(Math.random() * 6) + 1);
        let username = "none";
        let email = "none";
        let twitter = "none";
        let website = "none";
        let birthday = "none";
        let connected = "none";
        let profile = "none";
        let img = "https://instoo.com/logo.png";
        let links = document.getElementsByTagName('span');

        for (let kk = 0; kk < links.length; kk++) {
            if (links[kk] && links[kk].getAttribute("class") && (links[kk].getAttribute("class").includes("entity-result__title-text ")) && !links[kk].innerHTML.includes("<img") && !(this.completed.includes(links[kk].getAttribute("href")))) {
                counter++;

                if (counter == vid) {
                    this.completed.push(links[kk].getAttribute("href"));
                    links[kk].children[0].click();

                    if (num > 0) {
                        $('#contact').html(this.result);
                        setTimeout(function () {
                            if (this.story.StartLinkedinFollow) {
                                let links = document.getElementsByTagName('button');

                                for (let kk = 0; kk < links.length; kk++) {
                                    if (links[kk] && links[kk].getAttribute("aria-label") && links[kk].getAttribute("data-control-name") && links[kk].getAttribute("data-control-name").includes("connect") && (links[kk].getAttribute("aria-label").includes("Connect"))) {
                                        links[kk].click()
                                        links[kk].click();

                                        setTimeout(function () {
                                            let links = document.getElementsByTagName('button');
                                            for (let kk = 0; kk < links.length; kk++) {
                                                if (links[kk] && links[kk].getAttribute("aria-label") && (links[kk].getAttribute("aria-label").includes("Send now"))) {
                                                    links[kk].click()
                                                }
                                            }
                                        }, 2000);

                                        const msg_data = {
                                            target: this.target,
                                            username: username,
                                            url: profile,
                                            img: img
                                        };
                                        this.sendMessage("DoneLinkedinFollow", "User", msg_data);
                                        break;
                                    }
                                }
                            }
                        }, 3000);

                        if (this.story.StartLinkedinLike || story.StartLinkedinFollow) {
                            setTimeout(function () {
                                let links = document.getElementsByTagName('a');
                                for (let kk = 0; kk < links.length; kk++) {
                                    if (links[kk] && links[kk].getAttribute("data-control-name") && (links[kk].getAttribute("data-control-name") == "contact_see_more")) {
                                        links[kk].click();
                                        old_link = links[kk];

                                        setTimeout(function () {
                                            let links = document.getElementsByTagName('div');
                                            for (let kk = 0; kk < links.length; kk++) {
                                                if (links[kk] && links[kk].getAttribute("class") && (links[kk].getAttribute("class").includes("section-info"))) {
                                                    if (!this.result.includes(links[kk].outerHTML)) {
                                                        this.result += links[kk].outerHTML;
                                                        let links2 = document.getElementsByTagName('h1');

                                                        for (let kk = 0; kk < links2.length; kk++) {
                                                            if (links2[kk] && links2[kk].getAttribute("id") && (links2[kk].getAttribute("id").includes("pv-contact-info"))) {
                                                                username = links2[kk].innerText;
                                                            }
                                                        }

                                                        links2 = document.getElementsByTagName('section');

                                                        for (let kk = 0; kk < links2.length; kk++) {
                                                            if (links2[kk] && links2[kk].getAttribute("class") && (links2[kk].getAttribute("class").includes("vanity"))) {
                                                                profile = links2[kk].innerText;
                                                            }
                                                        }

                                                        links2 = document.getElementsByTagName('section');

                                                        for (let kk = 0; kk < links2.length; kk++) {
                                                            if (links2[kk] && links2[kk].getAttribute("class") && (links2[kk].getAttribute("class").includes("email"))) {
                                                                email = links2[kk].innerText;
                                                            }
                                                        }

                                                        links2 = document.getElementsByTagName('section');

                                                        for (let kk = 0; kk < links2.length; kk++) {
                                                            if (links2[kk] && links2[kk].getAttribute("class") && (links2[kk].getAttribute("class").includes("birthday"))) {
                                                                birthday = links2[kk].innerText;
                                                            }
                                                        }

                                                        links2 = document.getElementsByTagName('section');

                                                        for (let kk = 0; kk < links2.length; kk++) {
                                                            if (links2[kk] && links2[kk].getAttribute("class") && (links2[kk].getAttribute("class").includes("connected"))) {
                                                                connected = links2[kk].innerText;
                                                            }
                                                        }

                                                        links2 = document.getElementsByTagName('section');

                                                        for (let kk = 0; kk < links2.length; kk++) {
                                                            if (links2[kk] && links2[kk].getAttribute("class") && (links2[kk].getAttribute("class").includes("twitter"))) {
                                                                twitter = links2[kk].innerText;
                                                            }
                                                        }

                                                        links2 = document.getElementsByTagName('section');

                                                        for (let kk = 0; kk < links2.length; kk++) {
                                                            if (links2[kk] && links2[kk].getAttribute("class") && (links2[kk].getAttribute("class").includes("website"))) {
                                                                website = links2[kk].innerText;
                                                            }
                                                        }

                                                        const msg_data = {
                                                            target: this.target,
                                                            sales: 0,
                                                            email: email,
                                                            html: "",
                                                            username: username,
                                                            birthday: birthday,
                                                            connected: connected,
                                                            twitter: twitter,
                                                            url: profile,
                                                            img: img
                                                        };

                                                        this.sendMessage("LinkedinLead", "User", msg_data);
                                                        window.history.back(2);
                                                    }

                                                    setTimeout(function () {
                                                        window.history.back(2);
                                                        if (num > 0) {
                                                            setTimeout(function () {
                                                                console.log("RESTART");
                                                                scrollLike(num - 1);
                                                            }, 10000);
                                                        }
                                                    }, 7000);
                                                }
                                            }
                                        }, 7000);
                                    }
                                }
                            }
                                , 7000);
                        }
                        break;
                    }
                }
            }
        }
    }

    onMessageReceive(msg) {
        if (msg.Tag == "LikeFollow") {
            target = msg.story.target;
            story = msg.story;
            this.scrollLike(10);
        }
    }
};

//Runs when linkedin.com is loaded
let linkedin = new Linkedin();
$(document).ready(function () {
    linkedin.documentReady("linkedin", linkedin.onMessageReceive, 20)
});