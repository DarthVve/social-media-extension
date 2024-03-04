import { BaseModel } from "./baseModel";

export class TikTokDataHandler extends BaseModel {
    constructor() {
        super();
    }

    saveTiktokSettings() {
        this.settings.TikTokSettings.TimeMin = tiktok_speed;
        this.settings.TikTokSettings.TimeMax = tiktok_speed + 10;
        this.settings.TikTokSettings.ErrorTime = 400;
    }
}