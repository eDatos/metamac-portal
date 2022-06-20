(function () {
    "use strict";

    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;


    App.DB = function (options) {
        var db;
        if (App.DB.hasIndexedDBSupport()) {
            db = new IndexedDB(options);
        } else {
            db = new HashDB(options);
        }
        return db;
    };

    App.DB.hasIndexedDBSupport = function () {
        return !_.isUndefined(indexedDB);
    };

    // IndexedDB Support

    var IndexedDB = function (options) {
        this.options = options;
    };

    IndexedDB.prototype = {

        connect : function (cb) {
            var self = this;
            var options = this.options;
            var open = indexedDB.open(options.server, options.version);

            open.onupgradeneeded = function (e) {
                var db = e.target.result;

                _.each(options.schema, function (storeSchema, store) {
                    if (db.objectStoreNames.contains(store)) {
                        db.deleteObjectStore(store);
                    }
                    var createOptions = {
                        keyPath : storeSchema.key.keyPath,
                        autoIncrement : storeSchema.key.autoIncrement || false
                    };
                    db.createObjectStore(store, createOptions);
                });
            };

            open.onerror = function (error) {
                // Beware DOMException: The user denied permission to access the database. error. If this happens, check your cookies are unblocked
                console.error(error);
                cb("Error");
            };

            open.onsuccess = function (e) {
                var db = e.target.result;
                self._initializeStores(db);
                cb(null);
            };
        },

        clear : function (cb) {
            var fns = _.map(this._stores, function (store) {
                return _.bind(store.clear, store);
            });
            async.series(fns, cb);
        },

        _initializeStores : function (db) {
            this._storesName = _.keys(this.options.schema);
            this._stores = _.map(this._storesName, function (store) {
                return new IndexedDBStore(db, store);
            });
            _.each(this._storesName, function (storeName, index) {
                this[storeName] = this._stores[index];
            }, this);
        }

    };

    var IndexedDBStore = function (db, store) {
        this.db = db;
        this.store = store;
    };

    IndexedDBStore.prototype = {
        put : function (data, cb) {
            var data = _.isArray(data) ? data : [data];
            var transaction = this.db.transaction([this.store], "readwrite");

            var objectStore = transaction.objectStore(this.store);
            _.each(data, function (shape) {
                objectStore.put(shape);
            });

            transaction.oncomplete = function () {
                cb();
            };
            transaction.onerror = function () {
                cb("Error");
            };
        },

        get : function (keys, cb) {
            var transaction = this.db.transaction([this.store]);
            var objectStore = transaction.objectStore(this.store);
            var result;
            if (_.isArray(keys)) {
                result = [];
                _.each(keys, function (key) {
                    if (key) {
                        objectStore.get(key).onsuccess = function (e) {
                            result.push(e.target.result);
                        };
                    } else {
                        result.push(undefined);
                    }
                });
            } else {
                if (keys) {
                    objectStore.get(keys).onsuccess = function (e) {
                        result = e.target.result;
                    };
                }
            }

            transaction.oncomplete = function () {
                cb(null, result);
            };
            transaction.onerror = function (e) {
                cb(e);
            };
        },

        clear : function (cb) {
            var transaction = this.db.transaction(this.store, "readwrite");
            var objectStore = transaction.objectStore(this.store);
            var req = objectStore.clear();

            req.onsuccess = function () {
                cb();
            };
            req.onerror = function () {
                cb("Error");
            };
        }
    };

    // No IndexedDB Support

    var HashDB = function (options) {
        this.options = options;
    };

    HashDB.prototype = {

        connect : function (cb) {
            this._storesName = _.keys(this.options.schema);
            this._stores = _.map(this._storesName, function (store) {
                return new HashStore()
            });
            _.each(this._storesName, function (storeName, index) {
                this[storeName] = this._stores[index];
            }, this);
            cb();
        },

        clear : function (cb) {
            var fns = _.map(this._stores, function (store) {
                return _.bind(store.clear, store);
            });
            async.series(fns, cb);
        }

    };

    var HashStore = function () {
        this.clear(function () {
        });
    };

    HashStore.prototype = {

        _getByKey : function (normCode) {
            return this._cache[normCode];
        },

        get : function (keys, cb) {
            var shapes;
            if (_.isArray(keys)) {
                shapes = _.map(keys, this._getByKey, this);
            } else {
                shapes = this._getByKey(keys);
            }
            cb(null, shapes);
        },

        _saveShape : function (shape) {
            this._cache[shape.normCode] = shape;
        },

        put : function (shapes, cb) {
            if (_.isArray(shapes)) {
                _.each(shapes, this._saveShape, this);
            } else {
                this._saveShape(shapes);
            }
            cb();
        },

        clear : function (cb) {
            this._cache = {};
            cb();
        }

    };

}());