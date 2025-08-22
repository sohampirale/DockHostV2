export async function checkIfInstanceExists(socket, USERNAME) {
    return new Promise((resolve) => {
        socket.emit("check_if_container_exists", { USERNAME });
        socket.once(USERNAME, (exists) => {
            resolve(exists);
        });
    });
}
export async function asyncSocketAwaiter(socket, event, handler) {
    return new Promise((resolve) => {
        socket.once(event, async (data) => {
            await handler(data);
            resolve(true);
        });
    });
}
//# sourceMappingURL=user.helpers.js.map