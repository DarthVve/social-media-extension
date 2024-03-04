import { controller, model } from "..";

export class BaseView {
    constructor() {
        super();
        this.displayFollowersNum = 10;
        this.htmlMedia = "<br><br><table style='border: 1px solid black; padding:10px; width:100%;'><tr><td></td><td>Contact</td><td>Email</td><td>Sales</td><td>Target</td><td>Website</td><td>Twitter</td><td>Birthday</td><td>Connected</td></tr>";
    }

    extensionIconSettings(badgeColorObject, badgeText, extensionTitle) {
        chrome.browserAction.setBadgeBackgroundColor(badgeColorObject);
        chrome.browserAction.setBadgeText({
            text: badgeText
        });
        chrome.browserAction.setTitle({
            title: extensionTitle
        });
    }

    scrollTop(starter) {
        if (starter > 0) {
            window.scrollTo(0, document.body.scrollHeight);
            setTimeout(function () {
                scrollTop(starter - 1)
            }, 300);
        }
    }

    setMinMax() {
        let doc = document.getElementById(`${elementId}`).value;
        controller.sendMessage(`${elementId}`, `${elementId}`, doc);
    }

    whiteListUser() {
        let user = prompt("Please enter the username exactly");
        if (user) {
            let split_users = user.split(",");
            for (let kk = 0; kk < split_users.length; kk++) {
                controller.sendMessage("AddUserToWhitelistName", "username", split_users[kk].split(',').join('').split(' ').join('').split('@').join(''));
            }

            $("#add-user-results").empty();
            $("#add-user-search").val("");
        }

        let user_id = $(input).attr("user_id");
        $(input).closest("li").remove();

        controller.sendMessage("AddUserToWhitelist", "user_id", user_id);
    }

    clearWhitelist() {
        controller.sendMessage("ClearWhitelist", "", "");
    }

    filterWhitelistSearch(input) {
        let text = $(input).val().toLowerCase();
        let whitelist_block = $("#whitelisted-users");
        $(whitelist_block).find("tr").each(function (el) {
            if ($(el).text().toLowerCase().indexOf(text) < 0 && text != "") {
                $(el).hide();
            } else {
                $(el).show();
            }
        });
    }

    removeWhitelistedUser(button) {
        let user_id = $(button).attr("user_id");
        $(button).closest("tr").remove();

        controller.sendMessage("RemoveWhitelistUser", "user_id", user_id);
    }

    clearFilters() {
        controller.sendMessage("ClearFilters", "user", "");
    }

    blackListUser() {
        let new_blacklist = prompt("Please enter a username exactly to add it to the blacklist:");
        if (new_blacklist && new_blacklist.includes(",")) {
            let split = new_blacklist.split(",");
            for (let kk = 0; kk < split.length; kk++) {
                controller.sendMessage("AddToBlacklist", "user", split[kk].split("@").join(""));
                controller.sendMessage("AddToFilters", "user", split[kk].split("@").join(""));
            }
        } else if (new_blacklist.includes(" ")) {
            let split = new_blacklist.split(" ");
            for (let kk = 0; kk < split.length; kk++) {
                controller.sendMessage("AddToBlacklist", "user", split[kk].split("@").join(""));
                controller.sendMessage("AddToFilters", "user", split[kk].split("@").join(""));
            }
        } else {
            controller.sendMessage("AddToBlacklist", "user", new_blacklist.split("@").join(""));
            controller.sendMessage("AddToFilters", "user", new_blacklist.split("@").join(""));
        }

        let followers_string = "";
        for (let kk = 0; kk < model.user_followers.length; kk++) {
            followers_string += model.user_followers[kk] + ", ";
        }

        let ideal_targets_string = "";
        for (let kk = 0; kk < IdealTargets.length; kk++) {
            ideal_targets_string += model.idealTargets[kk].username + " followers: " + model.idealTargets[kk].followers + "<br> ";
        }

        let blacklist_string = "";
        for (let kk = 0; kk < blacklist.length; kk++) {
            b += blacklist[kk] + ",  ";
        }

        let filter_string = "";
        for (let kk = 0; kk < model.filters.length; kk++) {
            filter_string += model.filters[kk] + ",  ";
        }

        $("#followers_list").html("Followers " + user_followers.length + "/" + follow_count_num + ": " + followers_string + "<br>");
        $("#activity_log").html("<br>Activity Log: <br>" + activity_log);
        $("#blacklist").html("<br>Blacklist of profiles to never re-visit:  <br>" + blacklist_string);
        $("#filters").html("<br>Words to avoid in bio text and photo content:  <br>" + filter_string);
        $("#IdealTargets").html("<br>Ideal Account Targets: <br>" + ideal_targets_string);
    }

    setActiveSidebarItem(sidebar_id) {
        let toggle = true;
        if (toggle) {
            $(sidebar_id).addClass("sidebar-item");
            $(sidebar_id).addClass("sidebar-item-active");
        } else {
            $(sidebar_id).removeClass("sidebar-item");
            $(sidebar_id).removeClass("sidebar-item-active");
        }
    }

    eventHandler(event, elementId, eventCallback) {
        $(document).on(`${event}`, `#${elementId}`, function (e) {
            eventCallback();
        });
    }

    setViewSettings() {
        $("#input-follow-time-min").val(model.settings.FollowSettings.TimeMin);
        $("#input-follow-time-max").val(model.settings.FollowSettings.TimeMax);
        $("#input-follow-error-time").val(model.settings.FollowSettings.ErrorTime);

        $("#input-unfollow-time-min").val(model.settings.UnfollowSettings.TimeMin);
        $("#input-unfollow-time-max").val(model.settings.UnfollowSettings.TimeMax);
        $("#input-unfollow-error-time").val(model.settings.UnfollowSettings.ErrorTime);

        $("#input-user-pool-num").val(model.settings.CollectFollowers.Pool);
        $("#input-user-collect-time").val(model.settings.CollectFollowers.Interval);
        $("#input-user-error-time").val(model.settings.CollectFollowers.ErrorTime);

        $("#input-following-pool-num").val(model.settings.CollectFollowings.Pool);
        $("#input-following-collect-time").val(model.settings.CollectFollowings.Interval);
        $("#input-following-error-time").val(model.settings.CollectFollowings.ErrorTime);

        $("#input-unfollow-days").val(model.settings.UnfollowAfterDays);
        $("#set-slow-check").prop("checked", model.settings.slow);
        $("#set-cloud-check").prop("checked", model.user_cloud && model.cloud_backup);
    }

    removeCollectJobTag(button, tag) {
        let user_id = $(button).attr("user_id");
        $(button).closest("tr").remove();

        controller.sendMessage(tag, "TagName", user_id);
        let index = model.global_tags.indexOf(user_id);
        if (index > -1) {
            model.global_tags.splice(index, 1);
        }
        controller.sendMessage("RequestMediaStatus", "Num", model.displayLikesNum);
    }

    removeCollectJobUser(button) {
        let user_id = $(button).attr("user_id");
        $(button).closest("tr").remove();
        controller.sendMessage("RemoveCollectJob", "user_id", user_id);
        controller.sendMessage("RemoveAccountFromList", "TagName", user_id);
    }

    setWhitelistStatus(status) {
        $("#whitelist-followings").prop("checked", status.Enabled);
    }

    parseLicenseView() {
        $("#purchase").hide();
        $("#upgrade").hide();
        $(".sub-user").hide();
        $("#customRange1").attr("max", speed_limit);
        $("#customRange2").attr("max", speed_limit);
        $("#customRange3").attr("max", speed_limit);
    }

    clearWhitelistTable() {
        $("#whitelisted-users").empty();
    }

    processFilteredFollowings(users) {
        let filter_users_block = $("#add-user-results");
        filter_users_block.empty();
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let userRow = `
                <li class="add-whitelist-user" user_id=` + user.user_id + `>
                <div class="row">
                <div class="col-md-2"> ` + i + `. <a href='https://www.instagram.com/` + user.username + `/' target='_blank'><img class='backup_picture img-rounded' width='64'  height='64' src='` + user.user_pic_url + `'/></a></div>
                <div class='col-md-5 align-mid-vertical text-instafollow-td'>` + user.username + `</div><div class='col-md-5 text-instafollow-td align-mid-vertical'>` + user.full_name + `</div>
                </div>
                </li>
                `;
            $(filter_users_block).append(userRow);
        }
    }

    addedWhitelistUsers(users) {
        let whitelist_block = $("#whitelisted-users");
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            let userRow = `
                <tr>
                <td> ` + i + `. <a href='https://www.instagram.com/` + user.username + `/' target='_blank'><img class='backup_picture img-rounded' width='64' height='64'    src='` + user.user_pic_url + `'/></a></td>
                <td class='align-mid-vertical text-instafollow-td'>` + user.username + `</td><td class='text-instafollow-td align-mid-vertical'>` + user.full_name + `</td>
                <td style="vertical-align: middle;">
                <button class="btn-danger remove-user-whitelist" user_id=` + user.user_id + `><i class="fas fa-times"></i></button></td>
                </tr>
                `;
            $(whitelist_block).prepend(userRow);
        }

        this.filterWhitelistSearch($("#user-search"));
    }

    prependTags(tags, elementId) {
        let tag_block = $(elementId);
        let tag_table = $(tag_block).find("tbody");
        $(tag_table).empty();
        let added_tags = [];
        for (let i = 0; i < tags.length; i++) {
            let index = model.global_tags.indexOf(tags[i].tag_name + "<br>");
            if (index == -1) {
                model.global_tags.push(tags[i].tag_name + "<br>");
            }

            const user = tags.Tagsfacebook[i].tag_name;
            if (true) {
                added_tags.push(user);

                let userRow = `
                    <tr><td style="vertical-align: middle;">
                    <button class="btn-danger remove-tag-collect" user_id='` + user + `'><i class="fas fa-times"></i></button></td>
                    <td>#</td>
                    <td class='align-mid-vertical text-instafollow-td'>` + user + `</td>
                    
                    </tr>
                    `;
                $(tag_table).prepend(userRow);
            }
        }
    }

    emptyTable(elementId) {
        let block = $(elementId);
        let table = $(block).find("tbody");
        $(table).empty();
    }

    updateCollectJobStatus(jobs) {
        this.emptyTable("#collect-users-block");
        this.prependTags(jobs, "#collect-users-block");
    }

    updateCollectTags(jobs) {
        this.emptyTable("#collect-tags-block");
        this.prependTags(jobs, "#collect-tags-block");
    }

    onTableActions(elementId, media, user, dataObj) {
        let row = media ?
            `<tr>
            <td><a href=${dataObj.url} target='_blank'><img class='backup_picture img-rounded' width='64' height='64'   src='` + dataObj.img + `'/></a></td>
            <td class='align-mid-vertical text-instafollow-td'>` + dataObj.username + `</td>
            </tr>`
            : user ?
                `<tr>
                    <td><a href='https://www.instagram.com/` + user.username + `/' target='_blank'><img class='backup_picture img-rounded' width='64' height='64' src='` + user.user_pic_url + `' /></a></td>
                    <td class='align-mid-vertical text-instafollow-td'>` + user.username + `</td><td class='text-instafollow-td align-mid-vertical'>` + user.full_name + `</td>
                </tr>`
                :
                `<tr>
            <td><a href=${dataObj.url + dataObj.username} target='_blank'><img class='backup_picture img-rounded' width='64' height='64'    src='` + dataObj.user_pic_url + `'/></a></td>
            <td class='align-mid-vertical text-instafollow-td'>` + dataObj.username + `</td><td class='text-instafollow-td align-mid-vertical'>` + dataObj.full_name + `</td>
            </tr>`;

        let block = $(elementId);
        let table = $(block).find("tbody");
        $(table).prepend(row);
        let table_rows = $(table).find("tr");
        let num_rows = table_rows.length;

        if (num_rows > this.displayFollowersNum) {
            let start_delete = num_rows - (num_rows - this.displayFollowersNum);
            $(table_rows).slice(start_delete).remove();
        }
    }

    updateFollowStatus(allUsers) {
        let followedUsers = allUsers.FollowedUsers;
        let unfollowedUsers = allUsers.UnfollowedUsers;
        let follow_block = $("#follow-block");
        let follow_table = $(follow_block).find("tbody");
        let unfollow_block = $("#unfollow-block");
        let unfollow_table = $(unfollow_block).find("tbody");

        $(follow_table).empty()
        $(unfollow_table).empty();

        for (var i = 0; i < followedUsers.length; i++) {
            this.onTableActions("#follow-block", false, false, followedUsers[i]);
        }

        for (var i = 0; i < unfollowedUsers.length; i++) {
            this.onTableActions("#unfollow-block", false, false, unfollowedUsers[i],);
        }
    }

    onLikedMedia(mediaObj, elementId) {
        model.likeCount++;
        this.onTableActions(elementId, mediaObj);
    }

    messageListener() {
        this.emptyTable("#crm-table");
        this.htmlMedia += "</table><script>function editInstaConnected(num){ window.postMessage({mode: 'Instaconnected' ,edit: num} , '*');} function editInstaBirthday(num){ window.postMessage({mode: 'Instabirthday' ,edit: num} , '*');}function editInstaTwitter(num){ window.postMessage({mode: 'Instatwitter' ,edit: num} , '*');} function editInstaWebsite(num){ window.postMessage({mode: 'Instawebsite' ,edit: num} , '*');} function editInstaTarget(num){ window.postMessage({mode: 'Instatarget' ,edit: num} , '*');} function editInstaSales(num){ window.postMessage({mode: 'Instasales' ,edit: num} , '*');}function editInstaEmail(num){ window.postMessage({mode: 'Instaemail' ,edit: num} , '*');}function editConnected(num){ window.postMessage({mode: 'connected' ,edit: num} , '*');} function editBirthday(num){ window.postMessage({mode: 'birthday' ,edit: num} , '*');}function editTwitter(num){ window.postMessage({mode: 'twitter' ,edit: num} , '*');} function editWebsite(num){ window.postMessage({mode: 'website' ,edit: num} , '*');} function editTarget(num){ window.postMessage({mode: 'target' ,edit: num} , '*');} function editSales(num){ window.postMessage({mode: 'sales' ,edit: num} , '*');}function editEmail(num){ window.postMessage({mode: 'email' ,edit: num} , '*');}</script>";
        $(block).html(html);

        let target_block = $("#target-table");
        let target_table = $(target_block).find("tbody");
        $(target_table).empty();
        let html_target = "<br><br><table style='  border: 1px solid black; padding:10px; width:100%;'><tr><td>Target</td><td>Sales</td><td>Leads</td><td>Gained Followers</td></tr>";
        for (let key in target_dic) {
            if (target_dic.hasOwnProperty(key)) {
                html_target += "<tr><td>" + key + "</td><td>" + this.target_dic[key].sales + "</td><td> " + this.target_dic[key].leads + "</td><td>" + this.target_dic[key].connected + "</td></tr>";
            }
        }

        html_target += "</table>";
        $(target_block).html(html_target);
    }

    setSpeed(speed) {
        $("#fast").removeClass('active');
        $("#slow").removeClass('active');
        $("#medium").addClass('active');
        $("#errors").html("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button> Instoo has detected you have a smaller account with under 1,000 followers. Speeds will naturally ramp up to 2x faster after you pass 1,000 followers.<br><br></div>");
        controller.sendMessage("SetSpeed", "Num", speed);
    }

    setValues() {
        controller.setFollowValue(false);
        controller.setUnfollowValue(false);
        controller.setStoryValue(false);
        $("#set-story-check").prop("checked", false);
        $("#set-follow-check").prop("checked", false);
        $("#set-unfollow-check").prop("checked", false);
        $("#set-story-check").prop("checked", false);
        $("#set-like-check").prop("checked", false);
        $("#set-comment-check").prop("checked", false);
    }

    displayLimits(status) {
        if (status.StoryTime.Time / status.StoryTime.Max < -.05 && $("#set-story-check").is(':checked')) {
            $("#errors").html("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>You have not added any targets. Please add some account targets.</div>");
        }
        if (status.StartStory) {
            $("#container").html((status.StoryTime.Time).toFixed(0) + " seconds till next action<br>" + hoursLeft + " Hours Left Today");
        }
        if (mode == "twitter" && (status.StartTwitterLike || status.StartTwitterFollow)) {
            $("#container").html((status.TwitterTime.Time).toFixed(0) + " seconds till next action<br>" + hoursLeft + " Hours Left Today");
        }
        if (mode == "tiktok" && (status.StartTikTokLike || status.StartTikTokFollow)) {
            $("#container").html((status.TikTokTime.Time).toFixed(0) + " seconds till next action<br>" + hoursLeft + " Hours Left Today");
        }
        if (mode == "facebook" && (status.StartfacebookLike || status.StartfacebookFollow)) {
            $("#container").html((status.facebookTime.Time).toFixed(0) + " seconds till next action<br>" + hoursLeft + " Hours Left Today");
        }
    }

    loadAccount(status) {
        $("#overlay").hide();
        $(".img-current-user").attr("src", status.CurrentUser.user_pic_url);
        $(".img-current-user").show();
    }

    injectHTML(html, block) {
        $(block).html(html);
    }

    prependError(msg) {
        $("#errors").prepend("<div class='alert alert-success alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>Instoo is looping your targets(" + msg.Media + "), which means they do not actively gain followers fast enough.<br><b> If you have 20+ account targets, please remove these. You should add 20 more account targets with under 100k followers.</b><br> Bot auto-turned off to avoid looping the same targets. The first day after adding new targets, make sure they actively gain relevant followers. It will tell you which target all profiles came from on the Instagram tab and Instoo tab,so you can remove irrelevant ones. </div>");
    }

    userLoggedIn() {
        model.logged_in = true;
        model.loadedAccounts = false;
        SendMessage("RequestFollowStatus", "Num", DisplayFollowersNum);
        $("#overlay").hide();
        if (model.paid_sub) {
            SendMessage("SetPaidMode", "paid", true);
            $('.sub-user').hide();
            $("#purchase").hide();
            $("#upgrade").hide();
            $("#customRange1").attr("max", model.speed_limit);
            $("#customRange2").attr("max", model.speed_limit);
            $("#customRange3").attr("max", model.speed_limit);
        } else {
            $("#customRange1").attr("max", model.speed_limit);
            $("#customRange2").attr("max", model.speed_limit);
            $("#customRange3").attr("max", model.speed_limit);
        }

        if (model.comment_val == true || model.like_val == true || model.follow_val == true || model.unfollow_val == true) {
            $("#progress").attr("src", "disk.gif");
        } else {
            $("#progress").attr("src", "icon.gif");
        }
    }

    userLoggedOut() {
        model.logged_in = false;
        model.loadedAccounts = false;
        if (!model(model.mode == "twitter") && !(model.mode == "tiktok") && !$("#set-story-check").is(':checked') && !$("#set-like-check").is(':checked') && !$("#set-follow-check").is(':checked') && !$("#set-unfollow-check").is(':checked') && !$("#set-comment-check").is(':checked')) {
            $("#overlay").show();
        }
        setTimeout(function () {
            if (!logged_in) {
                controller.sendMessage("OpenInstagram", "Speed", 1);
            }
        }, 10000);
    }

    init() {
        $("#userLogin").show();
        $("#starttiktok").parent().removeClass("hide");
        $("#startinstagram").parent().addClass("active");
        $("#starttiktok").parent().removeClass("active");
        $('#version').attr('name', version);
        $("#sidebar-wrapper").show();
        $("#userLogin").click(function () {
            controller.sendMessage("userLogin", "", "");
        });
        this.eventHandler("click", '.remove-user-whitelist', this.removeWhitelistedUser);
        this.eventHandler("click", '#clear-whitelist', function (event) {
            SendMessage("ClearWhite", "", "");
        });
        $("#cloud-backup").click(function () {
            alert("Settings saved to cloud!");
        });

        $("#cloud-clear").click(function () {
            SendMessage("ResetAll", "", "");
            alert("Cloud backup cleared!");
            SendMessage("ResetAll", "", "");
        });

        setTimeout(function () {
            let buttons = document.getElementsByTagName('div');
            for (let kk = 0; kk < buttons.length; kk++) {
                buttons[kk].classList.remove("hide");
            }
            $('#version').attr('name', model.version);
            $("#sidebar-wrapper").show();
        }, 10000);

        $(".backup_picture").on("error", function () {
            $(this).attr('src', 'public/images/icon.png');
        });

        $("#sidebar-mosaic").click(function () {
            let win = window.open('https://tagmosaic.com', '_blank');
            win.focus();
        });

        $("#overlay").show();
        $("#sidebar-home").click();
    }
}