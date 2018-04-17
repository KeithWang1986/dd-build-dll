class DDCommon {
    constructor() {
        this.uid = 1;
    };

    GenerateUID() {
        return (++this.uid);
    }
}

var ddCommon = new DDCommon();

window.ddCommon=ddCommon;