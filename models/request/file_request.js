class FileRequest {
    constructor(data) {
        this.fieldName = data.fieldname || null;
        this.oldName = data.originalname || null;
        this.mimeType = data.mimetype || null;
        this.size = data.size ? this.size(data.size) : null;
        this.fileName = data.filename || null;
        this.destination = data.destination || null;
        this.path = data.path || null;
    }

    size(byte) {
        if (byte / 1000000000000 > 1) return `${byte / 1000000000000} TB`;
        else if (byte / 1000000000 > 1) return `${byte / 1000000000} GB`;
        else if (byte / 1000000 > 1) return `${byte / 1000000} MB`;
        else if (byte / 1000 > 1) return `${byte / 1000} KB`;
        else return `${byte / 1000} B`;
    }
}

module.exports = FileRequest;
