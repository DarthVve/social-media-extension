import { BaseView } from "./baseView";
import { model, controller } from "../index";

export class LinkedInViewHandler extends BaseView {
    constructor() {
        super();
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

    linkedinUpdateMedia(status) {
        this.emptyTable("#like-linkedin-block");

        for (let i = 0; i < status.linkedin_data.length; i++) {
            this.onTableActions("#like-linkedin-block", false, false, status.linkedin_data[i]);
        }

        this.prependTags(status.TagPoolLinkedin, "#collect-tags-block");
    }

    setMode(status) {
        $("#follow-pool-linkedin-num").text(status.FollowedPoolLinkedin.length);
        $("#like-pool-linkedin-num").text(status.linkedin_data.length);
        $("#customRangeLinkedinLikes").val(status.MaxLinkedinLikes);
        $("#customRangeLinkedinFollows").val(status.maxLinkedinFollows);
        $("#follow_linkedin_set").html("Connections/day: " + status.MaxLinkedinFollows);
        $("#like_linkedin_set").html("Leads/day: " + status.MaxLinkedinLikes);
        $("#set-follow-Linkedin-check").prop("checked", status.StartLinkedinFollow);
        $("#set-like-Linkedin-check").prop("checked", status.StartLinkedinLike);
    }

    linkedinInit() {
        $("#sidebar-home-link2").click(function () {
            $(".content-wrapper").empty();
            $(".content-wrapper").load("linkedin.html", function () {

                model.dashboardMode = 5;
                model.mode = "linkedin";
                model.gotAnalytics = false;
                model.version = chrome.runtime.getManifest().version;

                let data2 = [];
                if ($("#data2").attr("name") && $("#data2").attr("name").length > 2) {
                    data2 = [];
                }
                let chart_data = [];
                let minimum = 10000;
                let labels = [];
                let min = 10000000;
                let max = 0;


                for (let index = 0; index < data2.length; index++) {
                    let obj = data2[index];
                    if (model.currentUser && obj.user_id == model.currentUser.user_id) {
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

                setTimeout(function () {
                    if (model.currentUser && model.currentUser.username) {
                        $(".img-current-user").attr("src", model.currentUser.user_pic_url);
                        $(".img-current-user").show();
                    }
                }, 240000);


                $('#version').attr('name', version);
                if (user_plan == "lifetime" || user_plan == "linkstories" || user_plan == "instoo2" || user_plan == "linkyear" || user_plan == "instoogold" || user_plan == "instooyearly" || user_plan == "instoopro" || user_plan == "instoogold2") {
                    model.speed_limit = 300;
                    $("#customRange1").attr("max", speed_limit);
                    $("#customRange2").attr("max", speed_limit);
                    $("#customRange3").attr("max", speed_limit);
                }




                $('#my-btns .btn').on('click', function (event) {
                    let val = $(this).find('input').val();
                    if (val == "Fast") {
                        $("#fast").addClass('active');
                        $("#slow").removeClass('active');
                        $("#medium").removeClass('active');

                        if (paid_sub) {
                            controller.sendMessage("SetSpeedLinkedin", "Speed", 1);
                        } else {
                            buySub();
                        }
                    }

                    if (val == "Slow") {
                        $("#slow").addClass('active');
                        $("#fast").removeClass('active');
                        $("#medium").removeClass('active');
                        SendMessage("SetSpeedLinkedin", "Speed", 8);


                    }

                    if (val == "Medium") {
                        $("#medium").addClass('active');
                        $("#slow").removeClass('active');
                        $("#fast").removeClass('active');
                        SendMessage("SetSpeedLinkedin", "Speed", 2);


                    }

                });
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

                SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);


                $("#media_tags").on('itemAdded', function (event) {

                    var tagsinputWidth = 200; // Width of Bootstrap Tags Input.
                    var tagWidth = $('#media_tags').parent().find('.bootstrap-tagsinput span.tag').last().width(); // To get the Width of individual Tag.
                    if (tagWidth > tagsinputWidth) {
                        var tagsText = event.item; // To Get Tags Value
                        var res = tagsText.substr(0, 5); // Here I'm displaying only first 5 Characters.(You can give any number)
                        $('#media_tags').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }


                    var tags = event.item;
                    var split_tags = tags.split("#");

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        if (split_tags[kk].split('#').join('').split(',').join('').split(" ").join("%20").length > 0) {
                            SendMessage("AddTagToListLinkedin", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(" ").join("%20"));
                            global_tags.push(split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });


                $("#comment_tags").on('itemAdded', function (event) {


                    var tagsinputWidth = 200;
                    var tagWidth = $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().width();
                    if (tagWidth > tagsinputWidth) {
                        var tagsText = event.item;
                        var res = tagsText.substr(0, 5);
                        $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }


                    var tags = event.item;
                    var split_tags = tags;

                    SendMessage("AddCommentToListLinkedin", "TagName", tags);
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

                        SendMessage("RemoveTagFromListLinkedin", "TagName", split_tags[kk].split('#').join(''));
                        var index = global_tags.indexOf(split_tags[kk].split('#').join(''));
                        if (index > -1) {
                            global_tags.splice(index, 1);
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });


                $("#customRangeLinkedinFollows").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRangeLinkedinFollows").val()) > 1000) {
                            var input = document.getElementById("customRangeLinkedinFollows");
                            input.value = 1000;

                        }
                    }

                    var follow_Linkedin_speed = parseInt($("#customRangeLinkedinFollows").val());
                    var like_Linkedin_speed = parseInt($("#customRange3").val());

                    $("#follow_Linkedin_set").html("Follows/day: " + $("#customRangeLinkedinFollows").val());


                    SendMessage("UpdateLinkedinFollowLimit", "limit", follow_Linkedin_speed);




                });


                $("#customRangeLinkedinLikes").change(function () {
                    if (paid_sub == false) {
                        if (parseInt($("#customRangeLinkedinLikes").val()) > 1000) {
                            var input = document.getElementById("customRangeLinkedinLikes");
                            input.value = 1000;

                        }
                    }


                    var follow_Linkedin_speed = parseInt($("#customRange1").val());
                    var like_Linkedin_speed = parseInt($("#customRangeLinkedinLikes").val());


                    $("#like_Linkedin_set").html("Likes/day: " + $("#customRangeLinkedinLikes").val());

                    SendMessage("UpdateLinkedinLikeLimit", "limit", like_Linkedin_speed);

                });

                SendMessage("RequestFollowStatus", "Num", DisplayFollowersNum);

                $("#export_linkedin").click(function () {
                    var json = this.linkedin_data
                    for (var kk = 0; kk < json.length; kk++) {
                        json[kk].html = "";
                    }


                    var fields = Object.keys(json)
                    var replacer = function (key, value) {
                        return value === null ? '' : value
                    }
                    var csv = json.map(function (row) {
                        return fields.map(function (fieldName) {
                            return JSON.stringify(row[fieldName], replacer)
                        }).join(',')
                    })
                    csv.unshift(fields.join(',')) // add header column
                    csv = csv.join('\r\n');
                    SendMessage("DownloadJson", "url", this.linkedin_data);

                });
                $("#slow").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeedLinkedin", "Num", 3);
                    $("#slow").addClass('active');
                    $("#fast").removeClass('active');
                    $("#medium").removeClass('active');

                });
                $("#medium").click(function () {
                    var user_plan = $("#plan").attr("name");




                    SendMessage("SetSpeedLinkedin", "Num", 2);
                    $("#medium").addClass('active');
                    $("#slow").removeClass('active');
                    $("#fast").removeClass('active');

                });
                $("#fast").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeedLinkedin", "Num", 1);



                    $("#fast").addClass('active');
                    $("#slow").removeClass('active');
                    $("#medium").removeClass('active');

                });

                $("#set-follow-Linkedin-check").click(function () {
                    SendMessage("SetFollowLinkedin", "Value", $(this).is(':checked'));

                });
                $("#set-like-Linkedin-check").click(function () {
                    SendMessage("SetLikeLinkedin", "Value", $(this).is(':checked'));

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

                $("#set-Linkedin-check").click(function () {
                    SetLinkedinValue($(this).is(':checked'));
                    $("#errors").html("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> To automate Linkedin, open Linkedin.com in a new tab, then log in. Instoo will use your hashtags to like/follow automatically, so add some hashtags.<br> Linkedin is growing 2x faster than Instagram, so it's a useful platform to crosspromote both. Simply add a link to your Instagram in Linkedin bios/videos, or add Linkedin links in Instagram. Let us know how this new feature works for you! :)<br></div>");

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
                    RemoveCollectJobTagLinkedin(this);
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

                SetActiveSidebarItem("#sidebar-home-link2");

            });
        });
    }
}