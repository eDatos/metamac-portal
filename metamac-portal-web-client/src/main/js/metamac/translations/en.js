I18n.translations || (I18n.translations = {});

I18n.translations.en = {

    number: {
        format: {
            separator: ".", /* Decimal */
            delimiter: ",", /* Thousands */
            strip_insignificant_zeros: false
        }
    },
    filter: {
        button: {
            edit: "Change selection",
            info: "Info",
            table: "Datatable",
            column: "Columns chart",
            bar: "Bars chart",
            line: "Lines chart",
            map: "Map",
            mapbubble: "Bubble map",
            fullscreen: "Fullscreen",
            helpUrl: "Help",
            share: "Share",
            download: "Download",
            apiDownload: "API",
            save: "Save",
            accept: "Accept",
            cancel: "Cancel",
            selectAll: "Select",
            deselectAll: "Deselect",
            reverseOrder: "Reverse order",
            close: "Close",
            visualize: "Visualize",
            embed: "Widget",
            disabledFeature: {
                internalPortal: "This feature is disabled on the internal visualizer"
            }
        },
        download: {
            selection: "Download selection",
            all: "Download All",
            modal: {
                title: "Download info"
            },
            excel: {
                disabled: "This resource cannot be downloaded as XLSX because it exceeds the number of observations for this format. Please, choose another option."
            },
            attributes: {
                modal: {
                    title: "Attributes inclusion",
                    question: "Would you like to include the attributes on the download?"
                }
            }
        },
        apiDownload: {
            modal: {
                title: "Download via API",
                info: "For more information see the 'Reutilization and info for developers' section"
            },
        },
        share: {
            permanent: "Permanent link:"
        },
        embed: {
            instructions: "Select, copy and paste this code on your page:"
        },
        save: {
            button: {
                submit: "Save",
            },
            label: {
                name: "Custom query name",
                notes: "Notes"
            },
            modal: {
                title: "Save custom query",
                success: "The custom query has been saved successfully",
                failure: "There was a problem saving the custom query"
            }
        },
        text: {
            fixedDimensions: "Fixed values",
            leftDimensions: "Rows",
            topDimensions: "Columns",
            fixedDimensionX: "Fixed dimension",
            horizontalAxis: "Horizontal axis",
            columns: "Columns",
            bars: "Bars",
            lines: "Lines",
            sectors: "Sectors",
            map: "Territories",
            mapbubble: "Territories",
            "for": "For"
        },
        sidebar: {
            ignorable: {
                null: 'See categories with blank cells',
                zero: 'See categories with zero cells'
            },
            info: {
                title: "Info"
            },
            filter: {
                title: "Filter",
                search: "Search"
            },
            order: {
                title: "Sort",
                info: {
                    fixed: "",
                    left: "",
                    top: ""
                },
                table: {
                    fixed: "Fixed values",
                    left: "Rows",
                    top: "Columns"
                },
                column: {
                    fixed: "Fixed values",
                    left: "X axis",
                    axisy: "Y axis",
                    top: "Columns"
                },
                bar: {
                    fixed: "Fixed values",
                    left: "Y axis",
                    axisy: "X axis",
                    top: "Bars"
                },
                line: {
                    fixed: "Fixed values",
                    left: "X axis",
                    axisy: "Y axis",
                    top: "Lines"
                },
                map: {
                    fixed: "Fixed values",
                    left: "Territories"
                },
                mapbubble: {
                    fixed: "Fixed values",
                    left: "Territories"
                }

            }
        },
        selector: {
            level: {
                template: "Level {{level}}",
                all: "All"
            },
            temporal: {
                YEARLY: "Annual",
                BIYEARLY: "Biyearly",
                FOUR_MONTHLY: "Four-monthly",
                QUARTERLY: "Quarterly",
                MONTHLY: "Monthly",
                WEEKLY: "Weekly",
                DAILY: "Daily",
                HOURLY: "Hourly",
            }
        },
        sort: {
            options: {
                OBSERVATION: "By value",
                REPRESENTATION: "By category"
            }
        }
    },
    ve: {
        map: {
            nomap: "No map available"
        },
        mapbubble: {
            nomap: "No map available"
        },
        noSelection: "You must choose at least one category on each dimension",
        selectAtLeastTwoItems: "You must select at least two values at the same level",
        loading: "Loading data..."
    },

    entity: {
        dataset: {
            title: "Title",
            description: "Description",
            subtitle: "Subtitle",
            abstract: "Abstract",
            measureDimensionCoverageConcepts: "Measure dimension coverage concepts",
            statisticalOperation: "Statistical operation",
            validFrom: "Valid from",
            validTo: "Valid to",
            dateStart: "Initial period",
            dateEnd: "End period",
            version: "Version number",
            versionRationale: {
                title: "Version rationale",
                enum: {
                    MAJOR_CATEGORIES: "Major: Categories",
                    MAJOR_ESTIMATORS: "Major: Estimators",
                    MAJOR_NEW_RESOURCE: "Major: New resource",
                    MAJOR_OTHER: "Major: Others",
                    MAJOR_VARIABLES: "Major: Variables",
                    MINOR_DATA_UPDATE: "Minor: Data update",
                    MINOR_ERRATA: "Minor: Errata",
                    MINOR_METADATA: "Minor: Metadata",
                    MINOR_OTHER: "Minor: Other",
                    MINOR_SERIES_UPDATE: "Minor: Series update"
                }
            },
            replacesVersion: "Replaces version",
            isReplacedByVersion: "Is replaced by version",
            publishers: "Publishers",
            contributors: "Contributors",
            mediators: "Mediators",
            replaces: "Replaces",
            isReplacedBy: "Is replaced by",
            relatedResources: {
                title: "Related resources",
                multidataset: "Related to multidataset"
            },
            rightsHolder: "Rights holder",
            copyrightDate: "Copyright date",
            license: "License",
            nolicense: "License no available",
            accessRights: "Access rights",
            subjectAreas: "Subject areas",
            formatExtentObservations: "Table size",
            lastUpdate: "Last update date",
            dateNextUpdate: "Next update date",
            updateFrequency: "Update frequency",
            statisticOfficiality: "Statistic officiality",
            bibliographicCitation: "Bibliographic citation",
            dataProviders: "Data providers",
            dataProviderAnnotations: "Observations associated with data providers",
            measureConcepts: {
                title: "What is measured by the data",
                annotations: "General notes"
            },

            section: {
                descriptors: "Table descriptors",
                validity: "Data validity",
                periods: "Reference periods",
                dimensions: "Which are the data variables",
                datasetAttributes: "Dataset notes",
                version: "Version number and data updates",
                reuse: "Reutilization and info for developers"
            },

            language: "Language",

            apiDocumentationUrl: "API documentation access",
            apiUrl: "API access to the resource",
            selectionApiUrl: "Access to the current selection in the API",

            nextVersion: {
                title: "Next update",
                enum: {
                    NON_SCHEDULED_UPDATE: "Non scheduled update",
                    NO_UPDATES: "No updates",
                    SCHEDULED_UPDATE: "Scheduled update"
                }
            }
        },
        kind: {
            types: {
                collection: "Collections",
                dataset: "Datasets",
                query: "Queries",
                multidataset: "Multidatasets"
            }
        },
        observation: {
            measure: {
                title: 'Data identification',
                data: 'Data'
            },
            attributes: {
                title: 'Observation attributes',
                primaryMeasure: 'Attributes observation level',
                combinatedDimensions: 'Attributes dimensions level',
            }
        },
        category: {
            measure: {
                unit: 'Measure unit',
                multiplier: 'Unit multiplier',
                unitMeasure: '{{multiplier}} of {{unit}}',
                unitMeasureStartsWithVowel: '{{multiplier}} of {{unit}}',
            },
            attributes: {
                title: 'Category attributes'
            }
        },
        granularity: {
            temporal: {
                enum: {
                    YEARLY: "Yearly",
                    BIYEARLY: "Biyearly",
                    QUARTERLY: "Quarterly",
                    FOUR_MONTHLY: "Four monthly",
                    MONTHLY: "Monthly",
                    WEEKLY: "Weekly",
                    DAILY: "Daily",
                    HOURLY: "Hourly"
                }
            }
        }
    },
    date: {
        formats: {
            "default": "%Y-%m-%d",
            "short": "%b %d",
            "long": "%B %d, %Y"
        },
        day_names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        abbr_day_names: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        month_names: ["null", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        abbr_month_names: ["null", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        meridian: ["am", "pm"]
    },
    indicator: {
        dimension: {
            name: {
                TIME: "Time",
                MEASURE: "Measures",
                GEOGRAPHICAL: "Geographical location"
            }
        }
    },
    login: {
        button: {
            submit: "Sign in",
            register: "Sign up"
        },
        label: {
            email: "Email",
            password: "Password"
        },
        modal: {
            title: "User",
            success: "You have successfully logged in",
            failure: "There was a problem logging in"
        },
        error: {
            client: "Invalid email or password.",
            server: "There was a problem logging in. Try again later."
        }
    },
    modal: {
        confirmation: {
            button: {
                confirm: "Yes",
                reject: "No"
            }
        },
        information: {
            loginRequired: {
                title: "Invalid action",
                message: "The action you want to perform requires you to log in first. Do you want to log in?."
            }
        },
        permalinkConfig: {
            button: {
                submit: "Save",
            },
            label: {
                version: {
                    group: "Data",
                    last: "Update the data with possible corrections or modifications",
                    current: "Always show current data",
                },
                data: {
                    group: "Data",
                    update: "Update data with new periods",
                    selected: "Fix the data to the selected period",
                },
                dataReview: {
                    group: "Data reviews",
                    update: "Update with data reviews"
                },
                periods: {
                    group: "Periods",
                    quantity: "Update with the last n periods:",
                    date: "Update from the following period:",
                    all: "Update with all periods",
                }
            },
            error: {
                quantity: "The numeric field in the 'Update with the last n periods' section must be a positive integer greater than or equal to one.",
                periods: "You must select one of the options in the 'Periods' section."
            },
            info: {
                noTemporalDimension: "This resource does not allow choosing the period because it does not have a temporal dimension.",
                noVersionUpdate: "This resource does not allow checking previous versions."
            }
        },
        embedConfig: {
            label: {
                title: "Title"
            }
        }
    },
    captcha: {
        button: {
            text: "Send"
        },
        label: {
            text: "Write the value of the image shown above"
        }
    },
    exception: {
        resources: {
            dataset: {
                empty_data: "The dataset has no data"
            },
            indicators: {
                no_representations: "Dimension {{error}} has no representations"
            }
        },
        statistical_resources: {
            dataset: { 
                not_found: "The dataset has not been found"
            }
        },
        common: {
            unknown: "Unknown error"
        }
    }
};