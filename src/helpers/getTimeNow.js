export default function getTimeNow () {
    const dateTime = new Date();
    const year = dateTime.getFullYear();
    const month = dateTime.getMonth();
    const day = dateTime.getDate();
    const hour = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    return `${day}/${month}/${year}  ${hour}:${minutes}`;
}
