(function () {
    "use strict";

    App.namespace("App.TemporalUtils");

    App.TemporalUtils = {

        REGEXPS: {
            BIYEARLY: /^\d{4}-S(\d{1,2})$/,
            FOUR_MONTHLY: /^\d{4}-T(\d{1,2})$/,
            QUARTERLY: /^\d{4}-Q(\d{1,2})$/,
            MONTHLY: /^\d{4}-\d{2}$/,
            DAILY: /^\d{4}-D(\d{1,3})$/
        },
        MONTHS: {
            BIYEARLY: 6,
            FOUR_MONTHLY: 4,
            QUARTERLY: 3
        },
        intervalDateParsers: {
            YEARLY: function (stringDate) {
                var momentDate = moment(stringDate, "YYYY"); // parse format YYYY-A1 too
                return {
                    begin: momentDate.clone().startOf('year').utc().valueOf(),
                    end: momentDate.clone().endOf('year').utc().valueOf()
                }
            },
            BIYEARLY: function (stringDate) {
                var matchs = stringDate.match(App.TemporalUtils.REGEXPS.BIYEARLY);
                var monthBeginNumber = (matchs[1] - 1) * App.TemporalUtils.MONTHS.BIYEARLY;

                var monthBegin = moment(stringDate, 'YYYY');
                monthBegin.month(monthBeginNumber);

                var monthEnd = monthBegin.clone();
                monthEnd.month(monthBegin.month() + App.TemporalUtils.MONTHS.BIYEARLY - 1);
                return {
                    begin: monthBegin.clone().startOf('month').utc().valueOf(),
                    end: monthEnd.clone().endOf('month').utc().valueOf()
                }
            },
            FOUR_MONTHLY: function (stringDate) {
                var matchs = stringDate.match(App.TemporalUtils.REGEXPS.FOUR_MONTHLY);
                var monthBeginNumber = (matchs[1] - 1) * App.TemporalUtils.MONTHS.FOUR_MONTHLY;

                var monthBegin = moment(stringDate, 'YYYY');
                monthBegin.month(monthBeginNumber);

                var monthEnd = monthBegin.clone();
                monthEnd.month(monthBegin.month() + App.TemporalUtils.MONTHS.FOUR_MONTHLY - 1);
                return {
                    begin: monthBegin.clone().startOf('month').utc().valueOf(),
                    end: monthEnd.clone().endOf('month').utc().valueOf()
                }
            },
            QUARTERLY: function (stringDate) {
                var matchs = stringDate.match(App.TemporalUtils.REGEXPS.QUARTERLY);
                var monthBeginNumber = (matchs[1] - 1) * App.TemporalUtils.MONTHS.QUARTERLY;

                var monthBegin = moment(stringDate, 'YYYY');
                monthBegin.month(monthBeginNumber);

                var monthEnd = monthBegin.clone();
                monthEnd.month(monthBegin.month() + App.TemporalUtils.MONTHS.QUARTERLY - 1);
                return {
                    begin: monthBegin.clone().startOf('month').utc().valueOf(),
                    end: monthEnd.clone().endOf('month').utc().valueOf()
                }
            },
            MONTHLY: function (stringDate) { // 2018-M10, 2018-10
                var momentDate = moment(stringDate, (App.TemporalUtils.REGEXPS.MONTHLY).test(stringDate) ? 'YYYY-MM' : "YYYY-'M'MM");
                return {
                    begin: momentDate.clone().startOf('month').utc().valueOf(),
                    end: momentDate.clone().endOf('month').utc().valueOf()
                }
            },
            WEEKLY: function (stringDate) { // 2018-W10
                var momentDate = moment(stringDate, "YYYY-'W'WW");
                return {
                    begin: momentDate.clone().startOf('isoWeek').utc().valueOf(),
                    end: momentDate.clone().endOf('isoWeek').utc().valueOf()
                }
            },
            DAILY: function (stringDate) {
                var matchs = stringDate.match(App.TemporalUtils.REGEXPS.DAILY)
                var momentDate;
                if (matchs) {
                    momentDate = moment(stringDate, "YYYY");
                    momentDate.dayOfYear(matchs[1]);
                }
                else {
                    momentDate = moment(stringDate, "YYYY-MM-DD");
                }
                return {
                    begin: momentDate.clone().startOf('day').utc().valueOf(),
                    end: momentDate.clone().endOf('day').utc().valueOf()
                }
            },
            HOURLY: function (stringDate) {
                var momentDate = moment(stringDate);
                return {
                    begin: momentDate.clone().startOf('hour').utc().valueOf(),
                    end: momentDate.clone().endOf('hour').utc().valueOf()
                }
            }
        },

        temporalGranularityPriorities: {
            // EVENT: 8,
            YEARLY: 8, // 2000, 2000-A1
            BIYEARLY: 7, // 2000-S1
            FOUR_MONTHLY: 6, // 4 months // 2000-T3
            QUARTERLY: 5, // 3 months // 2000-Q4
            MONTHLY: 4, // 2000-M12, 2000-01
            WEEKLY: 3, // 2000-W52
            //DAILY_B: 2,
            //DAILY_D: 2,
            DAILY: 2, // 2000-D353, 2000-01-31
            HOURLY: 1 // 2013-07-24T13:21:52.519+01:00
        },

        contains: function (majorTemporal, minorTemporal) {
            if (!this.intervalDateParsers.hasOwnProperty(majorTemporal.temporalGranularity) ||
                !this.intervalDateParsers.hasOwnProperty(minorTemporal.temporalGranularity)) {
                console.warn('Some of the next granularities do not have a parser');
                console.log(majorTemporal.temporalGranularity);
                console.log(minorTemporal.temporalGranularity);
                return false;
            }
            var majorInterval = this.intervalDateParsers[majorTemporal.temporalGranularity](majorTemporal.id);
            var minorInterval = this.intervalDateParsers[minorTemporal.temporalGranularity](minorTemporal.id);

            return majorInterval.begin <= minorInterval.end && minorInterval.end <= majorInterval.end;
        },

        isAfter: function (startTemporal, temporal) {
            if (!this.intervalDateParsers.hasOwnProperty(startTemporal.temporalGranularity) ||
                !this.intervalDateParsers.hasOwnProperty(temporal.temporalGranularity)) {
                console.warn('Some of the next granularities do not have a parser');
                console.log(startTemporal.temporalGranularity);
                console.log(temporal.temporalGranularity);
                return false;
            }
            var startDateInterval = this.intervalDateParsers[startTemporal.temporalGranularity](startTemporal.id);
            var dateInterval = this.intervalDateParsers[temporal.temporalGranularity](temporal.id);

            return this.compare(startDateInterval, dateInterval) <= 0;
        },

        getInterval: function (temporal) {
            if (!this.intervalDateParsers.hasOwnProperty(temporal.temporalGranularity)) {
                console.warn('The next granularities do not have a parser');
                console.log(temporal.temporalGranularity);
                return null;
            }
            return this.intervalDateParsers[temporal.temporalGranularity](temporal.id);
        },

        getTemporalGranularityPriority: function (temporalGranularity) {
            return this.temporalGranularityPriorities[temporalGranularity] || null;
        },

        compare: function (date1, date2) {
            if (date1.end < date2.end) {
                return -1;
            } else if (date1.end > date2.end) {
                return 1;
            } else {
                // Has equal endTime, calculate duration
                if (date1.begin < date2.begin) {
                    return 1;
                } else if (date1.begin > date2.begin) {
                    return -1;
                }
                return 0;
            }
        }
    };
}());