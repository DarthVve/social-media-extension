import {
    view, model, facecbookView, instagramView, linkedinView, pinterestView, tiktokView, tinderView, twitterView, instagramData, linkedinData
} from "..";
import { Utils } from "../service-workers/utils";
import { User } from "../models/baseModel";

const utils = new Utils();

export class BaseController {
    constructor() {
        super();
        this.access_token;
        this.comPort;
        this.postedInst = false;
        this.sharedData = null;
        this.start_license = 0;
    }

    parseLicense(license) {
        const TRIAL_PERIOD_DAYS = 300;
        this.paid_sub = true;
        let licenseStatus;

        if (license.result && license.accessLevel == "FULL") {
            this.start_license = parseInt(license.createdTime, 10);
            view.parseLicenseView();
            licenseStatus = "Full";
        } else if (license.result && license.accessLevel == "FREE_TRIAL") {
            this.start_license = parseInt(license.createdTime, 10);

            let daysAgoLicenseIssued = Date.now() - parseInt(license.createdTime, 10);
            daysAgoLicenseIssued = daysAgoLicenseIssued / 1000 / 60 / 60 / 24;
            if (daysAgoLicenseIssued <= TRIAL_PERIOD_DAYS) {
                window.localStorage.setItem('daysLeftInCGTrial', TRIAL_PERIOD_DAYS - daysAgoLicenseIssued);

                $("#upgrade").hide();
                licenseStatus = "Free";
            } else {
                licenseStatus = "None";
            }
        } else {
            $("#upgrade").show();
            licenseStatus = "None";
        }

        if (license.createdTime != null) {
            this.start_license = parseInt(license.createdTime, 10);
        }
        return licenseStatus;
    }

    onLicenseFetched(status, response) {
        let licenseStatus = "";
        if (status === 200 && response) {
            response = JSON.parse(response);
            licenseStatus = parseLicense(response);
        } else {
            licenseStatus = "unknown";
        }
        if (licenseStatus) {
            if (licenseStatus === "Full") {
                window.localStorage.setItem('instooislicensed', 'true');
                view.extensionIconSettings({
                    color: [0, 0, 0, 0]
                }, "", "Instoo is enabled.");
            } else if (licenseStatus === "None") {
                view.extensionIconSettings({
                    color: [0, 0, 0, 0]
                }, "", "Instoo is enabled.");

            } else if (licenseStatus === "Free") {
                window.localStorage.setItem('instooislicensed', 'true');
                view.extensionIconSettings({
                    color: [255, 0, 0, 0]
                }, "", window.localStorage.getItem('daysLeftInappnameTrial') + " days left in free trial.");
            } else if (licenseStatus === "unknown") {
                $("#purchase").hide();
                window.localStorage.setItem('instooislicensed', 'false');
                view.extensionIconSettings({
                    color: [0, 0, 0, 0]
                }, "", "Instoo is enabled.");
            }
        }
        window.localStorage.setItem('appnameLicenseCheckComplete', 'true');
    }

    xhrWithAuth(method, url, interactive, callback) {
        let retry = true;

        function requestStart() {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.access_token);
            xhr.onreadystatechange = function (oEvent) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 401 && retry) {
                        retry = false;
                        chrome.identity.removeCachedAuthToken({
                            'token': this.access_token
                        },
                            getToken);
                    } else if (xhr.status === 200) {
                        callback(null, xhr.status, xhr.response);
                    }
                }
                try {
                    xhr.send();
                } catch (e) {
                    console.error(e);
                }
            }
        }

        function getToken() {
            chrome.identity.getAuthToken({
                interactive: interactive
            }, function (token) {
                if (chrome.runtime.lastError) {
                    callback(chrome.runtime.lastError);
                    return;
                }
                this.access_token = token;
                requestStart();
            });
        }

        getToken();
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
            view.scrollTop(numScrolls ? numScrolls : 0);
        }
    }

    sendMessage(tag, msgTag, msg) {
        let sendObj = {
            "Tag": tag
        };
        sendObj[msgTag] = msg;
        this.comPort.postMessage(sendObj);
    }

    setFollowValue(value) {
        this.sendMessage("SetFollowValue", "Value", value);
    }

    setCommentValue(value) {
        this.sendMessage("SetCommentValue", "Value", value);
    }

    setLikeValue(value) {
        this.sendMessage("SetLikeValue", "Value", value);
    }

    setStoryValue(value) {
        this.sendMessage("SetStoryValue", "Value", value);
    }

    setUnfollowValue(value) {
        this.sendMessage("SetUnfollowValue", "Value", value);
    }

    whitelistFollowings(start) {
        this.sendMessage("WhitelistFollowings", "Start", start);
    }

    newWhitelistUserSearch(input) {
        let text = $(input).val().toLowerCase();
        let request = {};
        request.Text = text;
        request.Count = 20;
        this.sendMessage("RequestFilteredFollowings", "Request", request);
    }

    updateFollowers(status) {
        model.my_followers = this.my_followers.concat(status);
        this.sendMessage("SendMyFollowers", "followers", my_followers);
    }

    getFollowers(mode) {
        if (model.currentUser && model.currentUser.username) {
            $(".img-current-user").attr("src", model.currentUser.user_pic_url);
            $(".img-current-user").show();

            if (model.gotAnalytics == false) {
                if (paid_sub) {
                    limits = 1000;
                }

                let date = new Date();
                let date_num = Date.parse(date);
                date_num = Math.floor(date_num / (1000 * 60 * 60));

                if (follow_count_num != 0) {
                    const data = {
                        followers: model.follow_count_num,
                        hour: date_num,
                        user_id: model.currentUser.user_id,
                        mode: mode
                    };
                    this.sendMessage("PostStats", "data", data);
                }
            }
        }
    }

    resetSettings() {
        this.sendMessage("ResetSettings", "", "");
    }

    postCurrentUser(status) {
        if (typeof model.currentUser != "undefined" && model.currentUser.username != status.CurrentUser.username && status.CurrentUser.username.length > 0) {
            this.sendMessage("LoadAccount", "account", status.CurrentUser.username);

        }
        model.currentUser = status.CurrentUser;

        if (model.currentUser.username.length > 0 && this.postedInst == false) {
            this.postedInst = true;
            model.user_email = $("#email").attr("name");
            model.user_plan = $("#plan").attr("name");

            $.post('https://instoo.com/user/postInst', {
                email: user_email,
                username: model.currentUser.username
            },
                function (returnedData) {
                    if (returnedData && returnedData.length > 1 && user_plan != "lifetime") {
                        view.setValues();
                    }
                });
        }
    }

    updateStatus(status) {
        view.loadAccount(status);
        model.updateStats(status);

        if (emailed == false && follow_count_num < 1000 && follow_count_num != 0) {
            view.setSpeed(2);
        }

        if (emailed == false && following_count_num < 1000 && following_count_num != 0) {
            view.setSpeed(2);
        }

        if (emailed == false && following_count_num < 200 && following_count_num != 0) {
            view.setSpeed(8);
            alert("Instoo has detected you have a smaller account, following under 200 users(meaning users you follow). Please pause Instoo and manually follow over 200, since Instoo allows medium(4x faster speeds) after 200. You should post photos regularly, and use the account by liking/following until you pass 200 followers and following. This takes most users a few days. Then it takes most users 1-2 months on medium mode to reach 1,000 followers, which allows fast mode. Contact the live chat to request target research from our account manager to help start. ");
            view.setValues();
            if (model.emailed === false) {
                model.emailed = true;
            }
        }

        if (emailed == false && follow_count_num < 200 && follow_count_num != 0) {
            view.setSpeed(8);
            alert(" Instoo has detected you have a smaller account with under 200 followers. Please pause Instoo and manually raise your followers over 200, since Instoo allows medium(4x faster speeds) after 200. You should post photos regularly, and use the account by liking/following until you pass 200 followers. This takes most users a few days. Then it takes most users 1-2 months on medium mode to reach 1,000 followers, which allows fast mode. Contact the live chat to request target research from our account manager to help start. ");
            view.setValues();
            if (model.emailed === false) {
                model.emailed = true;
            }
        }

        if (status.UserPool.length > 1000 || status.MediaPool.length > 1000) {
            this.sendMessage("ClearMemory", "story", "");
        }

        dashboardMode == 0 ? instagramView.setMode(status) : dashboardMode == 1 ? tiktokView.setMode(status) : dashboardMode == 2 ? twitterView.setMode(status) : dashboardMode == 3 ? tinderView.setMode(status) : dashboardMode == 5 ? linkedinView.setMode(status) : dashboardMode == 6 ? pinterestView.setMode(status) : dashboardMode == 7 ? facecbookView.setMode(status) : null;

        if (status.CurrentUser) {
            this.postCurrentUser(status);
        }

        $("#accounts").val(CurrentUser.username);

        if (model.started == false) {
            $("#errors").html("");
            model.user_plan = "lifetime";
            if (status.CurrentUser.user_id) {
                model.setChart();
            }
        }

        model.started = true;
        if (status.hoursLeft > 0) {
            model.activityUpdate(status);
        } else {
            view.setValues();
            this.sendMessage("loadLocal", "Database", "obj");
            this.getFollowers();
        }
        view.updateCollectJobStatus(status.AccountTargets);
        view.displayLimits(status);
    }

    updateMediaStatus() {
        if (model.mode === "crm") {
            instagramData.messageListener();
            linkedinData.messageListener();
        } else {
            model.mode === "instagram" ? instagramView.instagramUpdateMedia() :
                model.mode === "tiktok" ? tiktokView.tiktokUpdateMedia() :
                    model.mode === "twitter" ? twitterView.twitterUpdateMedia() :
                        model.mode === "tinder" ? tinderView.tinderUpdateMedia() :
                            model.mode === "linkedin" ? linkedinView.linkedinUpdateMedia() :
                                model.mode === "pinterest" ? pinterestView.pinterestUpdateMedia() :
                                    model.mode === "facebook" ? facecbookView.facbookupdateMedia() : null;
        }
    }

    onMessageReceiveIndex(msg) {
        if (msg.Tag == "UserFollowComplete") {
            view.onTableActions("#follow-block", false, msg.User);
        } else if (msg.Tag == "ReloadCharts") {
            view.emptyTable("#crm-table");
            model.html = "<br><br><table style='  border: 1px solid black; padding:10px; width:100%;'><tr><td></td><td>Contact</td><td>Email</td><td>Sales</td><td>Target</td><td>Website</td><td>Twitter</td><td>Birthday</td><td>Connected</td></tr>";
            instagramData.messageListener();
            linkedinData.messageListener();
            model.html += "</table><script>function editInstaConnected(num){ window.postMessage({mode: 'Instaconnected' ,edit: num} , '*');} function editInstaBirthday(num){ window.postMessage({mode: 'Instabirthday' ,edit: num} , '*');}function editInstaTwitter(num){ window.postMessage({mode: 'Instatwitter' ,edit: num} , '*');} function editInstaWebsite(num){ window.postMessage({mode: 'Instawebsite' ,edit: num} , '*');} function editInstaTarget(num){ window.postMessage({mode: 'Instatarget' ,edit: num} , '*');} function editInstaSales(num){ window.postMessage({mode: 'Instasales' ,edit: num} , '*');}function editInstaEmail(num){ window.postMessage({mode: 'Instaemail' ,edit: num} , '*');}function editConnected(num){ window.postMessage({mode: 'connected' ,edit: num} , '*');} function editBirthday(num){ window.postMessage({mode: 'birthday' ,edit: num} , '*');}function editTwitter(num){ window.postMessage({mode: 'twitter' ,edit: num} , '*');} function editWebsite(num){ window.postMessage({mode: 'website' ,edit: num} , '*');} function editTarget(num){ window.postMessage({mode: 'target' ,edit: num} , '*');} function editSales(num){ window.postMessage({mode: 'sales' ,edit: num} , '*');}function editEmail(num){ window.postMessage({mode: 'email' ,edit: num} , '*');}</script>";
            view.injectHTML(model.html, "#crm-table");
            view.emptyTable("#target-table");
            let html_target = "<br><br><table style='  border: 1px solid black; padding:10px; width:100%;'><tr><td>Target</td><td>Sales</td><td>Leads</td><td>Gained Followers</td></tr>";
            for (var key in model.target_dic) {
                if (model.target_dic.hasOwnProperty(key)) {
                    html_target += "<tr><td>" + key + "</td><td>" + model.target_dic[key].sales + "</td><td> " + model.target_dic[key].leads + "</td><td>" + model.target_dic[key].connected + "</td></tr>";
                }

            }
            html_target += "</table>";
            view.injectHTML(html_target, "#target-table");
        } else if (msg.Tag == "setLanguage") {
            view.prependError("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Instoo has detected that the langauge at instagram.com is not set to English. Please follow these steps: <br>1) Click your profile picture in the top right corner, then click Profile. <br>2) Click Edit Profile.<br>3) Click Language at the very bottom of the page and select a new language.<br>4) Select English. It's in small gray text on the last line of the page to make it easy.</div>");
        } else if (msg.Tag == "UserFollowCompleteTikTok") {
            view.onTableActions("#follow-block-tiktok", false, msg.User);
        } else if (msg.Tag == "UserFollowCompletefacebook") {
            view.onTableActions("#follow-block-facebook", false, msg.User);
        } else if (msg.Tag == "UserFollowCompletePinterest") {
            view.onTableActions("#follow-block-pinterest", false, msg.User);
        } else if (msg.Tag == "UserFollowCompleteLinkedin") {
            view.onTableActions("#follow-block-linkedin", false, msg.User);
        } else if (msg.Tag == "RefreshPage") {
            window.location.reload(true);
        } else if (msg.Tag == "UserFollowCompleteTwitter") {
            view.onTableActions("#follow-block-twitter", false, msg.User);
        } else if (msg.Tag == "UserLikeCompleteTikTok") {
            view.onTableActions("#like-tiktok-block", false, msg.User);
        } else if (msg.Tag == "UserLikeCompletefacebook") {
            view.onTableActions("#like-facebook-block", false, msg.User);
        } else if (msg.Tag == "UserLikeCompletePinterest") {
            view.onTableActions("#like-pinterest-block", false, msg.User);
        } else if (msg.Tag == "UserLikeCompleteLinkedin") {
            view.onTableActions("#like-linkedin-block", false, msg.User);
        } else if (msg.Tag == "UserLikeCompleteTinder") {
            view.onTableActions("#like-tinder-block", false, msg.User);
        } else if (msg.Tag == "UserLikeCompleteTwitter") {
            view.onTableActions("#like-twitter-block", false, msg.User);
        } else if (msg.Tag == "DispatchFollowStatus") {
            view.updateFollowStatus(msg.AllUsers);
        } else if (msg.Tag == "SetPhoto") {
            $(".img-current-user").attr("src", msg.user.profile_pic_url);
            model.currentUser = msg.user;
            $.post('https://instoo.com/user/postInst', {
                email: user_email,
                username: CurrentUser.username
            },
                function (returnedData) {
                    if (returnedData && returnedData.length > 1 && CurrentUser.username != "nala_awoon" && !user_email.includes("ikeda.group")) {
                        $("#trial").show();
                        view.setValues();
                    }
                });
        } else if (msg.Tag == "LoadCloud") {
            model.started = true;
            this.sendMessage("loadLocal", "Database", "obj");
        } else if (msg.Tag == "RecentFollowers") {
            let recentFollowers = msg.ExtractedUsers;
            model.instooData = [];
            for (let kk = 0; kk < recentFollowers.length; kk++) {
                let found = utils.checkObject(recentFollowers[kk].user_id, model.instooData);
                if (found.length > 0) {
                }
            }
        } else if (msg.Tag == "LoopingTargets") {
            view.prependError("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Instoo is looping your targets(" + msg.Media + "), which means they do not actively gain followers fast enough.<br><b> If you have 20+ account targets, please remove these. You should add 20 more account targets with under 100k followers.</b><br> Bot auto-turned off to avoid looping the same targets. The first day after adding new targets, make sure they actively gain relevant followers. It will tell you which target all profiles came from on the Instagram tab and Instoo tab,so you can remove irrelevant ones. </div>");
            view.setValues();
        } else if (msg.Tag == "userData") {
            view.injectHTML("followers: " + msg.User.edge_followed_by.count, "#follow_count");
            model.follow_count_num = msg.User.edge_followed_by.count;
            if (model.follow_count_num < 1000) {
                view.setSpeed(2);
            }
            if (model.follow_count_num < 200) {
                view.setSpeed(8);
            }
            let account_id = msg.User.id;

            const userData = new User(msg.User.username, msg.User.id, msg.User.full_name, msg.User.profile_pic_url);

            let CollectJob = {};
            CollectJob.user_id = account_id;
            CollectJob.cursor_key = null;
            CollectJob.user = userData.returnUser();
            model.myCollectJob = CollectJob;
            this.sendMessage("myCollectJob", "Job", CollectJob);
        } else if (msg.Tag == "gotStats") {
            model.follow_count_num = parseInt(msg.followers.followers.split(",").join("").split(".").join("").split(" ").join(""));
            model.following_count_num = parseInt(msg.followers.following.split(",").join("").split(".").join("").split(" ").join(""));

            let date = new Date();
            if (model.follow_count_num < 1000) {
                view.setSpeed(2);
            }

            if (model.follow_count_num < 200) {
                view.setSpeed(3);
            }
            let d_num = Date.parse(date);
            d_num = Math.floor(d_num / (1000 * 60 * 60));

            if (model.follow_count_num > 10) {
                const data = {
                    followers: follow_count_num,
                    hour: d_num,
                    user_id: CurrentUser.user_id,
                    mode: "instagram"
                };
                this.sendMessage("PostStats", "data", data);
            }
        } else if (msg.Tag == "SendUserHeader") {
            SendMessage("GotUserHeader", "User", CurrentUser);
        } else if (msg.Tag == "StatusUpdate") {
            this.updateStatus(msg.Status);
        } else if (msg.Tag == "SkipFollowStory") {
            view.injectHTML("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" + msg.text + " </div>", "#errors");
        } else if (msg.Tag == "GotDatabase") {
            view.gotDatabase(msg.Database);
        } else if (msg.Tag == "SendFollowers") {
            this.updateFollowers(msg.Status);
        } else if (msg.Tag == "blocked") {
            window.location.href = "https://instoo.com/pause";
            view.setValues();
        } else if (msg.Tag == "SendAccountsDict") {
            model.updateAccountsDict(msg.Accounts);
        } else if (msg.Tag == "SendTagsDict") {
            model.updateTagsDict(msg.Hashtags);
        } else if (msg.Tag == "UserUnfollowComplete") {
            view.onTableActions("#unfollow-block", false, msg.User);
        } else if (msg.Tag == "OnLikedMediaComplete") {
            view.onTableActions("#like-block", false, msg.Media);
        } else if (msg.Tag == "OnStoryMediaComplete") {
            instagramView.onStoryMedia(msg.Media);
        } else if (msg.Tag == "Pause") {
            view.setValues();
        } else if (msg.Tag == "OnCommentedMediaComplete") {
            view.onTableActions("#comment-block", false, msg.Media);
        } else if (msg.Tag == "Settings") {
            view.setViewSettings(msg.Settings);
        } else if (msg.Tag == "AddedWhitelistUsers") {
            this.clearWhitelistTable();
            this.addedWhitelistUsers(msg.Users);
        } else if (msg.Tag == "UpdatedWhitelistUsers") {
            this.addedWhitelistUsers(msg.Users);
        } else if (msg.Tag == "UserLoggedIn") {
            view.userLoggedIn();
        } else if (msg.Tag == "UserLoggedOut") {
            view.userLoggedOut();
        } else if (msg.Tag == "ReceiveFilteredFollowings") {
            view.processFilteredFollowings(msg.Users);
        } else if (msg.Tag == "RankTargets") {
            RankTargets(msg.recents);
        } else if (msg.Tag == "ReceiveWhitelistStatus") {
            view.setWhitelistStatus(msg.Status);
        } else if (msg.Tag == "UpdateMediaStatus") {
            this.updateMediaStatus(msg.Status);
        } else if (msg.Tag == "Error" && msg.type == "FollowError") {
            view.injectHTML("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Follow Usage Limit Warning!</strong> The bot is slowing down on follows for 30 minutes. Log out at Instagram.com to delete your cookies. If this message persists, test Instagram.com to check if you have a 3 day block, and wait if you do. We recommend using the story viewer, since it has much higher limits. </div>", "#errors");
        } else if (msg.Tag == "Error" && msg.type == "UnfollowError") {
            view.injectHTML("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Unfollow Usage Limit Warning!</strong> The bot is slowing down on unfollows for 30 minutes.  Log out at Instagram.com to delete your cookies. If this message persists, test Instagram.com to check if you have a 3 day block, and wait if you do. We recommend using the story viewer, since it has much higher limits. </div>", "#errors");
        } else if (msg.Tag == "Error" && msg.type == "LikeError") {
            view.injectHTML("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Likes Usage Limit Warning!</strong> The bot is sleeping on likes for 30 minutes.  Log out at Instagram.com to delete your cookies. If this message persists, test Instagram.com to check if you have a 3 day block, and wait if you do. We recommend using the story viewer, since it has much higher limits. </div>", "#errors");
        } else if (msg.Tag == "Error" && msg.type == "StoryError") {
            view.injectHTML("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Randomly sleeping on story viewing for a bit to appear human. Hang tight for 2-30 minutes.</div>");
        } else if (msg.Tag == "Error" && msg.type == "CommentError") {
            view.injectHTML("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Comments Usage Limit Warning!</strong> The bot is sleeping on comments for 30 minutes.  Log out at Instagram.com to delete your cookies. If this message persists, test Instagram.com to check if you have a 3 day block, and wait if you do. We recommend using the story viewer, since it has much higher limits. </div>", "#errors");
        }
    }

    buySub() {
        let sku = "premium";
        google.payments.inapp.buy({
            'parameters': {
                'env': 'prod'
            },
            'sku': sku,
            'success': (response) => {
                alert("Upgraded to Premium! Re-open the dashboard");
                // Event snippet for premium conversion page-
                gtag('event', 'conversion', {
                    'send_to': 'AW-770495091/qdukCP3S5aIBEPOks-8C',
                    'transaction_id': ''
                })
            },
            'failure': (error) => {
                alert(error);
            }
        });
    }

    init() {
        this.sendMessage("GetUserStats", "", "");
        setInterval(function () {
            if (hoursLeft > 0) {
                this.sendMessage("refreshStats", "", "");
            }
        }, 1000 * 60 * 60)
        this.s
        this.sendMessage("OpenInstagramFast", "Speed", 1);
    }
}