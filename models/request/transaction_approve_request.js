class TransactionApproveRequest {
    constructor(req) {
        this.id = req.id || null;
    }

    verifyId() {
        if (this.id) return true;
        return false;
    }
}

module.exports = TransactionApproveRequest;
