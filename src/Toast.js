const div = document.createElement("div");
div.className = "Toast";

/**
 * @param {string} message
 */
export function Toast (message) {
    div.innerText = message;
    document.body.appendChild(div);
    setTimeout(() => {
        try { document.body.removeChild(div); }
        catch (e) {}
    }, 10 * 1000);
}