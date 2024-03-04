var CurrentUser;
var ComPort;
var follow_count_num = 0;
var following_count_num = 0;
var linkedin_data = [];
var instagram_data = [];
var user_stats = [];
var last_ten_min = 1000000;
var last_ten_max = 0;
var DisplayFollowersNum = 10;
var DisplayLikesNum = 20;
var user_email = "";
var dashboardMode = 0;
var postedInst = false;
var follow_speed = 0;
var emailed = false;
var enable_get_followers = false;
var unfollow_speed = 0;
var story_speed = 0;
var unfollowInstoo = false;
// var post_stats = false;
// var tiktok_data = [];
// var tiktok_data = [];
var hoursLeft = 8;
// var twitter_data = [];
var like_speed = 0;
var follower_data = [];
var daily_data = [];
var blacklist = [];
var filters = [];
var minPhotos = 1;
var minFollowers = 100;
var minFollowing = 100;
var maxFollowers = 100000;
var maxFollowing = 100000;
var EnableFilters = false;
var update_interval = false;
var IdealTargets = [];
var addIdeal = true;
// var follower_growth = 0;
// var set_update = false;
var collectSelfFollowers = false;
var tiktok_speed = 0;
// var twitter_speed = 0;
// var facebook_speed = 0;

var unfollow_mode = false;
var DMMode = true;
window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var mode = "instagram";
// var StartTime = "";
// var AutoActions = [];
var analytics = [];
var startDate = "";
var chart_data;
// var analytics_chart;
var stopDate = "";
// var cal_events = [];
var activity_log = "";
var instooData = [];
// var schedule_list = "";
var user_followers = [];
// var calendar;
// var chart3;
// var chart;
// var chart2;
// var canvas;
// var Duration = 8;
var logged_in = false;
// var startedTutorial = false;
var likeCount = 0;
var myCollectJob = {};
var maxStories = 1000;
var user_plan;
var comment_speed = 0;
var global_settings = {};
var global_accounts = [];
var gotAnalytics = false;
var global_tags = [];
var global_locations = [];
var started = false;
var paid_sub = false;
var my_followers = [];
// var first = false;
var cloud_backup = false;
var start_license = 0;
// var last_follow_count = 0;
// var clicks = {};
var version = "";

var StartReact = false;
var StartSchedule = false;
var reacts = [];

var follow_val = false;
var like_val = false;
var comment_val = false;
var unfollow_val = false;
var user_cloud = true;
var UnfollowedPoolSize = 0;
var FollowedPoolSize = 0;
var LikePoolSize = 0;
var StoryPoolSize = 0;
var CommentPoolSize = 0;
// var last_day = 0;
var day = 0;
// var bar_follow;
var maxLikes = 1000;
var maxFollows = 1000;
var maxUnfollows = 1000;
var maxComments = 10;
// var bar_like;
// var bar_story;
// var bar_comment;
// var bar_unfollow;
var hashtag_dict = {};
var account_dict = {};
// var counted_dict = {};
// var clicks_dict = {};
// var email_name;
var speed_limit = 100;
var UnfollowAfterDays;
var cloud_db;

var live_snapshots = [];
var live_tags = [];
// var like_accounts = [];

var selectedAccount = "";
var loadedAccounts = false;
var updated_cloud = false;

window.dataLayer = window.dataLayer || [];

//JQuery function ran on extension load.
$(document).ready(function () {
    $("#sidebar-home-crm").click(function () {
        $(".content-wrapper").empty();
        $(".content-wrapper").load("crm.html", function () {
            dashboardMode = 6;
            $("#validateInstagramFollowers").click(function () {
                SendMessage("validateInstagramFollowers", "Num", "DisplayLikesNum");
            });

            $("#validateFollowers").click(function () {
                var followers_list = prompt("Enter a comma seperated list of followers to rank targets[dogs, dogsofinstagram, dog]:");
                var splits = followers_list.split(",");
                for (var kk = 0; kk < splits.length; kk++) {
                    splits[kk] = splits[kk].split(" ").join("").split("#").join("").split("@").join("");
                }

                for (var kk = 0; kk < this.instagram_data.length; kk++) {
                    if (splits.includes(this.instagram_data[kk].username)) {
                        this.instagram_data[kk].connected = "yes";
                    }
                }

                for (var kk = 0; kk < this.linkedin_data.length; kk++) {
                    if (splits.includes(this.linkedin_data[kk].username)) {
                        this.linkedin_data[kk].connected = "yes";
                    }
                }

                SendMessage("UpdateInstagramData", "instagram_data", this.instagram_data);
                SendMessage("UpdateLinkedinData", "linkedin_data", this.linkedin_data);
            });

            $("#validateSales").click(function () {
                var sales_list = prompt("Enter a comma seperated list of sales to rank targets(dogs, 10, dogsofinstagram, 20, dog, 30):");
                var splits = sales_list.split(",");
                for (var kk = 0; kk < splits.length; kk++) {
                    splits[kk] = splits[kk].split(" ").join("").split("#").join("").split("@").join("");
                }
                for (var kk = 0; kk < this.instagram_data.length; kk++) {
                    if (splits.includes(this.instagram_data[kk].username)) {
                        this.instagram_data[kk].sales += parseFloat(splits[splits.indexOf(this.instagram_data[kk].username) + 1]);
                    }
                }
                for (var kk = 0; kk < this.linkedin_data.length; kk++) {
                    if (splits.includes(this.linkedin_data[kk].username)) {
                        this.linkedin_data[kk].sales += parseFloat(splits[splits.indexOf(this.linkedin_data[kk].username) + 1]);
                    }
                }

                SendMessage("UpdateInstagramData", "instagram_data", this.instagram_data);
                SendMessage("UpdateLinkedinData", "linkedin_data", this.linkedin_data);
            });

            mode = "crm";
            gotAnalytics = false;

            SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

            SetActiveSidebarItem("#sidebar-home-crm");
        });
    });
});

