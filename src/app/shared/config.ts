import timezones from 'google-timezones-json';
export class Config {
    apiURL = 'http://192.168.100.42:8080/';
    signType = ['RGB', 'GRAYSCALE'];
    userRole = ['ROLE_USER', 'ROLE_ADMIN'];
    timeZone = timezones;

    scheduleRepeat = ['Continuous', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
    SCHE_CONT = 'Continuous';
    SCHE_DAYL = 'Daily';
    SCHE_WEEK = 'Weekly';
    SCHE_MONT = 'Monthly';
    SCHE_YEAR = 'Yearly';
}
