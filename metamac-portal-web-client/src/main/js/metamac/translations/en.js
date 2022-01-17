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
            line: "Lines chart",
            map: "Map",
            mapbubble: "Bubble map",
            fullscreen: "Fullscreen",
            share: "Share",
            download: "Download",
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
            }
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
                notes: "Notes",
                version: {
                    group: "Version",
                    last: "Last version",
                    current: "Current version",
                },
                data: {
                    group: "Data",
                    quantity: "The last",
                    date: "Starting from",
                }
            },
            modal: {
                title: "Save custom query",
                success: "The custom query has been saved successfully",
                failure: "There was a problem saving the custom query"
            },
            error: {
                quantity: "The numeric field in the 'Data' section must be a positive integer greater than or equal to one.",
                date: "The date in the 'Data' section is mandatory."
            }
        },
        text: {
            fixedDimensions: "Fixed values",
            leftDimensions: "Rows",
            topDimensions: "Columns",
            fixedDimensionX: "Fixed dimension",
            horizontalAxis: "Horizontal axis",
            columns: "Columns",
            lines: "Lines",
            sectors: "Sectors",
            map: "Territories",
            mapbubble: "Territories",
            "for": "For"
        },
        sidebar: {
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
            level: "Level {{level}}"
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
        loading: "Loading data..."
    },

    entity: {
        dataset: {
            title: "Title",
            subtitle: "Subtitle",
            abstract: "Abstract",
            measureDimensionCoverageConcepts: "Measure dimension coverage concepts",
            statisticalOperation: "Statistical operation",
            validFrom: "Valid from",
            validTo: "Valid to",
            dateStart: "Initial period",
            dateEnd: "End period",
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

            nextVersion: {
                title: "Next update",
                enum: {
                    NON_SCHEDULED_UPDATE: "Non scheduled update",
                    NO_UPDATES: "No updates",
                    SCHEDULED_UPDATE: "Scheduled update"
                }
            }
        },
        observation: {
            measure: {
                title: 'Data identification'
            },
            attributes: {
                title: 'Observation attributes',
                primaryMeasure: 'Attributes observation level',
                combinatedDimensions: 'Attributes dimensions level',
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
    logout: {
        modal: {
            title: "Log out",
            question: "Are you sure you want to log out?"
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
                message: "The action you want to perform requires you to log in first by clicking the icon (<i class=\"icon icon-user\"></i>) above."
            }
        }
    },
    user: {
        header: {
            userAreaTooltip: "Área do usuário",
            loginTooltip: "Sign in",
            logoutTooltip: "Log out"
        }
    },
    captcha: {
        button: {
            text: "Send"
        },
        label: {
            text: "Write the value of the image shown above"
        }
    }
};