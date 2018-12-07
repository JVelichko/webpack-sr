export function plusToDate(date, amount, to) {
    const currYear = date.getFullYear();
    const currMonth = date.getMonth();
    const currDay = date.getDate();
    const currHours = date.getHours();

    switch (to) {
        case 'year':
            return new Date(currYear + amount, currMonth, currDay);
        case 'month':
            return new Date(currYear, currMonth + amount, currDay);
        case 'day':
            return new Date(currYear, currMonth, currDay + amount);
        case 'hour':
            return new Date(currYear, currMonth, currDay, currHours + amount);
    }
}
