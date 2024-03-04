import { BaseView } from "./baseView";

export class TiktokViewHandler extends BaseView {
    constructor() {
        super();
    }

    tiktokUpdateMedia(status) {
        this.emptyTable("#like-tiktok-block");

        for (var i = 0; i < status.LikedMediaTikTok.length; i++) {
            this.onTableActions("#like-tiktok-block", false, false, status.LikedMediaTikTok[i]);
        }

        this.emptyTable("#follow-block-tiktok");

        for (var i = 0; i < status.FollowedPoolTikTok.length; i++) {
            this.onTableActions("#follow-block-tiktok", false, false, status.FollowedPoolTikTok[i]);
        }

        this.prependTags(status.TagsTikTok, "#collect-tags-block");
    }

    setMode(status) {
        $("#follow-pool-tiktok-num").text(status.FollowedPoolTikTokSize);
        $("#like-pool-tiktok-num").text(status.LikedPoolTikTokSize);
        $("#tiktok-pool-num").text(status.TikTokSize);
        $("#customRangeTikTokFollows").val(status.MaxTikTokFollows);
        $("#customRangeTikTokLikes").val(status.MaxTikTokLikes);

        $("#follow_tiktok_set").html("Follows/day: " + status.MaxTikTokFollows);
        $("#like_tiktok_set").html("Likes/day: " + status.MaxTikTokLikes);

        $("#set-follow-tiktok-check").prop("checked", status.StartTikTokFollow);
        $("#set-like-tiktok-check").prop("checked", status.StartTikTokLike);
    }
    tiktokInit() {
        $("#sidebar-home-tiktok").click(function () {
            $(".content-wrapper").empty();
            $(".content-wrapper").load("tiktok.html", function () {

                dashboardMode = 1;

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

                mode = "tiktok";
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

                            SendMessage("SetSpeedTikTok", "Speed", 1);

                        } else {
                            buySub();
                        }
                    }

                    if (val == "Slow") {
                        $("#slow").addClass('active');
                        $("#fast").removeClass('active');
                        $("#medium").removeClass('active');
                        SendMessage("SetSpeedTikTok", "Speed", 8);


                    }

                    if (val == "Medium") {
                        $("#medium").addClass('active');
                        $("#slow").removeClass('active');
                        $("#fast").removeClass('active');
                        SendMessage("SetSpeedTikTok", "Speed", 2);


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
                            SendMessage("AddTagToListTikTok", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
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

                    SendMessage("AddCommentToListTikTok", "TagName", tags);

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

                        SendMessage("RemoveTagFromListTikTok", "TagName", split_tags[kk].split('#').join(''));
                        var index = global_tags.indexOf(split_tags[kk].split('#').join(''));
                        if (index > -1) {
                            global_tags.splice(index, 1);
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });


                $("#customRangeTikTokFollows").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRangeTikTokFollows").val()) > 1000) {
                            var input = document.getElementById("customRangeTikTokFollows");
                            input.value = 1000;

                        }
                    }

                    var follow_tiktok_speed = parseInt($("#customRangeTikTokFollows").val());
                    var like_tiktok_speed = parseInt($("#customRange3").val());

                    $("#follow_tiktok_set").html("Follows/day: " + $("#customRangeTikTokFollows").val());


                    SendMessage("UpdateTikTokFollowLimit", "limit", follow_tiktok_speed);




                });


                $("#customRangeTikTokLikes").change(function () {
                    if (paid_sub == false) {
                        if (parseInt($("#customRangeTikTokLikes").val()) > 1000) {
                            var input = document.getElementById("customRangeTikTokLikes");
                            input.value = 1000;

                        }
                    }


                    var follow_tiktok_speed = parseInt($("#customRange1").val());
                    var like_tiktok_speed = parseInt($("#customRangeTikTokLikes").val());


                    $("#like_tiktok_set").html("Likes/day: " + $("#customRangeTikTokLikes").val());

                    SendMessage("UpdateTikTokLikeLimit", "limit", like_tiktok_speed);

                });

                SendMessage("RequestFollowStatus", "Num", DisplayFollowersNum);
                $("#slow").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeedTikTok", "Num", 3);
                    $("#slow").addClass('active');
                    $("#fast").removeClass('active');
                    $("#medium").removeClass('active');

                });
                $("#medium").click(function () {
                    var user_plan = $("#plan").attr("name");




                    SendMessage("SetSpeedTikTok", "Num", 2);
                    $("#medium").addClass('active');
                    $("#slow").removeClass('active');
                    $("#fast").removeClass('active');

                });
                $("#fast").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeedTikTok", "Num", 1);



                    $("#fast").addClass('active');
                    $("#slow").removeClass('active');
                    $("#medium").removeClass('active');

                });

                $("#set-follow-tiktok-check").click(function () {
                    SendMessage("SetFollowTikTok", "Value", $(this).is(':checked'));

                });
                $("#set-like-tiktok-check").click(function () {
                    SendMessage("SetLikeTikTok", "Value", $(this).is(':checked'));

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

                $("#set-tiktok-check").click(function () {
                    SetTikTokValue($(this).is(':checked'));
                    $("#errors").html("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> To automate TikTok, open tiktok.com in a new tab, then log in. Instoo will use your hashtags to like/follow automatically, so add some hashtags.<br> Tiktok is growing 2x faster than Instagram, so it's a useful platform to crosspromote both. Simply add a link to your Instagram in Tiktok bios/videos, or add TikTok links in Instagram. Let us know how this new feature works for you! :)<br></div>");

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
                    RemoveCollectJobTagTikTok(this);
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


                SetActiveSidebarItem("#sidebar-home-tiktok");

            });
        });
    }
}