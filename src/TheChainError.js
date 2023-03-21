export class TheChainError extends Error {
    errorIndex;

    /**
     *
     * @param {number} errorIndex
     * @param {string} [message]
     */
    constructor (errorIndex, message) {
        super(`Error in the chain at index ${errorIndex}. ${message||""}`);

        this.errorIndex = errorIndex;
    }
}