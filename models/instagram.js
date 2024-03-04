import { BaseModel } from "./baseModel";

export class InstagramDataHandler extends BaseModel {
    constructor() {
        super();
        this.instagram_data = [];
    }

    messageListener(event) {
        if (event) {
            if (event.data.mode == "Instaemail") {
                this.instagram_data[event.data.edit].email = prompt("Enter new email:");
            }
            if (event.data.mode == "Instasales") {
                this.instagram_data[event.data.edit].sales = prompt("Enter new sales:");
            }
            if (event.data.mode == "Instatarget") {
                this.instagram_data[event.data.edit].target = prompt("Enter new target:");
            }
            if (event.data.mode == "Instawebsite") {
                this.instagram_data[event.data.edit].website = prompt("Enter new website:");
            }
            if (event.data.mode == "Instaconnected") {
                this.instagram_data[event.data.edit].connected = prompt("Enter new connected:");
            }
            if (event.data.mode == "Instabirthday") {
                this.instagram_data[event.data.edit].birthday = prompt("Enter new birthday:");
            }
            if (event.data.mode == "Instatwitter") {
                this.instagram_data[event.data.edit].twitter = prompt("Enter new twitter:");
            }

            this.sendMessage("UpdateInstagramData", "instagram_data", this.instagram_data);
        }

        for (let i = 0; i < this.instagram_data.length; i++) {
            if (typeof this.instagram_data[i] != "undefined")
                this.html += "<tr><td><img width='100px' src='" + this.instagram_data[i].img + "'></img></td><td><a target='_blank' rel='noopener noreferrer' href='" + this.instagram_data[i].url + "'>" + this.instagram_data[i].username + "</a></td><td><a href='#' onclick='editInstaEmail(" + i + ")'>" + this.instagram_data[i].email + "</a></td><td><a href='#' onclick='editInstaSales(" + i + ")'>" + this.instagram_data[i].sales + "</a></td><td><a href='#' onclick='editInstaTargret(" + i + ")'>" + this.instagram_data[i].target + "</a></td><td><a href='#' onclick='editInstaWebsite(" + i + ")'>" + this.instagram_data[i].website + "</a></td><td><a href='#' onclick='editInstaTwitter(" + i + ")'>" + this.instagram_data[i].twitter + "</a></td><td><a href='#' onclick='editInstaBirthday(" + i + ")'>" + this.instagram_data[i].birthday + "</a></td><td><a href='#' onclick='editInstaConnected(" + i + ")'>" + this.instagram_data[i].connected + "</a></td></tr>";
            if (this.instagram_data[i].target in this.target_dic) {
                this.target_dic[this.instagram_data[i].target].leads++;
                this.target_dic[this.instagram_data[i].target].sales += parseInt(this.instagram_data[i].sales);
                if (this.instagram_data[i].connected != "none") {
                    this.target_dic[this.instagram_data[i].target].connected++;
                }
            } else {
                let did_connect = 0;
                if (this.instagram_data[i].connected != "none") {
                    did_connect = 1;
                }

                this.target_dic[this.instagram_data[i].target] = {
                    leads: 1,
                    sales: parseInt(this.instagram_data[i].sales),
                    connected: did_connect
                };
            }
        }
    }

}