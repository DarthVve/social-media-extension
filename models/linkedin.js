import { BaseModel } from "./baseModel";

export class LinkedinDataHandler extends BaseModel {
    constructor() {
        super();
        this.linkedinData = [];
    }

    messageListener(event) {
        if (event) {
            if (event.data.mode == "email") {
                this.linkedin_data[event.data.edit].email = prompt("Enter new email:");
            }

            if (event.data.mode == "sales") {
                this.linkedin_data[event.data.edit].sales = prompt("Enter new sales:");
            }

            if (event.data.mode == "target") {
                this.linkedin_data[event.data.edit].target = prompt("Enter new target:");
            }

            if (event.data.mode == "website") {
                this.linkedin_data[event.data.edit].website = prompt("Enter new website:");
            }

            if (event.data.mode == "connected") {
                this.linkedin_data[event.data.edit].connected = prompt("Enter new connected:");
            }

            if (event.data.mode == "birthday") {
                this.linkedin_data[event.data.edit].birthday = prompt("Enter new birthday:");
            }
            if (event.data.mode == "twitter") {
                this.linkedin_data[event.data.edit].twitter = prompt("Enter new twitter:");
            }

            this.sendMessage("UpdateLinkedinData", "linkedin_data", this.linkedin_data);
        }

        for (let i = 0; i < this.linkedin_data.length; i++) {
            if (typeof this.linkedin_data[i] != "undefined")
                this.html += "<tr><td><img width='100px' src='" + this.linkedin_data[i].img + "'></img></td><td><a target='_blank' rel='noopener noreferrer' href='https://linkedin" + this.linkedin_data[i].url.split("linkedin")[1] + "'>" + this.linkedin_data[i].username + "</a></td><td><a href='#' onclick='editEmail(" + i + ")'>" + this.linkedin_data[i].email + "</a></td><td><a href='#' onclick='editSales(" + i + ")'>" + this.linkedin_data[i].sales + "</a></td><td><a href='#' onclick='editTargret(" + i + ")'>" + this.linkedin_data[i].target + "</a></td><td><a href='#' onclick='editWebsite(" + i + ")'>" + this.linkedin_data[i].website + "</a></td><td><a href='#' onclick='editTwitter(" + i + ")'>" + this.linkedin_data[i].twitter + "</a></td><td><a href='#' onclick='editBirthday(" + i + ")'>" + this.linkedin_data[i].birthday + "</a></td><td><a href='#' onclick='editConnected(" + i + ")'>" + this.linkedin_data[i].connected + "</a></td></tr>";
            if (this.linkedin_data[i].target in target_dic) {
                this.target_dic[this.linkedin_data[i].target].leads++;
                this.target_dic[this.linkedin_data[i].target].sales += parseInt(this.linkedin_data[i].sales);
                if (this.linkedin_data[i].connected != "none") {
                    this.target_dic[this.linkedin_data[i].target].connected++;
                }
            } else {
                let did_connect = 0;
                if (this.linkedin_data[i].connected != "none") {
                    did_connect = 1;
                }

                this.target_dic[this.linkedin_data[i].target] = {
                    leads: 1,
                    sales: parseInt(this.linkedin_data[i].sales),
                    connected: did_connect
                };
            }
        }
    }
}