import { BaseView } from "./baseView";

export class TwitterViewHandler extends BaseView {
    constructor() {
        super();
    }

    scrollLike(num) {
        window.scrollBy(0, 600);

        let links = document.getElementsByTagName('div');

        if (num > 0) {
            let timer = utils.getRandomInt(50000, 120000);
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

    twitterUpdateMedia(status) {
        this.emptyTable("#like-twitter-block");

        for (let i = 0; i < status.LikedMediaTwitter.length; i++) {
            if (status.LikedMediaTwitter[i]) {
                this.onTableActions("#like-twitter-block", false, false, status.LikedMediaTwitter[i]);
            }
        }

        this.emptyTable("#follow-block-twitter");

        for (let i = 0; i < status.FollowedPoolTwitter.length; i++) {
            if (status.FollowedPoolTwitter[i]) {
                this.onTableActions("#follow-block-twitter", false, false, status.FollowedPoolTwitter[i]);
            }
        }

        this.prependTags(status.TagPoolTwitter, "#collect-tags-block");
    }

    setMode(status) {
        $("#follow-pool-twitter-num").text(status.FollowedPoolTwitter.length);
        $("#like-pool-twitter-num").text(status.LikedMediaTwitter.length);
        $("#customRangeTwitterFollows").val(status.MaxTwitterFollows);
        $("#customRangeTwitterLikes").val(status.MaxTwitterLikes);

        $("#follow_twitter_set").html("Retweets/day: " + status.MaxTwitterFollows);
        $("#like_twitter_set").html("Likes/day: " + status.MaxTwitterLikes);

        $("#set-follow-twitter-check").prop("checked", status.StartTwitterFollow);
        $("#set-like-twitter-check").prop("checked", status.StartTwitterLike);
    }

    twitterInit() {
        $("#sidebar-home-tw").click(function () {
            $(".content-wrapper").empty();
            $(".content-wrapper").load("twitter.html", function () {

                dashboardMode = 2;

                var data2 = [];
                if ($("#data2").attr("name") && $("#data2").attr("name").length > 2) {
                    data2 = [];
                }
                var chart_data = null;
                chart_data = [];
                var minimum = 10000;
                var labels = [];
                var min = 10000000;
                var max = 0;


                for (var index = 0; index < data2.length; index++) {
                    var obj = data2[index];
                    if (CurrentUser && obj.user_id == CurrentUser.user_id) {
                        chart_data.push(
                            parseInt(obj.followers)
                        );
                        if (obj.followers > max) {
                            max = obj.followers;
                        }

                        if (obj.followers < min) {
                            min = obj.followers;
                        }
                        labels.push(index);
                        if (parseInt(obj.followers) < minimum) {
                            minimum = parseInt(obj.followers);
                        }
                    }
                }
                if (chart_data.length > 1) {
                    $('#growth').html('You grown ' + max - min + ' followers using Instoo');
                }
                let config = {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Instagram Followers',
                            backgroundColor: window.chartColors.red,
                            borderColor: window.chartColors.red,
                            data: chart_data,
                            fill: false,
                        }]
                    },
                    options: {
                        maintainAspectRatio: false,

                        responsive: true,
                        title: {
                            display: false,
                            text: 'Followers'
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'nearest',
                            intersect: true
                        },
                        scales: {
                            xAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Hour'
                                }
                            }],
                            yAxes: [{
                                display: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Followers'
                                }
                            }]
                        }
                    }
                };

                mode = "twitter";
                gotAnalytics = false;
                version = chrome.runtime.getManifest().version;

                setTimeout(function () {
                    if (CurrentUser && CurrentUser.username) {
                        $(".img-current-user").attr("src", CurrentUser.user_pic_url);
                        $(".img-current-user").show();
                    }
                }, 240000);

                $('#version').attr('name', version);
                if (user_plan == "lifetime" || user_plan == "linkstories" || user_plan == "instoo2" || user_plan == "linkyear" || user_plan == "instoogold" || user_plan == "instooyearly" || user_plan == "instoopro" || user_plan == "instoogold2") {
                    speed_limit = 300;
                    $("#customRange1").attr("max", speed_limit);
                    $("#customRange2").attr("max", speed_limit);
                    $("#customRange3").attr("max", speed_limit);
                }

                $('#media_accounts').tagsinput({ trimValue: true });

                $('#media_tags').tagsinput({ trimValue: true });

                $('#media_tags2').tagsinput({ trimValue: true });

                $('#comment_tags').tagsinput({
                    trimValue: true,
                    delimiter: ']',
                    confirmKeys: [13]
                });

                $('#location_tags').tagsinput({ trimValue: true });

                $('#my-btns .btn').on('click', function (event) {
                    var val = $(this).find('input').val();
                    if (val == "Fast") {
                        $("#fast").addClass('active');
                        $("#slow").removeClass('active');
                        $("#medium").removeClass('active');

                        if (paid_sub) {
                            SendMessage("SetSpeedTwitter", "Speed", 1);
                        } else {
                            buySub();
                        }
                    }

                    if (val == "Slow") {
                        $("#slow").addClass('active');
                        $("#fast").removeClass('active');
                        $("#medium").removeClass('active');
                        SendMessage("SetSpeedTwitter", "Speed", 8);
                    }

                    if (val == "Medium") {
                        $("#medium").addClass('active');
                        $("#slow").removeClass('active');
                        $("#fast").removeClass('active');
                        SendMessage("SetSpeedTwitter", "Speed", 2);
                    }
                });

                SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                $("#media_tags").on('itemAdded', function (event) {
                    var tagsinputWidth = 200; // Width of Bootstrap Tags Input.
                    var tagWidth = $('#media_tags').parent().find('.bootstrap-tagsinput span.tag').last().width(); // To get the Width of individual Tag.
                    if (tagWidth > tagsinputWidth) {
                        //If Width of the Tag is more than the width of Container then we crop text of the Tag
                        var tagsText = event.item; // To Get Tags Value
                        var res = tagsText.substr(0, 5); // Here I'm displaying only first 5 Characters.(You can give any number)
                        $('#media_tags').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }

                    var tags = event.item;
                    var split_tags = tags.split("#");

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        if (split_tags[kk].split('#').join('').split(',').join('').split(' ').join('%20').length > 0) {
                            SendMessage("AddTagToListTwitter", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(' ').join('%20'));
                            global_tags.push(split_tags[kk].split('#').join('').split(',').join('').split(' ').join('%20'));
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                });

                $("#comment_tags").on('itemAdded', function (event) {
                    var tagsinputWidth = 200; // Width of Bootstrap Tags Input.
                    var tagWidth = $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().width(); // To get the Width of individual Tag.
                    if (tagWidth > tagsinputWidth) {
                        //If Width of the Tag is more than the width of Container then we crop text of the Tag
                        var tagsText = event.item; // To Get Tags Value
                        var res = tagsText.substr(0, 5); // Here I'm displaying only first 5 Characters.(You can give any number)
                        $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }

                    var tags = event.item;
                    var split_tags = tags;

                    SendMessage("AddCommentToListTwitter", "TagName", tags);
                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                });

                $("#comment_tags").on('itemRemoved', function (event) {
                    var tags = event.item;
                    var split_tags = tags;

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        SendMessage("RemoveCommentFromList", "TagName", split_tags[kk]);
                        var index = global_tags.indexOf(split_tags[kk]);
                        if (index > -1) {
                            global_tags.splice(index, 1);
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                });

                $("#media_tags").on('itemRemoved', function (event) {
                    var tags = event.item;
                    var split_tags = tags.split("#");
                    for (var kk = 0; kk < split_tags.length; kk++) {
                        SendMessage("RemoveTagFromListTwitter", "TagName", split_tags[kk].split('#').join(''));
                        var index = global_tags.indexOf(split_tags[kk].split('#').join(''));
                        if (index > -1) {
                            global_tags.splice(index, 1);
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                });

                $("#customRangeTwitterFollows").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRangeTwitterFollows").val()) > 1000) {
                            var input = document.getElementById("customRangeTwitterFollows");
                            input.value = 1000;
                        }
                    }

                    var follow_Twitter_speed = parseInt($("#customRangeTwitterFollows").val());
                    var like_Twitter_speed = parseInt($("#customRange3").val());

                    $("#follow_Twitter_set").html("Retweets/day: " + $("#customRangeTwitterFollows").val());

                    SendMessage("UpdateTwitterFollowLimit", "limit", follow_Twitter_speed);
                });

                $("#customRangeTwitterLikes").change(function () {
                    if (paid_sub == false) {
                        if (parseInt($("#customRangeTwitterLikes").val()) > 1000) {
                            var input = document.getElementById("customRangeTwitterLikes");
                            input.value = 1000;
                        }
                    }

                    var follow_Twitter_speed = parseInt($("#customRange1").val());
                    var like_Twitter_speed = parseInt($("#customRangeTwitterLikes").val());

                    $("#like_Twitter_set").html("Likes/day: " + $("#customRangeTwitterLikes").val());

                    SendMessage("UpdateTwitterLikeLimit", "limit", like_Twitter_speed);
                });

                SendMessage("RequestFollowStatus", "Num", DisplayFollowersNum);
                $("#slow").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeedTwitter", "Num", 3);
                    $("#slow").addClass('active');
                    $("#fast").removeClass('active');
                    $("#medium").removeClass('active');
                });

                $("#medium").click(function () {
                    var user_plan = $("#plan").attr("name");
                    SendMessage("SetSpeedTwitter", "Num", 2);
                    $("#medium").addClass('active');
                    $("#slow").removeClass('active');
                    $("#fast").removeClass('active');
                });

                $("#fast").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeedTwitter", "Num", 1);
                    $("#fast").addClass('active');
                    $("#slow").removeClass('active');
                    $("#medium").removeClass('active');
                });

                $("#set-follow-twitter-check").click(function () {
                    SendMessage("SetFollowTwitter", "Value", $(this).is(':checked'));
                });

                $("#set-like-twitter-check").click(function () {
                    SendMessage("SetLikeTwitter", "Value", $(this).is(':checked'));
                });

                $("#set-follow-check").click(function () {
                    $("#set-unfollow-check").prop("checked", false);
                    SetUnfollowValue(false);
                    SetFollowValue($(this).is(':checked'));
                    if ($(this).is(':checked')) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", true);
                    }
                });

                $("#set-like-check").click(function () {
                    SetLikeValue($(this).is(':checked'));
                    if ($(this).is(':checked')) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", true);
                    }
                });

                $("#set-twitter-check").click(function () {
                    SetTwitterValue($(this).is(':checked'));
                    $("#errors").html("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> To automate Twitter, open Twitter.com in a new tab, then log in. Instoo will use your hashtags to like/follow automatically, so add some hashtags.<br> Twitter is growing 2x faster than Instagram, so it's a useful platform to crosspromote both. Simply add a link to your Instagram in Twitter bios/videos, or add Twitter links in Instagram. Let us know how this new feature works for you! :)<br></div>");
                });

                $("#set-story-check").click(function () {
                    SetStoryValue($(this).is(':checked'));
                    if ($(this).is(':checked') != true) {
                        $("#set-like-check").prop("checked", false);
                        SetLikeValue(false);
                        $("#set-follow-check").prop("checked", false);
                        SetFollowValue(false);

                        $("#set-unfollow-check").prop("checked", false);
                        SetUnfollowValue(false);
                        $("#set-comment-check").prop("checked", false);
                        SetCommentValue(false);
                    }
                });

                $("#set-comment-check").click(function () {
                    SetCommentValue($(this).is(':checked'));

                    if ($(this).is(':checked')) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", status.StartLike);
                    }
                });

                $(document).on('click', '.remove-user-collect', function () {
                    RemoveCollectJobUser(this);
                });

                $(document).on('click', '.remove-tag-collect', function () {
                    RemoveCollectJobTagTwitter(this);
                });

                $(document).on('click', '.remove-location-collect', function () {
                    RemoveLocationJobTag(this);
                });

                $(document).on('click', '.remove-comment-collect', function () {
                    $(this).closest("tr").remove();
                    SendMessage("RemoveCommentFromList", "TagName", $(this).attr("user_id"));
                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                });

                $("#set-unfollow-check").click(function () {
                    $("#set-follow-check").prop("checked", false);
                    SetFollowValue(false);

                    SetUnfollowValue($(this).is(':checked'));
                    if ($(this).is(':checked')) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", true);
                    }
                });

                SetActiveSidebarItem("#sidebar-home");
                SendMessage("RequestSettings", "", "");

                $("#customRange1").val(maxFollows);
                $("#customRange2").val(maxUnfollows);
                $("#customRange3").val(maxLikes);
                $("#customRange4").val(maxComments);
                $("#customRange5").val(maxStories);
                $("#follow_set").html("Follows/day: " + maxFollows);
                $("#unfollow_set").html("Unfollows/day: " + maxUnfollows);
                $("#like_set").html("Likes/day: " + maxLikes);
                $("#story_set").html("Stories/day: " + maxStories);
                $("#comment_set").html("DMs/day: " + maxComments);

                SetActiveSidebarItem("#sidebar-home-tw");
            });
        });
    }
}