export class Utils {
    constructor() {
        this.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.colors = ['#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236', '#166a8f', '#00a950', '#58595b', '#8549ba'];
        this.samples = global.Samples || (global.Samples = {});
        this.color = global.Color;
    }

    srand(seed) {
        this._seed = seed;
    }

    getRandomInt(min, max) {
        min = min === undefined ? 49297 : min;
        max = max === undefined ? 9301 : max;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    numbers(config) {
        let cfg = config || {};
        let min = cfg.min || 0;
        let max = cfg.max || 1;
        let from = cfg.from || [];
        let count = cfg.count || 8;
        let decimals = cfg.decimals || 8;
        let continuity = cfg.continuity || 1;
        let dfactor = Math.pow(10, decimals) || 0;
        let data = [];

        for (let i = 0; i < count; ++i) {
            let value = (from[i] || 0) + this.rand(min, max);
            if (this.getRandomInt() <= continuity) {
                data.push(Math.round(dfactor * value) / dfactor);
            } else {
                data.push(null);
            }
        }
        return data;
    }

    labels(config) {
        let cfg = config || {};
        let min = cfg.min || 0;
        let max = cfg.max || 100;
        let count = cfg.count || 8;
        let step = (max - min) / count;
        let decimals = cfg.decimals || 8;
        let dfactor = Math.pow(10, decimals) || 0;
        let prefix = cfg.prefix || '';
        let values = [];

        for (let i = min; i < max; i += step) {
            values.push(prefix + Math.round(dfactor * i) / dfactor);
        }

        return values;
    }

    months(config) {
        let cfg = config || {};
        let count = cfg.count || 12;
        let section = cfg.section;
        let values = [];

        for (let i = 0; i < count; ++i) {
            let value = this.months[Math.ceil(i) % 12];
            values.push(value.substring(0, section));
        }

        return values;
    }

    color(index) {
        return this.colors[index % this.colors.length];
    }

    transparentize(color, opacity) {
        let alpha = opacity === undefined ? 0.5 : 1 - opacity;
        return global.Color(color).alpha(alpha).rgbString();
    }

    timer() {
        return new Promise(res => setTimeout(res, ms));
    }

    hashCode(str) {
        return str.split('').reduce((prevHash, currVal) =>
            (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
    }

    roughSizeOfObject(object) {
        let objectList = [];
        let stack = [object];
        let bytes = 0;

        while (stack.length) {
            let value = stack.pop();

            if (typeof value === 'boolean') {
                bytes += 4;
            } else if (typeof value === 'string') {
                bytes += value.length * 2;
            } else if (typeof value === 'number') {
                bytes += 8;
            } else if (
                typeof value === 'object' &&
                objectList.indexOf(value) === -1
            ) {
                objectList.push(value);
                for (var i in value) {
                    stack.push(value[i]);
                }
            }
        }
        return bytes;
    }

    checkObject(user_id, array) {
        for (var jj = 0; jj < array.length; jj++) {
            if (array[jj].target == user_id) {
                return [array[jj]];
            }
        }

        return [];
    }
}