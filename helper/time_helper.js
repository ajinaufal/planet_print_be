class TimeHelper {
    static timeToken() {
        const currentDate = new Date();
        const expirationDate = new Date(
            currentDate.getTime() + 7 * 24 * 60 * 60 * 1000
        );
        return { currentDate, expirationDate };
    }
}

module.exports = TimeHelper;
