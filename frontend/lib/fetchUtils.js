export async function authFetch(session, input, init) {
    if (typeof init.headers === "object") {
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${session.accessToken}`,
        };
    } else {
        init.headers = {
            Authorization: `Bearer ${session.accessToken}`,
        };
    }

    return await fetch(input, init);
}
