import { BaseView } from "./baseView";

export class FacebookViewHandler extends BaseView {
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

    facbookupdateMedia(status) {
        this.emptyTable("#like-facebook-block");

        for (let i = 0; i < status.LikedMediafacebook.length; i++) {
            this.onTableActions("#like-facebook-block", false, false, status.LikedMediafacebook[i]);
        }

        this.emptyTable("#follow-block-facebook");

        for (let i = 0; i < status.FollowedPoolfacebook.length; i++) {
            this.onTableActions("#follow-block-facebook", false, false, status.FollowedPoolfacebook[i]);
        }

        this.prependTags(status.Tagsfacebook, "#collect-tags-block");
        this.prependTags(status.AccountPoolfacebook, "#collect-accounts-block");
    }

    setMode(status) {
        $("#follow_facebook_set").html("Friends/day: " + status.MaxfacebookFollows);
        $("#like_facebook_set").html("Likes/day: " + status.MaxfacebookLikes);

        $("#follow-pool-facebook-num").text(status.FollowedPoolfacebook.length);
        $("#like-pool-facebook-num").text(status.LikedPoolfacebookSize);
        $("#facebook-pool-num").text(status.facebookSize);
        $("#customRangefacebookFollows").val(status.MaxfacebookFollows);
        $("#customRangefacebookLikes").val(status.MaxfacebookLikes);

        $("#set-follow-facebook-check").prop("checked", status.StartfacebookFollow);
        $("#set-like-facebook-check").prop("checked", status.StartfacebookLike);
    }

    facbookInit() {
        $("#sidebar-home-facebook").click(function () {
            $(".content-wrapper").empty();
            $(".content-wrapper").load("facebook.html", function () {

                dashboardMode = 7;

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

                mode = "facebook";
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

                $('#media_accounts').tagsinput({
                    trimValue: true
                });

                $('#media_tags').tagsinput({
                    trimValue: true
                });
                $('#media_tags2').tagsinput({
                    trimValue: true
                });

                $('#comment_tags').tagsinput({
                    trimValue: true,
                    delimiter: ']',
                    confirmKeys: [13]
                });

                $('#location_tags').tagsinput({
                    trimValue: true
                });



                $('#my-btns .btn').on('click', function (event) {
                    var val = $(this).find('input').val();
                    if (val == "Fast") {
                        $("#fast").addClass('active');
                        $("#slow").removeClass('active');
                        $("#medium").removeClass('active');

                        if (paid_sub) {
                            SendMessage("SetSpeedfacebook", "Speed", 1);
                        } else {
                            buySub();
                        }
                    }

                    if (val == "Slow") {
                        $("#slow").addClass('active');
                        $("#fast").removeClass('active');
                        $("#medium").removeClass('active');
                        SendMessage("SetSpeedfacebook", "Speed", 8);
                    }

                    if (val == "Medium") {
                        $("#medium").addClass('active');
                        $("#slow").removeClass('active');
                        $("#fast").removeClass('active');
                        SendMessage("SetSpeedfacebook", "Speed", 2);
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
                        if (split_tags[kk].split('#').join('').split(',').join('').split(' ').join('').length > 0) {
                            SendMessage("AddTagToListfacebook", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                            global_tags.push(split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                });

                $("#media_accounts").on('itemAdded', function (event) {
                    console.log("CODES THAT RUS 2");

                    var tagsinputWidth = 200; // Width of Bootstrap Tags Input.
                    var tagWidth = $('#media_accounts').parent().find('.bootstrap-tagsinput span.tag').last().width(); // To get the Width of individual Tag.
                    if (tagWidth > tagsinputWidth) {
                        //If Width of the Tag is more than the width of Container then we crop text of the Tag
                        var tagsText = event.item; // To Get Tags Value
                        var res = tagsText.substr(0, 5); // Here I'm displaying only first 5 Characters.(You can give any number)
                        $('#media_accounts').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }

                    var tags = event.item;
                    var split_tags = tags.split("#");

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        if (split_tags[kk].split('#').join('').split(',').join('').split(' ').join('').length > 0) {
                            SendMessage("AddAccountToListfacebook", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                            global_tags.push(split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
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

                    SendMessage("AddCommentToListfacebook", "TagName", tags);

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
                        SendMessage("RemoveTagFromListfacebook", "TagName", split_tags[kk].split('#').join(''));
                        var index = global_tags.indexOf(split_tags[kk].split('#').join(''));
                        if (index > -1) {
                            global_tags.splice(index, 1);
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                });

                $("#customRangefacebookFollows").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRangefacebookFollows").val()) > 1000) {
                            var input = document.getElementById("customRangefacebookFollows");
                            input.value = 1000;
                        }
                    }

                    var follow_facebook_speed = parseInt($("#customRangefacebookFollows").val());
                    var like_facebook_speed = parseInt($("#customRange3").val());

                    $("#follow_facebook_set").html("Friends/day: " + $("#customRangefacebookFollows").val());

                    SendMessage("UpdatefacebookFollowLimit", "limit", follow_facebook_speed);
                });


                $("#customRangefacebookLikes").change(function () {
                    if (paid_sub == false) {
                        if (parseInt($("#customRangefacebookLikes").val()) > 1000) {
                            var input = document.getElementById("customRangefacebookLikes");
                            input.value = 1000;
                        }
                    }

                    var follow_facebook_speed = parseInt($("#customRange1").val());
                    var like_facebook_speed = parseInt($("#customRangefacebookLikes").val());

                    $("#like_facebook_set").html("Likes/day: " + $("#customRangefacebookLikes").val());

                    SendMessage("UpdatefacebookLikeLimit", "limit", like_facebook_speed);
                });

                SendMessage("RequestFollowStatus", "Num", DisplayFollowersNum);
                $("#slow").click(function () {
                    var user_plan = $("#plan").attr("name");
                    SendMessage("SetSpeedfacebook", "Num", 3);
                    $("#slow").addClass('active');
                    $("#fast").removeClass('active');
                    $("#medium").removeClass('active');
                });

                $("#medium").click(function () {
                    var user_plan = $("#plan").attr("name");
                    SendMessage("SetSpeedfacebook", "Num", 2);
                    $("#medium").addClass('active');
                    $("#slow").removeClass('active');
                    $("#fast").removeClass('active');
                });

                $("#fast").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeedfacebook", "Num", 1);

                    $("#fast").addClass('active');
                    $("#slow").removeClass('active');
                    $("#medium").removeClass('active');
                });

                $("#set-follow-facebook-check").click(function () {
                    SendMessage("SetFollowfacebook", "Value", $(this).is(':checked'));
                });

                $("#set-like-facebook-check").click(function () {
                    SendMessage("SetLikefacebook", "Value", $(this).is(':checked'));
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

                $("#set-facebook-check").click(function () {
                    SetfacebookValue($(this).is(':checked'));
                    $("#errors").html("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> To automate facebook, open facebook.com in a new tab, then log in. Instoo will use your hashtags to like/follow automatically, so add some hashtags.<br> facebook is growing 2x faster than Instagram, so it's a useful platform to crosspromote both. Simply add a link to your Instagram in facebook bios/videos, or add facebook links in Instagram. Let us know how this new feature works for you! :)<br></div>");
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
                    RemoveCollectJobTagfacebook(this);
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

                //getFollowers();
                SetActiveSidebarItem("#sidebar-home-facebook");
            });
        });
    }
}