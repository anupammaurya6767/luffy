function sendMessageWithLoader(sock, remoteJid, responseKey, data) {
    const loaderFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    const interval = setInterval(async () => {
        await sock.sendMessage(remoteJid, { text: `${loaderFrames[i]} ${data}`, edit: responseKey });
        i = (i + 1) % loaderFrames.length;
    }, 1000);

    // Return a function to stop the loader animation
    return function stopLoader() {
        clearInterval(interval);
    };
}

module.exports = { sendMessageWithLoader };
