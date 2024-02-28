export class ContentHandler {
    constructor() {
        this.comPort;
        this.sharedData = null;
    }

    scrollTop(starter) {
        if (starter > 0) {
            window.scrollTo(0, document.body.scrollHeight);
            setTimeout(function () {
                scrollTop(starter - 1)
            }, 300);
        }
    }

    createComPort(comPortName, OnMessageReceive) {
        this.comPort = chrome.runtime.connect({
            name: comPortName
        });
        this.comPort.onMessage.addListener(OnMessageReceive);

        window.addEventListener("message", function (event) {
            // We only accept messages from ourselves
            if (event.source != window) return;

            if (event.data.Tag && (event.data.Tag == "SharedData")) {
                this.sharedData = event.data.SharedData;
            }
        }, false);
    }

    documentReady(comPortName, OnMessageReceive, numScrolls) {
        this.createComPort(comPortName, OnMessageReceive);

        if (window.location.href.includes("tag")) {
            window.scrollTo(0, document.body.scrollHeight);
            this.scrollTop(numScrolls ? numScrolls : 0);
        }
    }

    sendMessage(tag, msgTag, msg) {
        let sendObj = {
            "Tag": tag
        };
        sendObj[msgTag] = msg;
        this.comPort.postMessage(sendObj);
    }
}