import { controller } from "..";
import { Utils } from "../service-workers/utils";

const utils = new Utils();

export class BaseModel {
    constructor() {
        this.account_dict = {};
        this.activity_log = "";
        this.addIdeal = true;
        this.analytics = [];
        this.blacklist = [];
        this.chart_data = [];
        this.collectSelfFollowers = false;
        this.cloud_backup = false;
        this.cloud_db;
        this.commentPoolSize = 0;
        this.comment_val = false;
        this.currentUser = {};
        this.daily_data = [];
        this.displayLikesNum = 20;
        this.dmMode = true;
        this.emailed = false;
        this.email_msg = "";
        this.enableFilters = false;
        this.filters = [];
        this.follow_speed = 0;
        this.follow_count_num = 0;
        this.following_count_num = 0;
        this.follow_val = false;
        this.followedPoolSize = 0;
        this.global_accounts = [];
        this.global_tags = [];
        this.gotAnalytics = true;
        this.hashtag_dict = {};
        this.hoursLeft = 8;
        this.html = "";
        this.idealTargets = [];
        this.last_ten_max = 0;
        this.last_ten_min = 1000000;
        this.likePoolSize = 0;
        this.like_val = false;
        this.live_accounts = [];
        this.live_tags = [];
        this.live_snapshots = [];
        this.likeCount = 0;
        this.instooData = [];
        this.loadedAccounts = false;
        this.logged_in = false;
        this.maxFollowers = 100000;
        this.maxFollowing = 100000;
        this.minFollowers = 100;
        this.minFollowing = 100;
        this.mode = "instagram";
        this.myCollectJob = {};
        this.my_followers = [];
        this.paid_sub = false;
        this.reacts = [];
        this.settings = {};
        this.speed_limit = 100;
        this.started = false;
        this.startReact = false;
        this.status = {};
        this.storyPoolSize = 0;
        this.target_dic = {};
        this.unfollowAfterDays = 0;
        this.unfollowInstoo = false;
        this.unfollow_mode = false;
        this.unfollow_speed = 0;
        this.unfollowedPoolSize = 0;
        this.unfollow_val = false;
        this.updated_cloud = false;
        this.update_interval = false;
        this.user_cloud;
        this.user_email = "";
        this.user_followers = [];
        this.user_plan = "";
        this.user_stats = [];
        this.version = "";
    }

    saveSettings() {
        this.settings.FollowSettings = {};
        this.settings.UnfollowSettings = {};
        this.settings.CollectFollowers = {};
        this.settings.CollectFollowings = {};
        this.settings.LikeSettings = {};
        this.settings.CommentSettings = {};
        this.settings.FollowSettings.TimeMin = follow_speed;
        this.settings.FollowSettings.TimeMax = follow_speed + 10;
        this.settings.FollowSettings.ErrorTime = 200;
        this.settings.UnfollowSettings.TimeMin = unfollow_speed;
        this.settings.UnfollowSettings.TimeMax = unfollow_speed + 10;
        this.settings.UnfollowSettings.ErrorTime = 200;
        this.settings.CommentSettings.TimeMin = comment_speed;
        this.settings.CommentSettings.TimeMax = 450;
        this.settings.CommentSettings.ErrorTime = 1800;
        this.settings.LikeSettings.TimeMin = like_speed;
        this.settings.LikeSettings.TimeMax = like_speed + 10;
        this.settings.LikeSettings.ErrorTime = 200;
        this.settings.StorySettings.TimeMin = story_speed;
        this.settings.StorySettings.TimeMax = story_speed + 10;
        this.settings.StorySettings.ErrorTime = 400;
        this.settings.CollectFollowers.Pool = 1000;
        this.settings.CollectFollowers.Interval = 100;
        this.settings.CollectFollowers.ErrorTime = 200;
        this.settings.CollectFollowings.Pool = 1000;
        this.settings.CollectFollowings.Interval = 100;
        this.settings.CollectFollowings.ErrorTime = 200;
    }

    saveViewSettings() {
        this.settings.CollectFollowers.Pool = $("#input-user-pool-num").val();
        this.settings.CollectFollowers.Interval = $("#input-user-collect-time").val();
        this.settings.CollectFollowers.ErrorTime = $("#input-user-error-time").val();
        this.settings.CollectFollowings.Pool = $("#input-following-pool-num").val();
        this.settings.CollectFollowings.Interval = $("#input-following-collect-time").val();
        this.settings.CollectFollowings.ErrorTime = $("#input-following-error-time").val();
        this.unfollowAfterDays = $("#input-unfollow-days").val();
        this.settings.UnfollowAfterDays = $("#input-unfollow-days").val();
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        this.settings.Day = dd;
        controller.sendMessage("UpdateSettings", "Settings", model.settings);
    }

    importDatabase(event) {
        let file = event.target.files[0];
        if (file) {
            let fileReader = new FileReader();
            fileReader.onload = function (event) {
                let content = event.target.result;
                SendMessage("ImportDatabase", "Database", content);
            }
            fileReader.readAsText(file);
        }
        alert("Loaded Database Successfully!");
    }

    updateAccountsDict(status) {
        this.account_dict = status;
    }

    updateTagsDict(status) {
        this.hashtag_dict = status;
    }

    updateStats(status) {
        if (this.updated_cloud) {
            this.updated_cloud = false;
        }

        this.hoursLeft = status.hoursLeft;
        this.user_stats = status.user_stats;
        this.reacts = status.reacts;
        this.startReact = status.StartReact;
        this.enableFilters = status.EnableFilters;
        this.unfollow_mode = status.unfollow_mode;
        this.activity_log = status.activity_log;
        this.blacklist = status.blacklist;
        this.filters = status.filters;
        this.minFollowing = status.minFollowing;
        this.maxFollowing = status.maxFollowing;
        this.minPhotos = status.minPhotos;
        this.minFollowers = status.minFollowers;
        this.maxFollowers = status.maxFollowers;
        this.user_followers = status.user_followers;
        this.analytics = status.true_analytics;
        this.idealTargets = status.IdealTargets;
        this.dmMode = status.backgroundDMs;
        this.addIdeal = status.addIdeal;
        this.unfollowInstoo = status.unfollowInstoo;
        this.collectSelfFollowers = status.collectSelfFollowers;
        this.unfollowedPoolSize = status.UnfollowedPoolSize;
        this.followedPoolSize = status.FollowedPoolSize;
        this.likePoolSize = status.LikePoolSize;
        this.storyPoolSize = status.StoryPoolSize;
        this.commentPoolSize = status.CommentPoolSize;
    }

    setChart(status) {
        let data2 = status.user_stats;
        if ($("#data2").attr("name") && $("#data2").attr("name").length > 2) {
            data2 = [];
        }
        this.follower_data = data2;
        let min = 10000000;
        let max = 0;
        let dailys = [];
        let minimum = 10000;
        let labels = [];
        let counter = 0;
        this.daily_data = dailys;
        for (let index = data2.length - 1; index > data2.length - 100; index--) {
            if (index >= 0) {
                let obj = data2[index];
                if (CurrentUser && obj.user_id == CurrentUser.user_id && (chart_data.length < 2 || Math.abs(parseInt(obj.followers) - chart_data[chart_data.length - 1]) < 200)) {
                    chart_data.push(
                        parseInt(obj.followers)
                    );
                    if (obj.followers > max) {
                        max = obj.followers;
                    }
                    if (obj.followers < min) {
                        min = obj.followers;
                    }
                    labels.push(counter);
                    counter++;
                    if (parseInt(obj.followers) < minimum) {
                        minimum = parseInt(obj.followers);
                    }
                }
            }
        }

        this.chart_data.reverse();
    }

    activityUpdate(status) {
        setTimeout(() => {
            for (let index = 0; index < data2.length; index++) {
                let obj = data2[index];
                if (this.currentUser && obj.user_id == this.currentUser.user_id) {
                    this.chart_data.push(
                        parseInt(obj.followers)
                    );
                }
            }
            for (let kk = this.chart_data.length - 1; kk > this.chart_data.length - 11; kk--) {
                if (this.chart_data[kk] < this.last_ten_min) {
                    this.last_ten_min = this.chart_data[kk];
                }
                if (this.chart_data[kk] > this.last_ten_max) {
                    this.last_ten_max = this.chart_data[kk];
                }
            }

            if (this.storyPoolSize > 0 && Math.abs(this.last_ten_max - this.last_ten_min) > 5 && Math.abs(this.last_ten_max - this.last_ten_min) != 10000000 && Math.abs(this.last_ten_max - this.last_ten_min) < 1000) {
                if (this.user_plan == "lifetime") {
                    this.email_msg = "Based on your activity logs, it appears you figured out how to use Instoo properly. We recommend a/b testing targets and photos to optimize your growth rate to 30-50 per day. Also increase your followers and following counter over 1000 to be able to use fast mode. If you have free time anytime, please consider leaving a short review: https://appsumo.com/instoo/#reviews";
                } else {
                    this.email_msg = "Based on your activity logs, it appears you figured out how to use Instoo properly. We recommend a/b testing targets and photos to optimize your growth rate to 30-50 per day. Also increase your followers and following counter over 1000 to be able to use fast mode.";
                }
            }

            if (Math.abs(this.last_ten_max - this.last_ten_min) < 5 && this.storyPoolSize > 100 && Math.abs(this.last_ten_max - this.last_ten_min) == 0) {
                this.email_msg = "Based on your activity logs, you did not gain followers despite running all day. We recommend changing targets and posting more photos with the same theme. Contact the live chat for help researching targets.";
            }
            if (Math.abs(this.last_ten_max - this.last_ten_min) < 5 && this.storyPoolSize == 0 && this.activity_log.length == 0) {
                this.email_msg = "Based on your activity logs, the bot did not actually run over 8 hours due to some setup issue. Please make sure to add 20 account targets, then enable the likes and follows switch. Then check the chrome is not de-activating the instagram tab by leaving it in focus for 1 hour. If chrome deactivates the tab, make sure to disable javascript throttling, and run Instoo in a chrome based browser by itself to multitask in chrome yourself. Contact the live chat for help researching targets.";
            }
            if (Math.abs(this.last_ten_max - this.last_ten_min) < 5 && this.likePoolSize > 0 && this.storyPoolSize / this.likePoolSize > 10) {
                this.email_msg = "Based on your activity logs, you ran many stories but few likes. It is possible chrome is de-activating the tab to save CPU. To test this theory, lease Instagram in focus while Instoo runs for 1 hour. You can run Instoo in another chrome based browser to solve this problem. Contact the live chat for help researching targets."
            }
            if (Math.abs(this.last_ten_max - this.last_ten_min) < 5 && this.storyPoolSize > 0 && this.likePoolSize == 0 && this.followedPoolSize == 0) {
                this.email_msg = "Based on your activity logs, only stories ran. Please check this article to fix: https://help.instoo.com/kb/337/690/stories-only-working-but-not-likesfollowsunfollows. Contact the live chat for help researching targets.";
            }
            if (Math.abs(this.last_ten_max - this.last_ten_min) < 5 && this.storyPoolSize > 0 && this.likePoolSize > 0 && this.followedPoolSize == 0) {
                this.email_msg = "Based on your activity logs, only stories + likes ran. We highly recommend using follows as well to trigger the Instagram promotion algorithm and achieve the average growth rates on fast mode. Contact the live chat for help researching targets.";
            }
        }, status.hoursLeft * 60 * 60 * 1000);
    }

    init() {
        setInterval(() => {
            if (this.update_interval) {
                this.updated_cloud = true;
                this.update_interval = false;
            }
        }, 1000 * 60)

        this.user_plan = $("#plan").attr("name");
    }
}

export class User {
    constructor(username, user_id, full_name, user_pic_url, followed_time) {
        this.username = username;
        this.user_id = user_id;
        this.full_name = full_name;
        this.user_pic_url = user_pic_url;
        this.followed_time = followed_time;
    }
    returnUser() {
        return {
            username: this.username,
            user_id: this.user_id,
            full_name: this.full_name,
            user_pic_url: this.user_pic_url,
            followed_time: this.followed_time
        }
    }
}