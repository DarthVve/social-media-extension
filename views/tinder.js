import { BaseView } from "./baseView";
import { controller, model } from "../index";

export class TinderViewHandler extends BaseView {
    constructor() {
        super();
    }

    tinderUpdateMedia(status) {
        this.prependTags(status.CommentsTinder, "#collect-comments-block");
    }

    setMode(status) {
        $("#like-pool-tinder-num").text(status.LikedMediaTinder.length);
        $("#customRangeTinderLikes").val(status.MaxTinderLikes);
        $("#customRangeTinderComments").val(status.maxTinderComments);
        $("#comment_tinder_set").html("DMs/day: " + status.maxTinderComments);

        $("#like_tinder_set").html("Likes/day: " + status.MaxTinderLikes);
        $("#set-comment-tinder-check").prop("checked", status.StartComment);

        $("#set-like-tinder-check").prop("checked", status.StartTinderLike);
    }

    tinderInit() {
        $(".content-wrapper").empty();
        $(".content-wrapper").load("tinder.html", function () {
            let data2 = [];
            let chart_data = [];
            let minimum = 10000;
            let labels = [];
            let min = 10000000;
            let max = 0;
            if ($("#data2").attr("name") && $("#data2").attr("name").length > 2) {
                data2 = [];
            }

            for (let index = 0; index < data2.length; index++) {
                let obj = data2[index];
                if (model.currentUser && obj.user_id == model.urrentUser.user_id) {
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

            model.mode = "tinder";
            model.version = chrome.runtime.getManifest().version;
            controller.gotAnalytics = false;

            setTimeout(function () {
                if (model.currentUser && model.currentUser.username) {
                    $(".img-current-user").attr("src", model.currentUser.user_pic_url);
                    $(".img-current-user").show();
                }
            }, 240000);

            $('#version').attr('name', model.version);
            if (model.user_plan == "lifetime" || model.user_plan == "linkstories" || model.user_plan == "instoo2" || model.user_plan == "linkyear" || model.user_plan == "instoogold" || model.user_plan == "instooyearly" || model.user_plan == "instoopro" || model.user_plan == "instoogold2") {
                model.speed_limit = 300;
                $("#customRange1").attr("max", model.speed_limit);
                $("#customRange2").attr("max", model.speed_limit);
                $("#customRange3").attr("max", model.speed_limit);
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
                let val = $(this).find('input').val();
                if (val == "Fast") {
                    this.setSpeed(8);
                    if (model.paid_sub) {
                        controller.sendMessage("SetSpeedTinder", "Speed", 8);
                    } else {
                        controller.buySub();
                    }
                }

                if (val == "Slow") {
                    this.setSpeed(1);
                }

                if (val == "Medium") {
                    this.setSpeed(5);
                }
            });

            controller.sendMessage("RequestMediaStatus", "Num", model.displayLikesNum);

            $("#comment_tags").on('itemAdded', function (event) {
                let tagsinputWidth = 200;
                let tagWidth = $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().width();

                if (tagWidth > tagsinputWidth) {
                    let tagsText = event.item;
                    let res = tagsText.substr(0, 5);
                    $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                }

                let tags = event.item;

                controller.sendMessage("AddCommentToListTinder", "TagName", tags);
                controller.sendMessage("RequestMediaStatus", "Num", model.displayLikesNum);
            });

            $("#comment_tags").on('itemRemoved', function (event) {
                let tags = event.item;
                let split_tags = tags;

                for (let kk = 0; kk < split_tags.length; kk++) {
                    controller.sendMessage("RemoveCommentFromListTinder", "TagName", split_tags[kk]);
                    let index = model.global_tags.indexOf(split_tags[kk]);
                    if (index > -1) {
                        model.global_tags.splice(index, 1);
                    }
                }

                controller.sendMessage("RequestMediaStatus", "Num", model.displayLikesNum);

            });

            $("#customRangeTinderComments").change(function () {
                if (paid_sub === false) {
                    if (parseInt($("#customRangeTinderComments").val()) > 1000) {
                        var input = document.getElementById("customRangeTinderComments");
                        input.value = 1000;
                    }
                }

                let follow_tinder_speed = parseInt($("#customRangeTinderComments").val());

                $("#comment_tinder_set").html("DMs/day: " + $("#customRangeTinderComments").val());

                controller.sendMessage("UpdateTinderCommentLimit", "limit", follow_tinder_speed);
            });

            $("#customRangeTinderLikes").change(function () {
                if (model.paid_sub == false) {
                    if (parseInt($("#customRangeTinderLikes").val()) > 1000) {
                        var input = document.getElementById("customRangeTinderLikes");
                        input.value = 1000;
                    }
                }
                let like_tinder_speed = parseInt($("#customRangeTinderLikes").val());

                $("#like_tinder_set").html("Likes/day: " + $("#customRangeTinderLikes").val());

                controller.sendMessage("UpdateTinderLikeLimit", "limit", like_tinder_speed);

            });

            controller.sendMessage("RequestFollowStatus", "Num", model.activity_logisplayFollowersNum);
            $("#slow").click(() => {
                model.user_plan = $("#plan").attr("name");
                this.setSpeed(3);

            });
            $("#medium").click(function () {
                model.user_plan = $("#plan").attr("name");
                this.setSpeed(5);
            });

            $("#fast").click(function () {
                model.user_plan = $("#plan").attr("name");
                this.setSpeed(1);
            });

            $("#set-follow-tinder-check").click(function () {
                controller.sendMessage("SetFollowTinder", "Value", $(this).is(':checked'));
            });

            $("#set-like-tinder-check").click(function () {
                controller.sendMessage("SetLikeTinder", "Value", $(this).is(':checked'));
            });

            $("#set-follow-check").click(function () {
                $("#set-unfollow-check").prop("checked", false);
                controller.setUnfollowValue(false);
                controller.setFollowValue($(this).is(':checked'));
                if ($(this).is(':checked')) {
                    controller.setStoryValue($(this).is(':checked'));
                    $("#set-story-check").prop("checked", true);
                }
            });

            $("#set-like-check").click(function () {
                controller.setLikeValue($(this).is(':checked'));
                if ($(this).is(':checked')) {
                    controller.setStoryValue($(this).is(':checked'));
                    $("#set-story-check").prop("checked", true);
                }
            });


            $("#set-story-check").click(function () {
                controller.setStoryValue($(this).is(':checked'));

                if ($(this).is(':checked') != true) {
                    $("#set-like-check").prop("checked", false);
                    controller.setLikeValue(false);
                    $("#set-follow-check").prop("checked", false);
                    controller.setFollowValue(false);

                    $("#set-unfollow-check").prop("checked", false);
                    controller.setUnfollowValue(false);
                    $("#set-comment-check").prop("checked", false);
                    controller.setCommentValue(false);
                }
            });

            $("#set-comment-check").click(function () {
                controller.setCommentValue($(this).is(':checked'));

                if ($(this).is(':checked')) {
                    controller.setStoryValue($(this).is(':checked'));
                    $("#set-story-check").prop("checked", model.status.StartLike);
                }
            });

            $(document).on('click', '.remove-comment-collect', function () {
                $(this).closest("tr").remove();
                controller.sendMessage("RemoveCommentFromList", "TagName", $(this).attr("user_id"));
                controller.sendMessage("RequestMediaStatus", "Num", model.displayLikesNum);
            });

            $("#set-unfollow-check").click(function () {
                $("#set-follow-check").prop("checked", false);
                controller.setFollowValue(false);

                controller.setUnfollowValue($(this).is(':checked'));
                if ($(this).is(':checked')) {
                    SetStoryValue($(this).is(':checked'));
                    $("#set-story-check").prop("checked", true);
                }
            });

            this.setActiveSidebarItem("#sidebar-home");

            controller.sendMessage("RequestSettings", "", "");

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

            this.setActiveSidebarItem("#sidebar-home-tinder2");
        });
    }
}