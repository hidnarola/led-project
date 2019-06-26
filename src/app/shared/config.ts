import timezones from 'google-timezones-json';
export class Config {

    signType = ['RGB', 'GRAYSCALE'];
    userRole = ['ROLE_USER', 'ROLE_ADMIN'];
    timeZone = timezones;
    scheduleRepeat = ['Continuous', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
    SCHE_CONT = 'Continuous';
    SCHE_DAYL = 'Daily';
    SCHE_WEEK = 'Weekly';
    SCHE_MONT = 'Monthly';
    SCHE_YEAR = 'Yearly';

    DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
}
