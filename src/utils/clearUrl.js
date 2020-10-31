export function clearUrl() {
    history.pushState({}, document.title, location.pathname);
}

export function clearUrlHash() {
    history.pushState({}, document.title, location.pathname + location.search);
}

export function clearUrlSearch() {
    history.pushState({}, document.title, location.pathname + location.hash);
}
