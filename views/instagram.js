import { BaseView } from "./baseView";

export class InstagramViewHandler extends BaseView {
    constructor() {
        super();
    }

    onStoryMedia(user) {
        let userRow = `
            <tr>
            <td><a href='https://www.instagram.com/` + user.username + `/' target='_blank'><img class='backup_picture img-rounded' width='64' height='64'    src='` + user.user_pic_url + `'/></a></td>
            <td class='align-mid-vertical text-instafollow-td'>` + user.username + `</td><td class='text-instafollow-td align-mid-vertical'>` + user.full_name + `(@` + user.target + `)</td>
            </tr>
            `;
        let follow_block = $("#story-block");
        let follow_table = $(follow_block).find("tbody");
        let table_rows = $(follow_table).find("tr");
        let num_rows = table_rows.length;

        $(follow_table).prepend(userRow);
        if (num_rows > DisplayFollowersNum) {
            let start_delete = num_rows - (num_rows - DisplayFollowersNum);
            $(table_rows).slice(start_delete).remove();
        }
    }

    instagramUpdateMedia(status) {
        this.emptyTable("#like-block");

        for (let i = 0; i < status.LikedMedias.length; i++) {
            this.onTableActions("#like-block", false, false, status.LikedMedias[i]);
        }

        this.emptyTable("#follow-block");

        for (let i = 0; i < status.StoryMedia.length; i++) {
            this.onStoryMedia(status.StoryMedia[i]);
        }

        this.emptyTable("#comment-block");

        for (let i = 0; i < status.CommentedMedias.length; i++) {
            this.onTableActions("#comment-block", false, false, status.CommentedMedias[i]);
        }

        this.prependTags(status.Tags, "#collect-tags-block");
        this.prependTags(status.Locations, "#collect-locations-block");
        this.prependTags(status.Comments, "#collect-comments-block");
    }

    setMode(status) {
        $("#user-pool-num").text(status.UserPoolSize);
        $("#follow-pool-num").text(status.FollowedPoolSize);
        $("#unfollow-pool-num").text(status.UnfollowedPoolSize);
        $("#like-pool-num").text(status.LikePoolSize);

        $("#story-pool-num").text(status.StoryCount);
        $("#comment-pool-num").text(status.CommentPoolSize);

        $("#customRange1").val(status.maxFollows);
        $("#customRange2").val(status.maxUnfollows);
        $("#customRange3").val(status.maxLikes);
        $("#customRange4").val(status.maxComments);
        $("#customRange5").val(status.maxStories);
        $("#follow_set").html("Follows/day: " + status.maxFollows);
        $("#unfollow_set").html("Unfollows/day: " + status.maxUnfollows);
        $("#like_set").html("Likes/day: " + status.maxLikes);
        $("#story_set").html("Stories/day: " + status.maxStories);
        $("#comment_set").html("DMs/day: " + status.maxComments);

        $("#set-follow-check").prop("checked", status.StartFollow);
        $("#set-unfollow-check").prop("checked", status.StartUnfollow);
        $("#set-story-check").prop("checked", status.StartStory);
        $("#set-like-check").prop("checked", status.StartLike);
        $("#set-comment-check").prop("checked", status.StartComment);
    }

    instagramInit() {
        $("#sidebar-home").click(function () {
            $(".content-wrapper").empty();
            $(".content-wrapper").load("home.html", function () {


                dashboardMode = 0;

                $("#tiktoksettings").hide();


                mode = "instagram";
                var data2 = user_stats;
                console.log(data2);
                var chart_data = null;
                chart_data = [];
                follower_data = data2;
                var min = 10000000;
                var max = 0;
                var counter = 0;
                if (started) {
                    var minimum = 10000;
                    var labels = [];
                    for (var index = data2.length - 1; index > data2.length - 100; index--) {
                        if (index >= 0) {
                            var obj = data2[index];
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
                    chart_data.reverse();

                    if (chart_data.length > 1) {
                        $('#growth').html(max - min);
                        if (max - min > 100) {
                        }
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
                                        labelString: 'Folowers'
                                    }
                                }]
                            }
                        }
                    };

                    let ctx = document.getElementById('canvas').getContext('2d');
                    ctx.height = 250;

                    let myLine = new Chart(ctx, config);
                }
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
                    speed_limit = 1000;

                    $("#customRange1").attr("max", speed_limit);
                    $("#customRange2").attr("max", speed_limit);
                    $("#customRange3").attr("max", speed_limit);


                } else {


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


                $("#finalstep").click(function () {
                    $("#set-story-check").prop("checked", true);
                    $("#set-follow-check").prop("checked", true);
                    $("#set-like-check").prop("checked", true);

                    SetStoryValue(true);
                    SetLikeValue(true);
                    SetFollowValue(true);

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

                            SendMessage("SetSpeed", "Speed", 1);

                        } else {
                            buySub();
                        }
                    }

                    if (val == "Slow") {
                        $("#slow").addClass('active');
                        $("#fast").removeClass('active');
                        $("#medium").removeClass('active');
                        SendMessage("SetSpeed", "Speed", 8);


                    }

                    if (val == "Medium") {
                        $("#medium").addClass('active');
                        $("#slow").removeClass('active');
                        $("#fast").removeClass('active');
                        SendMessage("SetSpeed", "Speed", 2);


                    }

                });



                $(".backup_picture").on("error", function () {
                    $(this).attr('src', 'icon.png');
                });



                if (comment_val == true || like_val == true || follow_val == true || unfollow_val == true) {
                    $("#progress").attr("src", "disk.gif");
                } else {
                    $("#progress").attr("src", "icon.gif");
                }

                if (paid_sub) {
                    $("#sub_msg").hide();
                }
                if (paid_sub) {
                    $(".sub-user").hide();

                    $("#purchase").hide();
                    $("#upgrade").hide();

                    $("#customRange1").attr("max", speed_limit);
                    $("#customRange2").attr("max", speed_limit);
                    $("#customRange3").attr("max", speed_limit);
                } else {


                    $("#customRange1").attr("max", speed_limit);
                    $("#customRange2").attr("max", speed_limit);
                    $("#customRange3").attr("max", speed_limit);

                }

                SetActiveSidebarItem("#sidebar-likes_comments");

                SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);



                $("#location_tags").on('itemAdded', function (event) {


                    var tagsinputWidth = 200; // Width of Bootstrap Tags Input.
                    var tagWidth = $('#location_tags').parent().find('.bootstrap-tagsinput span.tag').last().width(); // To get the Width of individual Tag.
                    if (tagWidth > tagsinputWidth) {
                        //If Width of the Tag is more than the width of Container then we crop text of the Tag
                        var tagsText = event.item; // To Get Tags Value
                        var res = tagsText.substr(0, 5); // Here I'm displaying only first 5 Characters.(You can give any number)
                        $('#location_tags').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }


                    var tags = event.item;
                    var split_tags = tags.split("#");

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        if (split_tags[kk].split('#').join('').split(',').join('').split(' ').join('').length > 0) {
                            SendMessage("AddLocationToList", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                            global_locations.push(split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });



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
                    var split_tags = tags.split(",");

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        if (split_tags[kk].split('#').join('').split(',').join('').split(' ').join('').length > 0) {
                            SendMessage("AddTagToList", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                            global_tags.push(split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });

                $("#media_tags2").on('itemAdded', function (event) {


                    var tags = event.item;
                    var split_tags = tags.split(",");

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        if (split_tags[kk].split('#').join('').split(',').join('').split(' ').join('').length > 0) {
                            SendMessage("AddTagToList", "TagName", split_tags[kk].split('#').join('').split(',').join('').split(' ').join(''));
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });

                $("#comment_tags").on('itemAdded', function (event) {


                    var tagsinputWidth = 200; // Width of Bootstrap Tags Input.
                    var tagWidth = $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().width(); // To get the Width of individual Tag.
                    if (tagWidth > tagsinputWidth) {
                        var tagsText = event.item; // To Get Tags Value
                        var res = tagsText.substr(0, 5); // Here I'm displaying only first 5 Characters.(You can give any number)
                        $('#comment_tags').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }


                    var tags = event.item;
                    var split_tags = tags;
                    SendMessage("AddCommentToList", "TagName", tags);


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

                        SendMessage("RemoveTagFromList", "TagName", split_tags[kk].split('#').join(''));
                        var index = global_tags.indexOf(split_tags[kk].split('#').join(''));
                        if (index > -1) {
                            global_tags.splice(index, 1);
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });
                $("#media_tags2").on('itemRemoved', function (event) {


                    var tags = event.item;
                    var split_tags = tags.split("#");

                    for (var kk = 0; kk < split_tags.length; kk++) {

                        SendMessage("RemoveTagFromList", "TagName", split_tags[kk].split('#').join(''));
                        var index = global_tags.indexOf(split_tags[kk].split('#').join(''));
                        if (index > -1) {
                            global_tags.splice(index, 1);
                        }
                    }

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);

                });

                $("#media_accounts").on('itemAdded', function (event) {
                    SendMessage("AddAccountToList", "TagName", event.item);

                    console.log("CODES THAT RUS 1");

                    var tagsinputWidth = 200; // Width of Bootstrap Tags Input.
                    var tagWidth = $('#media_accounts').parent().find('.bootstrap-tagsinput span.tag').last().width(); // To get the Width of individual Tag.
                    if (tagWidth > tagsinputWidth) {
                        //If Width of the Tag is more than the width of Container then we crop text of the Tag
                        var tagsText = event.item; // To Get Tags Value
                        var res = tagsText.substr(0, 5); // Here I'm displaying only first 5 Characters.(You can give any number)
                        $('#media_accounts').parent().find('.bootstrap-tagsinput span.tag').last().html(res + "..." + '<i class="fas fa-times"></i>');
                    }



                    var account_name;


                    var tags = event.item;
                    var split_tags = tags.split(",");

                    for (var kk = 0; kk < split_tags.length; kk++) {
                        if (split_tags[kk].split(',').join('').split(' ').join('').split('@').join('').length > 0) {

                            account_name = split_tags[kk].split(',').join('').split(' ').join('').split('@').join('');

                            global_accounts.push(account_name);
                            if (account_name.match(/^[0-9a-z._]+$/) || account_name.includes(".") || account_name.includes("_")) {
                                if (account_name.includes("https://")) {
                                    account_name = account_name.split("/")[3];
                                }
                                SendMessage("CollectFromAccount", "account_name", account_name);
                            }



                        }
                    }


                });




                $("#media_accounts").on('itemRemoved', function (event) {
                    SendMessage("RemoveAccountFromList", "TagName", event.item);
                    var index = global_accounts.indexOf(event.item);
                    if (index > -1) {
                        global_accounts.splice(index, 1);
                    }
                    var index = global_tags.indexOf(event.item);
                    if (index > -1) {
                        global_tags.splice(index, 1);
                    }
                    var account_name = event.item;





                });




                $("#customRange5").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRange5").val()) > 10000) {
                            var input = document.getElementById("customRange5");
                            input.value = 10000;

                        }
                    }
                    follow_speed = parseInt($("#customRange1").val());
                    unfollow_speed = parseInt($("#customRange2").val());
                    like_speed = parseInt($("#customRange3").val());
                    story_speed = parseInt($("#customRange5").val());
                    comment_speed = parseInt($("#customRange4").val());


                    $("#story_set").html("Stories/day: " + $("#customRange5").val());


                    var settings = {
                        FollowSettings: {},
                        UnfollowSettings: {},
                        LikeSettings: {},
                        CommentSettings: {},
                        CollectFollowers: {},
                        CollectFollowings: {},
                        StorySettings: {},
                        TikTokSettings: {}
                    };
                    settings.FollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.UnfollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowers = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.LikeSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CommentSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.StorySettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };

                    settings.TikTokSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.FollowSettings.TimeMin = follow_speed;
                    settings.FollowSettings.TimeMax = follow_speed + 10;
                    settings.FollowSettings.ErrorTime = 400;

                    settings.UnfollowSettings.TimeMin = unfollow_speed;
                    settings.UnfollowSettings.TimeMax = unfollow_speed + 10;
                    settings.UnfollowSettings.ErrorTime = 400;


                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = like_speed;
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 400;

                    settings.StorySettings.TimeMin = story_speed;
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 400;
                    settings.CollectFollowers.Pool = 1000;
                    settings.CollectFollowers.Interval = 100;
                    settings.CollectFollowers.ErrorTime = 200;

                    settings.CollectFollowings.Pool = 1000;
                    settings.CollectFollowings.Interval = 100;
                    settings.CollectFollowings.ErrorTime = 200;


                    settings.TikTokSettings.TimeMin = tiktok_speed;
                    settings.TikTokSettings.TimeMax = tiktok_speed + 10;
                    settings.TikTokSettings.ErrorTime = 400;

                    settings.UnfollowAfterDays = UnfollowAfterDays;



                    SendMessage("UpdateSettings", "Settings", settings);


                    settings.FollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin));
                    settings.FollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin)) + 10;
                    settings.FollowSettings.ErrorTime = 200;

                    settings.UnfollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin));
                    settings.UnfollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin)) + 10;
                    settings.UnfollowSettings.ErrorTime = 200;

                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.LikeSettings.TimeMin));
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 200;

                    settings.StorySettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.StorySettings.TimeMin));
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 200;
                    global_settings = settings;

                });
                $("#customRange4").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRange4").val()) > 1000) {
                            var input = document.getElementById("customRange4");
                            input.value = 1000;

                        }
                    }
                    follow_speed = parseInt($("#customRange1").val());
                    unfollow_speed = parseInt($("#customRange2").val());
                    like_speed = parseInt($("#customRange3").val());
                    story_speed = parseInt($("#customRange5").val());
                    comment_speed = parseInt($("#customRange4").val());


                    $("#comment_set").html("DMs/day: " + $("#customRange4").val());


                    var settings = {
                        FollowSettings: {},
                        UnfollowSettings: {},
                        LikeSettings: {},
                        CommentSettings: {},
                        CollectFollowers: {},
                        CollectFollowings: {},
                        StorySettings: {},
                        TikTokSettings: {}
                    };
                    settings.FollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.UnfollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowers = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.LikeSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CommentSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.StorySettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };

                    settings.TikTokSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.FollowSettings.TimeMin = follow_speed;
                    settings.FollowSettings.TimeMax = follow_speed + 10;
                    settings.FollowSettings.ErrorTime = 400;

                    settings.UnfollowSettings.TimeMin = unfollow_speed;
                    settings.UnfollowSettings.TimeMax = unfollow_speed + 10;
                    settings.UnfollowSettings.ErrorTime = 400;


                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = like_speed;
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 400;

                    settings.StorySettings.TimeMin = story_speed;
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 400;
                    settings.CollectFollowers.Pool = 1000;
                    settings.CollectFollowers.Interval = 100;
                    settings.CollectFollowers.ErrorTime = 200;

                    settings.CollectFollowings.Pool = 1000;
                    settings.CollectFollowings.Interval = 100;
                    settings.CollectFollowings.ErrorTime = 200;


                    settings.TikTokSettings.TimeMin = tiktok_speed;
                    settings.TikTokSettings.TimeMax = tiktok_speed + 10;
                    settings.TikTokSettings.ErrorTime = 400;

                    settings.UnfollowAfterDays = UnfollowAfterDays;



                    SendMessage("UpdateSettings", "Settings", settings);


                    settings.FollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin));
                    settings.FollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin)) + 10;
                    settings.FollowSettings.ErrorTime = 200;

                    settings.UnfollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin));
                    settings.UnfollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin)) + 10;
                    settings.UnfollowSettings.ErrorTime = 200;

                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.LikeSettings.TimeMin));
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 200;

                    settings.StorySettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.StorySettings.TimeMin));
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 200;
                    global_settings = settings;

                });

                $("#customRange1").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRange1").val()) > 1000) {
                            var input = document.getElementById("customRange1");
                            input.value = 1000;

                        }
                    }

                    follow_speed = parseInt($("#customRange1").val());
                    unfollow_speed = parseInt($("#customRange2").val());
                    like_speed = parseInt($("#customRange3").val());
                    story_speed = parseInt($("#customRange5").val());
                    comment_speed = parseInt($("#customRange4").val());

                    $("#follow_set").html("Follows/day: " + $("#customRange1").val());


                    var settings = {
                        FollowSettings: {},
                        UnfollowSettings: {},
                        LikeSettings: {},
                        CommentSettings: {},
                        CollectFollowers: {},
                        CollectFollowings: {},
                        StorySettings: {},
                        TikTokSettings: {}
                    };
                    settings.FollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.UnfollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowers = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.LikeSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CommentSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.StorySettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.TikTokSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.FollowSettings.TimeMin = follow_speed;
                    settings.FollowSettings.TimeMax = follow_speed + 10;
                    settings.FollowSettings.ErrorTime = 400;

                    settings.UnfollowSettings.TimeMin = unfollow_speed;
                    settings.UnfollowSettings.TimeMax = unfollow_speed + 10;
                    settings.UnfollowSettings.ErrorTime = 400;

                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = like_speed;
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 400;


                    settings.StorySettings.TimeMin = story_speed;
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 400;

                    settings.CollectFollowers.Pool = 1000;
                    settings.CollectFollowers.Interval = 100;
                    settings.CollectFollowers.ErrorTime = 200;

                    settings.CollectFollowings.Pool = 1000;
                    settings.CollectFollowings.Interval = 100;
                    settings.CollectFollowings.ErrorTime = 200;


                    settings.TikTokSettings.TimeMin = tiktok_speed;
                    settings.TikTokSettings.TimeMax = tiktok_speed + 10;
                    settings.TikTokSettings.ErrorTime = 400;
                    settings.UnfollowAfterDays = UnfollowAfterDays;



                    SendMessage("UpdateSettings", "Settings", settings);

                    settings.FollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin));
                    settings.FollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin)) + 10;
                    settings.FollowSettings.ErrorTime = 200;

                    settings.UnfollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin));
                    settings.UnfollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin)) + 10;
                    settings.UnfollowSettings.ErrorTime = 200;

                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.LikeSettings.TimeMin));
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 200;

                    settings.StorySettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.StorySettings.TimeMin));
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 200;

                    global_settings = settings;


                });

                $("#customRange2").change(function () {
                    if (paid_sub === false) {
                        if (parseInt($("#customRange2").val()) > 1000) {
                            var input = document.getElementById("customRange2");
                            input.value = 1000;

                        }
                    }
                    follow_speed = parseInt($("#customRange1").val());
                    unfollow_speed = parseInt($("#customRange2").val());
                    like_speed = parseInt($("#customRange3").val());
                    story_speed = parseInt($("#customRange5").val());
                    comment_speed = parseInt($("#customRange4").val());

                    $("#unfollow_set").html("Unfollows/day: " + $("#customRange2").val());


                    var settings = {
                        FollowSettings: {},
                        UnfollowSettings: {},
                        LikeSettings: {},
                        CommentSettings: {},
                        CollectFollowers: {},
                        CollectFollowings: {},
                        StorySettings: {},
                        TikTokSettings: {}
                    };
                    settings.FollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.UnfollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowers = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.LikeSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CommentSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.StorySettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.TikTokSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.FollowSettings.TimeMin = follow_speed;
                    settings.FollowSettings.TimeMax = follow_speed + 10;
                    settings.FollowSettings.ErrorTime = 200;

                    settings.UnfollowSettings.TimeMin = unfollow_speed;
                    settings.UnfollowSettings.TimeMax = unfollow_speed + 10;
                    settings.UnfollowSettings.ErrorTime = 200;


                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = like_speed;
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 200;

                    settings.StorySettings.TimeMin = story_speed;
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 400;

                    settings.CollectFollowers.Pool = 1000;
                    settings.CollectFollowers.Interval = 100;
                    settings.CollectFollowers.ErrorTime = 200;

                    settings.CollectFollowings.Pool = 1000;
                    settings.CollectFollowings.Interval = 100;
                    settings.CollectFollowings.ErrorTime = 200;


                    settings.TikTokSettings.TimeMin = tiktok_speed;
                    settings.TikTokSettings.TimeMax = tiktok_speed + 10;
                    settings.TikTokSettings.ErrorTime = 400;


                    settings.UnfollowAfterDays = UnfollowAfterDays;

                    SendMessage("UpdateSettings", "Settings", settings);

                    settings.FollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin));
                    settings.FollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin)) + 10;
                    settings.FollowSettings.ErrorTime = 200;

                    settings.UnfollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin));
                    settings.UnfollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin)) + 10;
                    settings.UnfollowSettings.ErrorTime = 200;

                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.LikeSettings.TimeMin));
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 200;

                    settings.StorySettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.StorySettings.TimeMin));
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 200;
                    global_settings = settings;


                });

                $("#customRange3").change(function () {
                    if (paid_sub == false) {
                        if (parseInt($("#customRange3").val()) > 1000) {
                            var input = document.getElementById("customRange3");
                            input.value = 1000;

                        }
                    }

                    follow_speed = parseInt($("#customRange1").val());
                    unfollow_speed = parseInt($("#customRange2").val());
                    like_speed = parseInt($("#customRange3").val());
                    story_speed = parseInt($("#customRange5").val());
                    comment_speed = parseInt($("#customRange4").val());

                    $("#like_set").html("Likes/day: " + $("#customRange3").val());

                    var settings = {
                        FollowSettings: {},
                        UnfollowSettings: {},
                        LikeSettings: {},
                        CommentSettings: {},
                        CollectFollowers: {},
                        CollectFollowings: {},
                        StorySettings: {},
                        TikTokSettings: {}
                    };
                    settings.FollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.UnfollowSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowers = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CollectFollowings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.LikeSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.CommentSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };
                    settings.StorySettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };

                    settings.TikTokSettings = {
                        TimeMin: 0,
                        TimeMax: 0,
                        ErrorTime: 0
                    };

                    settings.FollowSettings.TimeMin = follow_speed;
                    settings.FollowSettings.TimeMax = follow_speed + 10;
                    settings.FollowSettings.ErrorTime = 200;

                    settings.UnfollowSettings.TimeMin = unfollow_speed;
                    settings.UnfollowSettings.TimeMax = unfollow_speed + 10;
                    settings.UnfollowSettings.ErrorTime = 200;

                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = like_speed;
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 200;


                    settings.StorySettings.TimeMin = story_speed;
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 400;

                    settings.CollectFollowers.Pool = 1000;
                    settings.CollectFollowers.Interval = 100;
                    settings.CollectFollowers.ErrorTime = 200;

                    settings.CollectFollowings.Pool = 1000;
                    settings.CollectFollowings.Interval = 100;
                    settings.CollectFollowings.ErrorTime = 200;



                    settings.TikTokSettings.TimeMin = tiktok_speed;
                    settings.TikTokSettings.TimeMax = tiktok_speed + 10;
                    settings.TikTokSettings.ErrorTime = 400;



                    settings.UnfollowAfterDays = UnfollowAfterDays;

                    SendMessage("UpdateSettings", "Settings", settings);


                    settings.FollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin));
                    settings.FollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.FollowSettings.TimeMin)) + 10;
                    settings.FollowSettings.ErrorTime = 200;

                    settings.UnfollowSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin));
                    settings.UnfollowSettings.TimeMax = Math.floor((16 * 60 * 60) / parseInt(settings.UnfollowSettings.TimeMin)) + 10;
                    settings.UnfollowSettings.ErrorTime = 200;

                    settings.CommentSettings.TimeMin = comment_speed;
                    settings.CommentSettings.TimeMax = 450;
                    settings.CommentSettings.ErrorTime = 1800;

                    settings.LikeSettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.LikeSettings.TimeMin));
                    settings.LikeSettings.TimeMax = like_speed + 10;
                    settings.LikeSettings.ErrorTime = 200;

                    settings.StorySettings.TimeMin = Math.floor((16 * 60 * 60) / parseInt(settings.StorySettings.TimeMin));
                    settings.StorySettings.TimeMax = story_speed + 10;
                    settings.StorySettings.ErrorTime = 200;
                    global_settings = settings;

                });

                SendMessage("RequestFollowStatus", "Num", DisplayFollowersNum);
                $("#slow").click(function () {
                    var user_plan = $("#plan").attr("name");

                    SendMessage("SetSpeed", "Num", 3);
                    $("#slow").addClass('active');
                    $("#fast").removeClass('active');
                    $("#medium").removeClass('active');

                });
                $("#medium").click(function () {
                    var user_plan = $("#plan").attr("name");




                    SendMessage("SetSpeed", "Num", 2);
                    $("#medium").addClass('active');
                    $("#slow").removeClass('active');
                    $("#fast").removeClass('active');

                });
                $("#fast").click(function () {
                    var user_plan = $("#plan").attr("name");


                    SendMessage("SetSpeed", "Num", 1);



                    $("#fast").addClass('active');
                    $("#slow").removeClass('active');
                    $("#medium").removeClass('active');
                });
                $("#set-follow-check").click(function () {
                    $("#set-unfollow-check").prop("checked", false);
                    SetUnfollowValue(false);
                    SetFollowValue($(this).is(':checked'));
                    follow_val = $(this).is(':checked');
                    if (follow_val) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", true);
                    }
                    if (comment_val == true || like_val == true || follow_val == true || unfollow_val == true) {
                        $("#progress").attr("src", "disk.gif");
                    } else {
                        $("#progress").attr("src", "icon.gif");
                    }

                });
                $("#set-like-check").click(function () {

                    SetLikeValue($(this).is(':checked'));
                    like_val = $(this).is(':checked');
                    if (like_val) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", status.StartLike);
                    }

                    if (comment_val == true || like_val == true || follow_val == true || unfollow_val == true) {
                        $("#progress").attr("src", "disk.gif");
                    } else {
                        $("#progress").attr("src", "icon.gif");
                    }

                });


                $("#set-story-check").click(function () {
                    SetStoryValue($(this).is(':checked'));
                    like_val = $(this).is(':checked');
                    if (comment_val == true || like_val == true || follow_val == true || unfollow_val == true) {
                        $("#progress").attr("src", "disk.gif");
                    } else {
                        $("#progress").attr("src", "icon.gif");
                    }

                    if (like_val != true) {
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
                    comment_val = $(this).is(':checked');
                    if (comment_val == true || like_val == true || follow_val == true || unfollow_val == true) {
                        $("#progress").attr("src", "disk.gif");
                    } else {
                        $("#progress").attr("src", "icon.gif");
                    }
                    if (comment_val) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", status.StartLike);
                    }

                });
                $(document).on('click', '.remove-user-collect', function () {
                    RemoveCollectJobUser(this);

                });
                $(document).on('click', '.remove-tag-collect', function () {
                    RemoveCollectJobTag(this);
                });
                $(document).on('click', '.remove-location-collect', function () {
                    RemoveLocationJobTag(this);
                });
                $(document).on('click', '.remove-comment-collect', function () {

                    var user_id = $(this).attr("user_id");
                    $(this).closest("tr").remove();


                    SendMessage("RemoveCommentFromList", "TagName", user_id);
                    //  var index = global_tags.indexOf(user_id);

                    SendMessage("RequestMediaStatus", "Num", DisplayLikesNum);
                    //  SendMessage("RemoveCommentFromList", "TagName", );
                });




                $("#set-unfollow-check").click(function () {
                    $("#set-follow-check").prop("checked", false);
                    SetFollowValue(false);

                    SetUnfollowValue($(this).is(':checked'));
                    unfollow_val = $(this).is(':checked');
                    if (unfollow_val) {
                        SetStoryValue($(this).is(':checked'));
                        $("#set-story-check").prop("checked", true);
                    }
                    if (comment_val == true || like_val == true || follow_val == true || unfollow_val == true) {
                        $("#progress").attr("src", "disk.gif");
                    } else {
                        $("#progress").attr("src", "icon.gif");
                    }

                });

                SetActiveSidebarItem("#sidebar-home");



                if (comment_val == true || like_val == true || follow_val == true || unfollow_val == true) {
                    $("#progress").attr("src", "disk.gif");
                } else {
                    $("#progress").attr("src", "icon.gif");
                }


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
                $("#startinstagram").parent().addClass("active");
                SetActiveSidebarItem("#sidebar-home");
            });
        });
    }
}