export function getCurrentDateTimeInBangkok(): string {
    const options : Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok'
    };
    const inputDate = new Date().toLocaleString('en-US', options).replace(',', '');
    const [date, time] = inputDate.split(' '); // แยกวันที่และเวลา
    const [month, day, year] = date.split('/'); // แยกเดือน วัน ปี
    const [hour, minute, second] = time.split(':'); // แยกชั่วโมง นาที วินาที

    const outputDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // สร้างวันที่และเวลาใหม่
    return outputDate 
}
