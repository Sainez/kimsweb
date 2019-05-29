(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./node_modules/zone.js/dist/zone.js":
/*!*******************************************!*\
  !*** ./node_modules/zone.js/dist/zone.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/
(function (global, factory) {
	 true ? factory() :
	undefined;
}(this, (function () { 'use strict';

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var Zone$1 = (function (global) {
    var performance = global['performance'];
    function mark(name) {
        performance && performance['mark'] && performance['mark'](name);
    }
    function performanceMeasure(name, label) {
        performance && performance['measure'] && performance['measure'](name, label);
    }
    mark('Zone');
    var checkDuplicate = global[('__zone_symbol__forceDuplicateZoneCheck')] === true;
    if (global['Zone']) {
        // if global['Zone'] already exists (maybe zone.js was already loaded or
        // some other lib also registered a global object named Zone), we may need
        // to throw an error, but sometimes user may not want this error.
        // For example,
        // we have two web pages, page1 includes zone.js, page2 doesn't.
        // and the 1st time user load page1 and page2, everything work fine,
        // but when user load page2 again, error occurs because global['Zone'] already exists.
        // so we add a flag to let user choose whether to throw this error or not.
        // By default, if existing Zone is from zone.js, we will not throw the error.
        if (checkDuplicate || typeof global['Zone'].__symbol__ !== 'function') {
            throw new Error('Zone already loaded.');
        }
        else {
            return global['Zone'];
        }
    }
    var Zone = /** @class */ (function () {
        function Zone(parent, zoneSpec) {
            this._parent = parent;
            this._name = zoneSpec ? zoneSpec.name || 'unnamed' : '<root>';
            this._properties = zoneSpec && zoneSpec.properties || {};
            this._zoneDelegate =
                new ZoneDelegate(this, this._parent && this._parent._zoneDelegate, zoneSpec);
        }
        Zone.assertZonePatched = function () {
            if (global['Promise'] !== patches['ZoneAwarePromise']) {
                throw new Error('Zone.js has detected that ZoneAwarePromise `(window|global).Promise` ' +
                    'has been overwritten.\n' +
                    'Most likely cause is that a Promise polyfill has been loaded ' +
                    'after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. ' +
                    'If you must load one, do so before loading zone.js.)');
            }
        };
        Object.defineProperty(Zone, "root", {
            get: function () {
                var zone = Zone.current;
                while (zone.parent) {
                    zone = zone.parent;
                }
                return zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "current", {
            get: function () {
                return _currentZoneFrame.zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone, "currentTask", {
            get: function () {
                return _currentTask;
            },
            enumerable: true,
            configurable: true
        });
        Zone.__load_patch = function (name, fn) {
            if (patches.hasOwnProperty(name)) {
                if (checkDuplicate) {
                    throw Error('Already loaded patch: ' + name);
                }
            }
            else if (!global['__Zone_disable_' + name]) {
                var perfName = 'Zone:' + name;
                mark(perfName);
                patches[name] = fn(global, Zone, _api);
                performanceMeasure(perfName, perfName);
            }
        };
        Object.defineProperty(Zone.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Zone.prototype, "name", {
            get: function () {
                return this._name;
            },
            enumerable: true,
            configurable: true
        });
        Zone.prototype.get = function (key) {
            var zone = this.getZoneWith(key);
            if (zone)
                return zone._properties[key];
        };
        Zone.prototype.getZoneWith = function (key) {
            var current = this;
            while (current) {
                if (current._properties.hasOwnProperty(key)) {
                    return current;
                }
                current = current._parent;
            }
            return null;
        };
        Zone.prototype.fork = function (zoneSpec) {
            if (!zoneSpec)
                throw new Error('ZoneSpec required!');
            return this._zoneDelegate.fork(this, zoneSpec);
        };
        Zone.prototype.wrap = function (callback, source) {
            if (typeof callback !== 'function') {
                throw new Error('Expecting function got: ' + callback);
            }
            var _callback = this._zoneDelegate.intercept(this, callback, source);
            var zone = this;
            return function () {
                return zone.runGuarded(_callback, this, arguments, source);
            };
        };
        Zone.prototype.run = function (callback, applyThis, applyArgs, source) {
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runGuarded = function (callback, applyThis, applyArgs, source) {
            if (applyThis === void 0) { applyThis = null; }
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                try {
                    return this._zoneDelegate.invoke(this, callback, applyThis, applyArgs, source);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                _currentZoneFrame = _currentZoneFrame.parent;
            }
        };
        Zone.prototype.runTask = function (task, applyThis, applyArgs) {
            if (task.zone != this) {
                throw new Error('A task can only be run in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            }
            // https://github.com/angular/zone.js/issues/778, sometimes eventTask
            // will run in notScheduled(canceled) state, we should not try to
            // run such kind of task but just return
            if (task.state === notScheduled && (task.type === eventTask || task.type === macroTask)) {
                return;
            }
            var reEntryGuard = task.state != running;
            reEntryGuard && task._transitionTo(running, scheduled);
            task.runCount++;
            var previousTask = _currentTask;
            _currentTask = task;
            _currentZoneFrame = { parent: _currentZoneFrame, zone: this };
            try {
                if (task.type == macroTask && task.data && !task.data.isPeriodic) {
                    task.cancelFn = undefined;
                }
                try {
                    return this._zoneDelegate.invokeTask(this, task, applyThis, applyArgs);
                }
                catch (error) {
                    if (this._zoneDelegate.handleError(this, error)) {
                        throw error;
                    }
                }
            }
            finally {
                // if the task's state is notScheduled or unknown, then it has already been cancelled
                // we should not reset the state to scheduled
                if (task.state !== notScheduled && task.state !== unknown) {
                    if (task.type == eventTask || (task.data && task.data.isPeriodic)) {
                        reEntryGuard && task._transitionTo(scheduled, running);
                    }
                    else {
                        task.runCount = 0;
                        this._updateTaskCount(task, -1);
                        reEntryGuard &&
                            task._transitionTo(notScheduled, running, notScheduled);
                    }
                }
                _currentZoneFrame = _currentZoneFrame.parent;
                _currentTask = previousTask;
            }
        };
        Zone.prototype.scheduleTask = function (task) {
            if (task.zone && task.zone !== this) {
                // check if the task was rescheduled, the newZone
                // should not be the children of the original zone
                var newZone = this;
                while (newZone) {
                    if (newZone === task.zone) {
                        throw Error("can not reschedule task to " + this.name + " which is descendants of the original zone " + task.zone.name);
                    }
                    newZone = newZone.parent;
                }
            }
            task._transitionTo(scheduling, notScheduled);
            var zoneDelegates = [];
            task._zoneDelegates = zoneDelegates;
            task._zone = this;
            try {
                task = this._zoneDelegate.scheduleTask(this, task);
            }
            catch (err) {
                // should set task's state to unknown when scheduleTask throw error
                // because the err may from reschedule, so the fromState maybe notScheduled
                task._transitionTo(unknown, scheduling, notScheduled);
                // TODO: @JiaLiPassion, should we check the result from handleError?
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            if (task._zoneDelegates === zoneDelegates) {
                // we have to check because internally the delegate can reschedule the task.
                this._updateTaskCount(task, 1);
            }
            if (task.state == scheduling) {
                task._transitionTo(scheduled, scheduling);
            }
            return task;
        };
        Zone.prototype.scheduleMicroTask = function (source, callback, data, customSchedule) {
            return this.scheduleTask(new ZoneTask(microTask, source, callback, data, customSchedule, undefined));
        };
        Zone.prototype.scheduleMacroTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(macroTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.scheduleEventTask = function (source, callback, data, customSchedule, customCancel) {
            return this.scheduleTask(new ZoneTask(eventTask, source, callback, data, customSchedule, customCancel));
        };
        Zone.prototype.cancelTask = function (task) {
            if (task.zone != this)
                throw new Error('A task can only be cancelled in the zone of creation! (Creation: ' +
                    (task.zone || NO_ZONE).name + '; Execution: ' + this.name + ')');
            task._transitionTo(canceling, scheduled, running);
            try {
                this._zoneDelegate.cancelTask(this, task);
            }
            catch (err) {
                // if error occurs when cancelTask, transit the state to unknown
                task._transitionTo(unknown, canceling);
                this._zoneDelegate.handleError(this, err);
                throw err;
            }
            this._updateTaskCount(task, -1);
            task._transitionTo(notScheduled, canceling);
            task.runCount = 0;
            return task;
        };
        Zone.prototype._updateTaskCount = function (task, count) {
            var zoneDelegates = task._zoneDelegates;
            if (count == -1) {
                task._zoneDelegates = null;
            }
            for (var i = 0; i < zoneDelegates.length; i++) {
                zoneDelegates[i]._updateTaskCount(task.type, count);
            }
        };
        Zone.__symbol__ = __symbol__;
        return Zone;
    }());
    var DELEGATE_ZS = {
        name: '',
        onHasTask: function (delegate, _, target, hasTaskState) { return delegate.hasTask(target, hasTaskState); },
        onScheduleTask: function (delegate, _, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, _, target, task, applyThis, applyArgs) {
            return delegate.invokeTask(target, task, applyThis, applyArgs);
        },
        onCancelTask: function (delegate, _, target, task) { return delegate.cancelTask(target, task); }
    };
    var ZoneDelegate = /** @class */ (function () {
        function ZoneDelegate(zone, parentDelegate, zoneSpec) {
            this._taskCounts = { 'microTask': 0, 'macroTask': 0, 'eventTask': 0 };
            this.zone = zone;
            this._parentDelegate = parentDelegate;
            this._forkZS = zoneSpec && (zoneSpec && zoneSpec.onFork ? zoneSpec : parentDelegate._forkZS);
            this._forkDlgt = zoneSpec && (zoneSpec.onFork ? parentDelegate : parentDelegate._forkDlgt);
            this._forkCurrZone = zoneSpec && (zoneSpec.onFork ? this.zone : parentDelegate.zone);
            this._interceptZS =
                zoneSpec && (zoneSpec.onIntercept ? zoneSpec : parentDelegate._interceptZS);
            this._interceptDlgt =
                zoneSpec && (zoneSpec.onIntercept ? parentDelegate : parentDelegate._interceptDlgt);
            this._interceptCurrZone =
                zoneSpec && (zoneSpec.onIntercept ? this.zone : parentDelegate.zone);
            this._invokeZS = zoneSpec && (zoneSpec.onInvoke ? zoneSpec : parentDelegate._invokeZS);
            this._invokeDlgt =
                zoneSpec && (zoneSpec.onInvoke ? parentDelegate : parentDelegate._invokeDlgt);
            this._invokeCurrZone = zoneSpec && (zoneSpec.onInvoke ? this.zone : parentDelegate.zone);
            this._handleErrorZS =
                zoneSpec && (zoneSpec.onHandleError ? zoneSpec : parentDelegate._handleErrorZS);
            this._handleErrorDlgt =
                zoneSpec && (zoneSpec.onHandleError ? parentDelegate : parentDelegate._handleErrorDlgt);
            this._handleErrorCurrZone =
                zoneSpec && (zoneSpec.onHandleError ? this.zone : parentDelegate.zone);
            this._scheduleTaskZS =
                zoneSpec && (zoneSpec.onScheduleTask ? zoneSpec : parentDelegate._scheduleTaskZS);
            this._scheduleTaskDlgt = zoneSpec &&
                (zoneSpec.onScheduleTask ? parentDelegate : parentDelegate._scheduleTaskDlgt);
            this._scheduleTaskCurrZone =
                zoneSpec && (zoneSpec.onScheduleTask ? this.zone : parentDelegate.zone);
            this._invokeTaskZS =
                zoneSpec && (zoneSpec.onInvokeTask ? zoneSpec : parentDelegate._invokeTaskZS);
            this._invokeTaskDlgt =
                zoneSpec && (zoneSpec.onInvokeTask ? parentDelegate : parentDelegate._invokeTaskDlgt);
            this._invokeTaskCurrZone =
                zoneSpec && (zoneSpec.onInvokeTask ? this.zone : parentDelegate.zone);
            this._cancelTaskZS =
                zoneSpec && (zoneSpec.onCancelTask ? zoneSpec : parentDelegate._cancelTaskZS);
            this._cancelTaskDlgt =
                zoneSpec && (zoneSpec.onCancelTask ? parentDelegate : parentDelegate._cancelTaskDlgt);
            this._cancelTaskCurrZone =
                zoneSpec && (zoneSpec.onCancelTask ? this.zone : parentDelegate.zone);
            this._hasTaskZS = null;
            this._hasTaskDlgt = null;
            this._hasTaskDlgtOwner = null;
            this._hasTaskCurrZone = null;
            var zoneSpecHasTask = zoneSpec && zoneSpec.onHasTask;
            var parentHasTask = parentDelegate && parentDelegate._hasTaskZS;
            if (zoneSpecHasTask || parentHasTask) {
                // If we need to report hasTask, than this ZS needs to do ref counting on tasks. In such
                // a case all task related interceptors must go through this ZD. We can't short circuit it.
                this._hasTaskZS = zoneSpecHasTask ? zoneSpec : DELEGATE_ZS;
                this._hasTaskDlgt = parentDelegate;
                this._hasTaskDlgtOwner = this;
                this._hasTaskCurrZone = zone;
                if (!zoneSpec.onScheduleTask) {
                    this._scheduleTaskZS = DELEGATE_ZS;
                    this._scheduleTaskDlgt = parentDelegate;
                    this._scheduleTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onInvokeTask) {
                    this._invokeTaskZS = DELEGATE_ZS;
                    this._invokeTaskDlgt = parentDelegate;
                    this._invokeTaskCurrZone = this.zone;
                }
                if (!zoneSpec.onCancelTask) {
                    this._cancelTaskZS = DELEGATE_ZS;
                    this._cancelTaskDlgt = parentDelegate;
                    this._cancelTaskCurrZone = this.zone;
                }
            }
        }
        ZoneDelegate.prototype.fork = function (targetZone, zoneSpec) {
            return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, targetZone, zoneSpec) :
                new Zone(targetZone, zoneSpec);
        };
        ZoneDelegate.prototype.intercept = function (targetZone, callback, source) {
            return this._interceptZS ?
                this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, targetZone, callback, source) :
                callback;
        };
        ZoneDelegate.prototype.invoke = function (targetZone, callback, applyThis, applyArgs, source) {
            return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, targetZone, callback, applyThis, applyArgs, source) :
                callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.handleError = function (targetZone, error) {
            return this._handleErrorZS ?
                this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, targetZone, error) :
                true;
        };
        ZoneDelegate.prototype.scheduleTask = function (targetZone, task) {
            var returnTask = task;
            if (this._scheduleTaskZS) {
                if (this._hasTaskZS) {
                    returnTask._zoneDelegates.push(this._hasTaskDlgtOwner);
                }
                returnTask = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, targetZone, task);
                if (!returnTask)
                    returnTask = task;
            }
            else {
                if (task.scheduleFn) {
                    task.scheduleFn(task);
                }
                else if (task.type == microTask) {
                    scheduleMicroTask(task);
                }
                else {
                    throw new Error('Task is missing scheduleFn.');
                }
            }
            return returnTask;
        };
        ZoneDelegate.prototype.invokeTask = function (targetZone, task, applyThis, applyArgs) {
            return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, targetZone, task, applyThis, applyArgs) :
                task.callback.apply(applyThis, applyArgs);
        };
        ZoneDelegate.prototype.cancelTask = function (targetZone, task) {
            var value;
            if (this._cancelTaskZS) {
                value = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, targetZone, task);
            }
            else {
                if (!task.cancelFn) {
                    throw Error('Task is not cancelable');
                }
                value = task.cancelFn(task);
            }
            return value;
        };
        ZoneDelegate.prototype.hasTask = function (targetZone, isEmpty) {
            // hasTask should not throw error so other ZoneDelegate
            // can still trigger hasTask callback
            try {
                this._hasTaskZS &&
                    this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, targetZone, isEmpty);
            }
            catch (err) {
                this.handleError(targetZone, err);
            }
        };
        ZoneDelegate.prototype._updateTaskCount = function (type, count) {
            var counts = this._taskCounts;
            var prev = counts[type];
            var next = counts[type] = prev + count;
            if (next < 0) {
                throw new Error('More tasks executed then were scheduled.');
            }
            if (prev == 0 || next == 0) {
                var isEmpty = {
                    microTask: counts['microTask'] > 0,
                    macroTask: counts['macroTask'] > 0,
                    eventTask: counts['eventTask'] > 0,
                    change: type
                };
                this.hasTask(this.zone, isEmpty);
            }
        };
        return ZoneDelegate;
    }());
    var ZoneTask = /** @class */ (function () {
        function ZoneTask(type, source, callback, options, scheduleFn, cancelFn) {
            this._zone = null;
            this.runCount = 0;
            this._zoneDelegates = null;
            this._state = 'notScheduled';
            this.type = type;
            this.source = source;
            this.data = options;
            this.scheduleFn = scheduleFn;
            this.cancelFn = cancelFn;
            this.callback = callback;
            var self = this;
            // TODO: @JiaLiPassion options should have interface
            if (type === eventTask && options && options.useG) {
                this.invoke = ZoneTask.invokeTask;
            }
            else {
                this.invoke = function () {
                    return ZoneTask.invokeTask.call(global, self, this, arguments);
                };
            }
        }
        ZoneTask.invokeTask = function (task, target, args) {
            if (!task) {
                task = this;
            }
            _numberOfNestedTaskFrames++;
            try {
                task.runCount++;
                return task.zone.runTask(task, target, args);
            }
            finally {
                if (_numberOfNestedTaskFrames == 1) {
                    drainMicroTaskQueue();
                }
                _numberOfNestedTaskFrames--;
            }
        };
        Object.defineProperty(ZoneTask.prototype, "zone", {
            get: function () {
                return this._zone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ZoneTask.prototype, "state", {
            get: function () {
                return this._state;
            },
            enumerable: true,
            configurable: true
        });
        ZoneTask.prototype.cancelScheduleRequest = function () {
            this._transitionTo(notScheduled, scheduling);
        };
        ZoneTask.prototype._transitionTo = function (toState, fromState1, fromState2) {
            if (this._state === fromState1 || this._state === fromState2) {
                this._state = toState;
                if (toState == notScheduled) {
                    this._zoneDelegates = null;
                }
            }
            else {
                throw new Error(this.type + " '" + this.source + "': can not transition to '" + toState + "', expecting state '" + fromState1 + "'" + (fromState2 ? ' or \'' + fromState2 + '\'' : '') + ", was '" + this._state + "'.");
            }
        };
        ZoneTask.prototype.toString = function () {
            if (this.data && typeof this.data.handleId !== 'undefined') {
                return this.data.handleId.toString();
            }
            else {
                return Object.prototype.toString.call(this);
            }
        };
        // add toJSON method to prevent cyclic error when
        // call JSON.stringify(zoneTask)
        ZoneTask.prototype.toJSON = function () {
            return {
                type: this.type,
                state: this.state,
                source: this.source,
                zone: this.zone.name,
                runCount: this.runCount
            };
        };
        return ZoneTask;
    }());
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  MICROTASK QUEUE
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var symbolSetTimeout = __symbol__('setTimeout');
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var _microTaskQueue = [];
    var _isDrainingMicrotaskQueue = false;
    var nativeMicroTaskQueuePromise;
    function scheduleMicroTask(task) {
        // if we are not running in any task, and there has not been anything scheduled
        // we must bootstrap the initial task creation by manually scheduling the drain
        if (_numberOfNestedTaskFrames === 0 && _microTaskQueue.length === 0) {
            // We are not running in Task, so we need to kickstart the microtask queue.
            if (!nativeMicroTaskQueuePromise) {
                if (global[symbolPromise]) {
                    nativeMicroTaskQueuePromise = global[symbolPromise].resolve(0);
                }
            }
            if (nativeMicroTaskQueuePromise) {
                var nativeThen = nativeMicroTaskQueuePromise[symbolThen];
                if (!nativeThen) {
                    // native Promise is not patchable, we need to use `then` directly
                    // issue 1078
                    nativeThen = nativeMicroTaskQueuePromise['then'];
                }
                nativeThen.call(nativeMicroTaskQueuePromise, drainMicroTaskQueue);
            }
            else {
                global[symbolSetTimeout](drainMicroTaskQueue, 0);
            }
        }
        task && _microTaskQueue.push(task);
    }
    function drainMicroTaskQueue() {
        if (!_isDrainingMicrotaskQueue) {
            _isDrainingMicrotaskQueue = true;
            while (_microTaskQueue.length) {
                var queue = _microTaskQueue;
                _microTaskQueue = [];
                for (var i = 0; i < queue.length; i++) {
                    var task = queue[i];
                    try {
                        task.zone.runTask(task, null, null);
                    }
                    catch (error) {
                        _api.onUnhandledError(error);
                    }
                }
            }
            _api.microtaskDrainDone();
            _isDrainingMicrotaskQueue = false;
        }
    }
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    ///  BOOTSTRAP
    //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////
    var NO_ZONE = { name: 'NO ZONE' };
    var notScheduled = 'notScheduled', scheduling = 'scheduling', scheduled = 'scheduled', running = 'running', canceling = 'canceling', unknown = 'unknown';
    var microTask = 'microTask', macroTask = 'macroTask', eventTask = 'eventTask';
    var patches = {};
    var _api = {
        symbol: __symbol__,
        currentZoneFrame: function () { return _currentZoneFrame; },
        onUnhandledError: noop,
        microtaskDrainDone: noop,
        scheduleMicroTask: scheduleMicroTask,
        showUncaughtError: function () { return !Zone[__symbol__('ignoreConsoleErrorUncaughtError')]; },
        patchEventTarget: function () { return []; },
        patchOnProperties: noop,
        patchMethod: function () { return noop; },
        bindArguments: function () { return []; },
        patchThen: function () { return noop; },
        setNativePromise: function (NativePromise) {
            // sometimes NativePromise.resolve static function
            // is not ready yet, (such as core-js/es6.promise)
            // so we need to check here.
            if (NativePromise && typeof NativePromise.resolve === 'function') {
                nativeMicroTaskQueuePromise = NativePromise.resolve(0);
            }
        },
    };
    var _currentZoneFrame = { parent: null, zone: new Zone(null, null) };
    var _currentTask = null;
    var _numberOfNestedTaskFrames = 0;
    function noop() { }
    function __symbol__(name) {
        return '__zone_symbol__' + name;
    }
    performanceMeasure('Zone', 'Zone');
    return global['Zone'] = Zone;
})(typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global);

var __values = (undefined && undefined.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ?
                    [] :
                    [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var e_1, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise =  false || resolve(value));
            }
            function onReject(error) {
                promise && (promise =  false || reject(error));
            }
            try {
                for (var values_1 = __values(values), values_1_1 = values_1.next(); !values_1_1.done; values_1_1 = values_1.next()) {
                    var value = values_1_1.value;
                    if (!isThenable(value)) {
                        value = this.resolve(value);
                    }
                    value.then(onResolve, onReject);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (values_1_1 && !values_1_1.done && (_a = values_1.return)) _a.call(values_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var e_2, _a;
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            // Start at 2 to prevent prematurely resolving if .then is called immediately.
            var unresolvedCount = 2;
            var valueIndex = 0;
            var resolvedValues = [];
            var _loop_2 = function (value) {
                if (!isThenable(value)) {
                    value = this_1.resolve(value);
                }
                var curValueIndex = valueIndex;
                value.then(function (value) {
                    resolvedValues[curValueIndex] = value;
                    unresolvedCount--;
                    if (unresolvedCount === 0) {
                        resolve(resolvedValues);
                    }
                }, reject);
                unresolvedCount++;
                valueIndex++;
            };
            var this_1 = this;
            try {
                for (var values_2 = __values(values), values_2_1 = values_2.next(); !values_2_1.done; values_2_1 = values_2.next()) {
                    var value = values_2_1.value;
                    _loop_2(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (values_2_1 && !values_2_1.done && (_a = values_2.return)) _a.call(values_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Make the unresolvedCount zero-based again.
            unresolvedCount -= 2;
            if (unresolvedCount === 0) {
                resolve(resolvedValues);
            }
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    if (NativePromise) {
        patchThen(NativePromise);
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('fetch', function (global, Zone, api) {
    var fetch = global['fetch'];
    var ZoneAwarePromise = global.Promise;
    var symbolThenPatched = api.symbol('thenPatched');
    var fetchTaskScheduling = api.symbol('fetchTaskScheduling');
    var fetchTaskAborting = api.symbol('fetchTaskAborting');
    if (typeof fetch !== 'function') {
        return;
    }
    var OriginalAbortController = global['AbortController'];
    var supportAbort = typeof OriginalAbortController === 'function';
    var abortNative = null;
    if (supportAbort) {
        global['AbortController'] = function () {
            var abortController = new OriginalAbortController();
            var signal = abortController.signal;
            signal.abortController = abortController;
            return abortController;
        };
        abortNative = api.patchMethod(OriginalAbortController.prototype, 'abort', function (delegate) { return function (self, args) {
            if (self.task) {
                return self.task.zone.cancelTask(self.task);
            }
            return delegate.apply(self, args);
        }; });
    }
    var placeholder = function () { };
    global['fetch'] = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var options = args.length > 1 ? args[1] : null;
        var signal = options && options.signal;
        return new Promise(function (res, rej) {
            var task = Zone.current.scheduleMacroTask('fetch', placeholder, args, function () {
                var fetchPromise;
                var zone = Zone.current;
                try {
                    zone[fetchTaskScheduling] = true;
                    fetchPromise = fetch.apply(_this, args);
                }
                catch (error) {
                    rej(error);
                    return;
                }
                finally {
                    zone[fetchTaskScheduling] = false;
                }
                if (!(fetchPromise instanceof ZoneAwarePromise)) {
                    var ctor = fetchPromise.constructor;
                    if (!ctor[symbolThenPatched]) {
                        api.patchThen(ctor);
                    }
                }
                fetchPromise.then(function (resource) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    res(resource);
                }, function (error) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    rej(error);
                });
            }, function () {
                if (!supportAbort) {
                    rej('No AbortController supported, can not cancel fetch');
                    return;
                }
                if (signal && signal.abortController && !signal.aborted &&
                    typeof signal.abortController.abort === 'function' && abortNative) {
                    try {
                        Zone.current[fetchTaskAborting] = true;
                        abortNative.call(signal.abortController);
                    }
                    finally {
                        Zone.current[fetchTaskAborting] = false;
                    }
                }
                else {
                    rej('cancel fetch need a AbortController.signal');
                }
            });
            if (signal && signal.abortController) {
                signal.abortController.task = task;
            }
        });
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
var ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
var ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
var ObjectCreate = Object.create;
/** Array.prototype.slice */
var ArraySlice = Array.prototype.slice;
/** addEventListener string const */
var ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
var ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
var ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
var TRUE_STR = 'true';
/** false string const */
var FALSE_STR = 'false';
/** __zone_symbol__ string const */
var ZONE_SYMBOL_PREFIX = '__zone_symbol__';
function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
var zoneSymbol = Zone.__symbol__;
var isWindowExists = typeof window !== 'undefined';
var internalWindow = isWindowExists ? window : undefined;
var _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
var REMOVE_ATTRIBUTE = 'removeAttribute';
var NULL_ON_PROP_VALUE = [null];
function bindArguments(args, source) {
    for (var i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
function patchPrototype(prototype, fnNames) {
    var source = prototype.constructor['name'];
    var _loop_1 = function (i) {
        var name_1 = fnNames[i];
        var delegate = prototype[name_1];
        if (delegate) {
            var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name_1);
            if (!isPropertyWritable(prototypeDesc)) {
                return "continue";
            }
            prototype[name_1] = (function (delegate) {
                var patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name_1));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    };
    for (var i = 0; i < fnNames.length; i++) {
        _loop_1(i);
    }
}
function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
var isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
var isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
var isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
var zoneSymbolEventNames = {};
var wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    var eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    var target = this || event.target || _global;
    var listener = target[eventNameSymbol];
    var result;
    if (isBrowser && target === internalWindow && event.type === 'error') {
        // window.onerror have different signiture
        // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#window.onerror
        // and onerror callback will prevent default when callback return true
        var errorEvent = event;
        result = listener &&
            listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
        if (result === true) {
            event.preventDefault();
        }
    }
    else {
        result = listener && listener.apply(this, arguments);
        if (result != undefined && !result) {
            event.preventDefault();
        }
    }
    return result;
};
function patchProperty(obj, prop, prototype) {
    var desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        var prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    var onPropPatchedSymbol = zoneSymbol('on' + prop + 'patched');
    if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    var originalDescGet = desc.get;
    var originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    var eventName = prop.substr(2);
    var eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        var previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        var target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        var listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            var value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
    obj[onPropPatchedSymbol] = true;
}
function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (var i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        var onProperties = [];
        for (var prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (var j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
var originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
function patchClass(className) {
    var OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        var a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    var instance = new OriginalClass(function () { });
    var prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
function copySymbolProperties(src, dest) {
    if (typeof Object.getOwnPropertySymbols !== 'function') {
        return;
    }
    var symbols = Object.getOwnPropertySymbols(src);
    symbols.forEach(function (symbol) {
        var desc = Object.getOwnPropertyDescriptor(src, symbol);
        Object.defineProperty(dest, symbol, {
            get: function () {
                return src[symbol];
            },
            set: function (value) {
                if (desc && (!desc.writable || typeof desc.set !== 'function')) {
                    // if src[symbol] is not writable or not have a setter, just return
                    return;
                }
                src[symbol] = value;
            },
            enumerable: desc ? desc.enumerable : true,
            configurable: desc ? desc.configurable : true
        });
    });
}
var shouldCopySymbolProperties = false;

function patchMethod(target, name, patchFn) {
    var proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    var delegateName = zoneSymbol(name);
    var delegate = null;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        var desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            var patchDelegate_1 = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate_1(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
            if (shouldCopySymbolProperties) {
                copySymbolProperties(delegate, proto[name]);
            }
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
function patchMacroTask(obj, funcName, metaCreator) {
    var setNative = null;
    function scheduleTask(task) {
        var data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, function (delegate) { return function (self, args) {
        var meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    }; });
}

function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
var isDetectedIEOrEdge = false;
var ieOrEdge = false;
function isIE() {
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1) {
            return true;
        }
    }
    catch (error) {
    }
    return false;
}
function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        var ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = zoneSymbol('Promise');
    var ERROR_SYMBOL = zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
            }
        });
        window.addEventListener('test', options, options);
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
var zoneSymbolEventNames$1 = {};
var globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[zoneSymbolEventNames$1[event.type][TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        var eventNameToString = patchOptions && patchOptions.eventNameToString;
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        function checkIsPassive(task) {
            if (!passiveSupported && typeof taskData.options !== 'boolean' &&
                typeof taskData.options !== 'undefined' && taskData.options !== null) {
                // options is a non-null non-undefined object
                // passive is not supported
                // don't pass options as object
                // just pass capture as a boolean
                task.options = !!taskData.options.capture;
                taskData.options = task.options;
            }
        }
        var customScheduleGlobal = function (task) {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = zoneSymbolEventNames$1[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var eventName = arguments[0];
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                if (isNode && eventName === 'uncaughtException') {
                    // don't patch uncaughtException of nodejs to prevent endless loop
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
                    var trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
                    var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames$1[eventName] = {};
                    zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource +
                        (eventNameToString ? eventNameToString(eventName) : eventName);
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : undefined;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                if (!(!passiveSupported && typeof task.options === 'boolean')) {
                    // if not support passive, and we pass an option object
                    // to addEventListener, we should save the options to task
                    task.options = options;
                }
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = zoneSymbolEventNames$1[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = zoneSymbolEventNames$1[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
var taskSymbol = zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 :
                        undefined,
                    args: args
                };
                var task = scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (desc && isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
var eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties || ignoreProperties.length === 0) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global['__Zone_ignore_on_properties'];
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            var internalWindow = window;
            var ignoreErrorProperties = isIE ? [{ target: internalWindow, ignoreProperties: ['error'] }] : [];
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget_1 = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget_1) {
            patchFilteredProperties(XMLHttpRequestEventTarget_1 && XMLHttpRequestEventTarget_1.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < eventNames.length; i++) {
        _loop_1(i);
    }
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function eventTargetPatch(_global, api) {
    var WTF_ISSUE_555 = 'Anchor,Area,Audio,BR,Base,BaseFont,Body,Button,Canvas,Content,DList,Directory,Div,Embed,FieldSet,Font,Form,Frame,FrameSet,HR,Head,Heading,Html,IFrame,Image,Input,Keygen,LI,Label,Legend,Link,Map,Marquee,Media,Menu,Meta,Meter,Mod,OList,Object,OptGroup,Option,Output,Paragraph,Pre,Progress,Quote,Script,Select,Source,Span,Style,TableCaption,TableCell,TableCol,Table,TableRow,TableSection,TextArea,Title,Track,UList,Unknown,Video';
    var NO_EVENT_TARGET = 'ApplicationCache,EventSource,FileReader,InputMethodContext,MediaController,MessagePort,Node,Performance,SVGElementInstance,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebKitNamedFlow,Window,Worker,WorkerGlobalScope,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload,IDBRequest,IDBOpenDBRequest,IDBDatabase,IDBTransaction,IDBCursor,DBIndex,WebSocket'
        .split(',');
    var EVENT_TARGET = 'EventTarget';
    var apis = [];
    var isWtf = _global['wtf'];
    var WTF_ISSUE_555_ARRAY = WTF_ISSUE_555.split(',');
    if (isWtf) {
        // Workaround for: https://github.com/google/tracing-framework/issues/555
        apis = WTF_ISSUE_555_ARRAY.map(function (v) { return 'HTML' + v + 'Element'; }).concat(NO_EVENT_TARGET);
    }
    else if (_global[EVENT_TARGET]) {
        apis.push(EVENT_TARGET);
    }
    else {
        // Note: EventTarget is not available in all browsers,
        // if it's not available, we instead patch the APIs in the IDL that inherit from EventTarget
        apis = NO_EVENT_TARGET;
    }
    var isDisableIECheck = _global['__Zone_disable_IE_check'] || false;
    var isEnableCrossContextCheck = _global['__Zone_enable_cross_context_check'] || false;
    var ieOrEdge = isIEOrEdge();
    var ADD_EVENT_LISTENER_SOURCE = '.addEventListener:';
    var FUNCTION_WRAPPER = '[object FunctionWrapper]';
    var BROWSER_TOOLS = 'function __BROWSERTOOLS_CONSOLE_SAFEFUNC() { [native code] }';
    //  predefine all __zone_symbol__ + eventName + true/false string
    for (var i = 0; i < eventNames.length; i++) {
        var eventName = eventNames[i];
        var falseEventName = eventName + FALSE_STR;
        var trueEventName = eventName + TRUE_STR;
        var symbol = ZONE_SYMBOL_PREFIX + falseEventName;
        var symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
        zoneSymbolEventNames$1[eventName] = {};
        zoneSymbolEventNames$1[eventName][FALSE_STR] = symbol;
        zoneSymbolEventNames$1[eventName][TRUE_STR] = symbolCapture;
    }
    //  predefine all task.source string
    for (var i = 0; i < WTF_ISSUE_555.length; i++) {
        var target = WTF_ISSUE_555_ARRAY[i];
        var targets = globalSources[target] = {};
        for (var j = 0; j < eventNames.length; j++) {
            var eventName = eventNames[j];
            targets[eventName] = target + ADD_EVENT_LISTENER_SOURCE + eventName;
        }
    }
    var checkIEAndCrossContext = function (nativeDelegate, delegate, target, args) {
        if (!isDisableIECheck && ieOrEdge) {
            if (isEnableCrossContextCheck) {
                try {
                    var testString = delegate.toString();
                    if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                        nativeDelegate.apply(target, args);
                        return false;
                    }
                }
                catch (error) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
            else {
                var testString = delegate.toString();
                if ((testString === FUNCTION_WRAPPER || testString == BROWSER_TOOLS)) {
                    nativeDelegate.apply(target, args);
                    return false;
                }
            }
        }
        else if (isEnableCrossContextCheck) {
            try {
                delegate.toString();
            }
            catch (error) {
                nativeDelegate.apply(target, args);
                return false;
            }
        }
        return true;
    };
    var apiTypes = [];
    for (var i = 0; i < apis.length; i++) {
        var type = _global[apis[i]];
        apiTypes.push(type && type.prototype);
    }
    // vh is validateHandler to check event handler
    // is valid or not(for security check)
    patchEventTarget(_global, apiTypes, { vh: checkIEAndCrossContext });
    api.patchEventTarget = patchEventTarget;
    return true;
}
function patchEvent(global, api) {
    patchEventPrototype(global, api);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function patchCallbacks(target, targetName, method, callbacks) {
    var symbol = Zone.__symbol__(method);
    if (target[symbol]) {
        return;
    }
    var nativeDelegate = target[symbol] = target[method];
    target[method] = function (name, opts, options) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = targetName + "." + method + "::" + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else if (prototype[callback]) {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    attachOriginToPatched(target[method], nativeDelegate);
}
function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    patchCallbacks(document, 'Document', 'registerElement', callbacks);
}
function patchCustomElements(_global) {
    if ((!isBrowser && !isMix) || !('customElements' in _global)) {
        return;
    }
    var callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
    patchCallbacks(_global.customElements, 'customElements', 'define', callbacks);
}

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('util', function (global, Zone, api) {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
});
Zone.__load_patch('timers', function (global) {
    var set = 'set';
    var clear = 'clear';
    patchTimer(global, set, clear, 'Timeout');
    patchTimer(global, set, clear, 'Interval');
    patchTimer(global, set, clear, 'Immediate');
});
Zone.__load_patch('requestAnimationFrame', function (global) {
    patchTimer(global, 'request', 'cancel', 'AnimationFrame');
    patchTimer(global, 'mozRequest', 'mozCancel', 'AnimationFrame');
    patchTimer(global, 'webkitRequest', 'webkitCancel', 'AnimationFrame');
});
Zone.__load_patch('blocking', function (global, Zone) {
    var blockingMethods = ['alert', 'prompt', 'confirm'];
    for (var i = 0; i < blockingMethods.length; i++) {
        var name_1 = blockingMethods[i];
        patchMethod(global, name_1, function (delegate, symbol, name) {
            return function (s, args) {
                return Zone.current.run(delegate, global, args, name);
            };
        });
    }
});
Zone.__load_patch('EventTarget', function (global, Zone, api) {
    // load blackListEvents from global
    var SYMBOL_BLACK_LISTED_EVENTS = Zone.__symbol__('BLACK_LISTED_EVENTS');
    if (global[SYMBOL_BLACK_LISTED_EVENTS]) {
        Zone[SYMBOL_BLACK_LISTED_EVENTS] = global[SYMBOL_BLACK_LISTED_EVENTS];
    }
    patchEvent(global, api);
    eventTargetPatch(global, api);
    // patch XMLHttpRequestEventTarget's addEventListener/removeEventListener
    var XMLHttpRequestEventTarget = global['XMLHttpRequestEventTarget'];
    if (XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype) {
        api.patchEventTarget(global, [XMLHttpRequestEventTarget.prototype]);
    }
    patchClass('MutationObserver');
    patchClass('WebKitMutationObserver');
    patchClass('IntersectionObserver');
    patchClass('FileReader');
});
Zone.__load_patch('on_property', function (global, Zone, api) {
    propertyDescriptorPatch(api, global);
    propertyPatch();
});
Zone.__load_patch('customElements', function (global, Zone, api) {
    registerElementPatch(global);
    patchCustomElements(global);
});
Zone.__load_patch('canvas', function (global) {
    var HTMLCanvasElement = global['HTMLCanvasElement'];
    if (typeof HTMLCanvasElement !== 'undefined' && HTMLCanvasElement.prototype &&
        HTMLCanvasElement.prototype.toBlob) {
        patchMacroTask(HTMLCanvasElement.prototype, 'toBlob', function (self, args) {
            return { name: 'HTMLCanvasElement.toBlob', target: self, cbIdx: 0, args: args };
        });
    }
});
Zone.__load_patch('XHR', function (global, Zone) {
    // Treat XMLHttpRequest as a macrotask.
    patchXHR(global);
    var XHR_TASK = zoneSymbol('xhrTask');
    var XHR_SYNC = zoneSymbol('xhrSync');
    var XHR_LISTENER = zoneSymbol('xhrListener');
    var XHR_SCHEDULED = zoneSymbol('xhrScheduled');
    var XHR_URL = zoneSymbol('xhrURL');
    var XHR_ERROR_BEFORE_SCHEDULED = zoneSymbol('xhrErrorBeforeScheduled');
    function patchXHR(window) {
        var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
        function findPendingTask(target) {
            return target[XHR_TASK];
        }
        var oriAddListener = XMLHttpRequestPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
        var oriRemoveListener = XMLHttpRequestPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
        if (!oriAddListener) {
            var XMLHttpRequestEventTarget_1 = window['XMLHttpRequestEventTarget'];
            if (XMLHttpRequestEventTarget_1) {
                var XMLHttpRequestEventTargetPrototype = XMLHttpRequestEventTarget_1.prototype;
                oriAddListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = XMLHttpRequestEventTargetPrototype[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
        }
        var READY_STATE_CHANGE = 'readystatechange';
        var SCHEDULED = 'scheduled';
        function scheduleTask(task) {
            var data = task.data;
            var target = data.target;
            target[XHR_SCHEDULED] = false;
            target[XHR_ERROR_BEFORE_SCHEDULED] = false;
            // remove existing event listener
            var listener = target[XHR_LISTENER];
            if (!oriAddListener) {
                oriAddListener = target[ZONE_SYMBOL_ADD_EVENT_LISTENER];
                oriRemoveListener = target[ZONE_SYMBOL_REMOVE_EVENT_LISTENER];
            }
            if (listener) {
                oriRemoveListener.call(target, READY_STATE_CHANGE, listener);
            }
            var newListener = target[XHR_LISTENER] = function () {
                if (target.readyState === target.DONE) {
                    // sometimes on some browsers XMLHttpRequest will fire onreadystatechange with
                    // readyState=4 multiple times, so we need to check task state here
                    if (!data.aborted && target[XHR_SCHEDULED] && task.state === SCHEDULED) {
                        // check whether the xhr has registered onload listener
                        // if that is the case, the task should invoke after all
                        // onload listeners finish.
                        var loadTasks = target['__zone_symbol__loadfalse'];
                        if (loadTasks && loadTasks.length > 0) {
                            var oriInvoke_1 = task.invoke;
                            task.invoke = function () {
                                // need to load the tasks again, because in other
                                // load listener, they may remove themselves
                                var loadTasks = target['__zone_symbol__loadfalse'];
                                for (var i = 0; i < loadTasks.length; i++) {
                                    if (loadTasks[i] === task) {
                                        loadTasks.splice(i, 1);
                                    }
                                }
                                if (!data.aborted && task.state === SCHEDULED) {
                                    oriInvoke_1.call(task);
                                }
                            };
                            loadTasks.push(task);
                        }
                        else {
                            task.invoke();
                        }
                    }
                    else if (!data.aborted && target[XHR_SCHEDULED] === false) {
                        // error occurs when xhr.send()
                        target[XHR_ERROR_BEFORE_SCHEDULED] = true;
                    }
                }
            };
            oriAddListener.call(target, READY_STATE_CHANGE, newListener);
            var storedTask = target[XHR_TASK];
            if (!storedTask) {
                target[XHR_TASK] = task;
            }
            sendNative.apply(target, data.args);
            target[XHR_SCHEDULED] = true;
            return task;
        }
        function placeholderCallback() { }
        function clearTask(task) {
            var data = task.data;
            // Note - ideally, we would call data.target.removeEventListener here, but it's too late
            // to prevent it from firing. So instead, we store info for the event listener.
            data.aborted = true;
            return abortNative.apply(data.target, data.args);
        }
        var openNative = patchMethod(XMLHttpRequestPrototype, 'open', function () { return function (self, args) {
            self[XHR_SYNC] = args[2] == false;
            self[XHR_URL] = args[1];
            return openNative.apply(self, args);
        }; });
        var XMLHTTPREQUEST_SOURCE = 'XMLHttpRequest.send';
        var fetchTaskAborting = zoneSymbol('fetchTaskAborting');
        var fetchTaskScheduling = zoneSymbol('fetchTaskScheduling');
        var sendNative = patchMethod(XMLHttpRequestPrototype, 'send', function () { return function (self, args) {
            if (Zone.current[fetchTaskScheduling] === true) {
                // a fetch is scheduling, so we are using xhr to polyfill fetch
                // and because we already schedule macroTask for fetch, we should
                // not schedule a macroTask for xhr again
                return sendNative.apply(self, args);
            }
            if (self[XHR_SYNC]) {
                // if the XHR is sync there is no task to schedule, just execute the code.
                return sendNative.apply(self, args);
            }
            else {
                var options = { target: self, url: self[XHR_URL], isPeriodic: false, args: args, aborted: false };
                var task = scheduleMacroTaskWithCurrentZone(XMLHTTPREQUEST_SOURCE, placeholderCallback, options, scheduleTask, clearTask);
                if (self && self[XHR_ERROR_BEFORE_SCHEDULED] === true && !options.aborted &&
                    task.state === SCHEDULED) {
                    // xhr request throw error when send
                    // we should invoke task instead of leaving a scheduled
                    // pending macroTask
                    task.invoke();
                }
            }
        }; });
        var abortNative = patchMethod(XMLHttpRequestPrototype, 'abort', function () { return function (self, args) {
            var task = findPendingTask(self);
            if (task && typeof task.type == 'string') {
                // If the XHR has already completed, do nothing.
                // If the XHR has already been aborted, do nothing.
                // Fix #569, call abort multiple times before done will cause
                // macroTask task count be negative number
                if (task.cancelFn == null || (task.data && task.data.aborted)) {
                    return;
                }
                task.zone.cancelTask(task);
            }
            else if (Zone.current[fetchTaskAborting] === true) {
                // the abort is called from fetch polyfill, we need to call native abort of XHR.
                return abortNative.apply(self, args);
            }
            // Otherwise, we are trying to abort an XHR which has not yet been sent, so there is no
            // task
            // to cancel. Do nothing.
        }; });
    }
});
Zone.__load_patch('geolocation', function (global) {
    /// GEO_LOCATION
    if (global['navigator'] && global['navigator'].geolocation) {
        patchPrototype(global['navigator'].geolocation, ['getCurrentPosition', 'watchPosition']);
    }
});
Zone.__load_patch('PromiseRejectionEvent', function (global, Zone) {
    // handle unhandled promise rejection
    function findPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = findEventTasks(global, evtName);
            eventTasks.forEach(function (eventTask) {
                // windows has added unhandledrejection event listener
                // trigger the event listener
                var PromiseRejectionEvent = global['PromiseRejectionEvent'];
                if (PromiseRejectionEvent) {
                    var evt = new PromiseRejectionEvent(evtName, { promise: e.promise, reason: e.rejection });
                    eventTask.invoke(evt);
                }
            });
        };
    }
    if (global['PromiseRejectionEvent']) {
        Zone[zoneSymbol('unhandledPromiseRejectionHandler')] =
            findPromiseRejectionHandler('unhandledrejection');
        Zone[zoneSymbol('rejectionHandledHandler')] =
            findPromiseRejectionHandler('rejectionhandled');
    }
});

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

})));


/***/ }),

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/admin/admin.component.html":
/*!********************************************!*\
  !*** ./src/app/admin/admin.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n\n<header class=\"sticky-top\"> \n\n  <div class=\"container\">\n \n   <nav id=\"navbar\" class=\"navbar navbar-expand-sm navbar-light\">\n                                 \n                <div class=\"navbar col-6 mr-auto\">\n                                <h4 id=\"brand\" class=\"navbar mr-auto\">The<span>Kims</span>Web &nbsp; &nbsp;<fa name=\"stethoscope\" size=\"lg\" class=\"mx-auto\"></fa></h4>\n                                \n                                <h4 id=\"site\" class=\"navbar ml-auto\">Admin Site</h4>\n                </div>\n                        \n \n     <button class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#menu\">\n             <span class=\"navbar-toggler-icon\"></span>\n     </button>\n \n     <div class=\"collapse navbar-collapse \" id=\"menu\">\n \n             <ul id=\"navbar-nav\" class=\"nav ml-auto\">\n \n                     <li class=\"nav-item\"><a (click)=\"home()\" class=\"nav-link\">Home</a></li>\n                     <li id=\"dropdown\" class=\"nav-item dropdown\">\n                        \n                        <a class=\"nav-link \" data-toggle=\"dropdown\">\n                            <fa name=\"user\" size=\"lg\"></fa>\n                            \n                        </a>\n                        \n                        <div class=\"dropdown-menu\">\n                            <small id=\"user\" class=\"dropdown-item\">{{adminUser}}</small>\n                            <hr>\n                            <a id=\"logout\" href=\"/kimsapp/login\" (click)=\"logOut()\" class=\"dropdown-item\">LogOut</a>\n\n                        </div>\n\n                        \n                    </li>\n                                     \n \n             </ul>\n \n     </div>\n \n </nav>\n \n \n  </div>\n \n </header>\n\n <router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/admin/admin.component.scss":
/*!********************************************!*\
  !*** ./src/app/admin/admin.component.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\n/*-----------------------------------------------------*/\n.container-fluid, .container {\n  width: 100%; }\nheader {\n  background-color: #35424a;\n  text-align: center;\n  padding: 3px;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n  border-bottom: #e8491d 3px solid; }\nheader #brand {\n    font-family: Montserrat;\n    font-size: 16px;\n    font-weight: bold;\n    text-transform: uppercase;\n    color: #17a2b8;\n    text-shadow: 5px 5px 3px black; }\nheader #brand span {\n      font-size: 24px;\n      color: #e8491d;\n      text-shadow: 5px 5px 3px black; }\nheader #brand fa {\n      margin-left: 2em;\n      color: #e8491d; }\nheader #site {\n    font-size: 16px;\n    font-weight: bold;\n    text-transform: uppercase;\n    color: #17a2b8;\n    text-shadow: 5px 5px 3px black; }\nheader .navbar {\n    margin: 0;\n    padding: 0; }\nheader .navbar .nav li a {\n      cursor: pointer;\n      color: #17a2b8;\n      font-weight: bolder;\n      text-transform: uppercase;\n      text-shadow: 5px 5px 3px black; }\nheader .navbar .nav li a:hover {\n      font-weight: bolder; }\nheader .navbar .nav #dropdown a {\n      color: #e8491d;\n      cursor: pointer;\n      text-shadow: 5px 5px 3px black; }\nheader .navbar .nav #dropdown .dropdown-menu:hover, header .navbar .nav #dropdown a:hover + .dropdown-menu {\n      display: block; }\nheader .navbar .nav #dropdown .dropdown-menu {\n      background-color: #e8491d;\n      top: 4.5em;\n      -webkit-transform: translate(-50%, -50%);\n              transform: translate(-50%, -50%);\n      display: none; }\nheader .navbar .nav #dropdown .dropdown-menu #user {\n        cursor: default;\n        color: black;\n        font-size: 16px;\n        font-weight: bolder;\n        text-transform: capitalize;\n        text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3); }\nheader .navbar .nav #dropdown .dropdown-menu #user:hover {\n        background-color: #e8491d; }\nheader .navbar .nav #dropdown .dropdown-menu hr {\n        margin: 0; }\nheader .navbar .nav #dropdown .dropdown-menu #logout {\n        color: #6c757d;\n        text-transform: lowercase;\n        text-transform: capitalize;\n        text-align: center;\n        font-weight: bolder;\n        font-size: 14px;\n        text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.1); }\nheader .navbar .nav #dropdown .dropdown-menu #logout:hover {\n        cursor: pointer;\n        background-color: #35424a;\n        color: white; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWRtaW4vQzpcXFRoZUNvZGVcXG1lYW5BcHBSYXdcXGtpbXNhcHAvc3JjXFxhcHBcXGFkbWluXFxhZG1pbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBc0NJLHdEQUFBO0FBQ0E7RUFDSSxXQUFXLEVBQUE7QUFHZjtFQUNJLHlCQXZDVTtFQXdDVixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLDBDQUF5QztFQUN6QyxnQ0FBd0MsRUFBQTtBQUw1QztJQVFRLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLHlCQUF5QjtJQUN6QixjQXZDSztJQXdDTCw4QkFBeUMsRUFBQTtBQWJqRDtNQWdCWSxlQUFlO01BQ2YsY0F4REs7TUF5REwsOEJBQXlDLEVBQUE7QUFsQnJEO01Bc0JZLGdCQUFnQjtNQUNoQixjQTlESyxFQUFBO0FBdUNqQjtJQThCUSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLHlCQUF5QjtJQUN6QixjQTVESztJQTZETCw4QkFBeUMsRUFBQTtBQWxDakQ7SUF1Q1EsU0FBUztJQUNULFVBQVUsRUFBQTtBQXhDbEI7TUE2Q29CLGVBQWU7TUFDZixjQXpFUDtNQTBFTyxtQkFBbUI7TUFDbkIseUJBQXlCO01BQ3pCLDhCQUF5QyxFQUFBO0FBakQ3RDtNQW9Eb0IsbUJBQW1CLEVBQUE7QUFwRHZDO01BMERvQixjQWpHSDtNQWtHRyxlQUFlO01BQ2YsOEJBQXlDLEVBQUE7QUE1RDdEO01BK0RvQixjQUFjLEVBQUE7QUEvRGxDO01Bb0VnQix5QkEzR0M7TUE0R0QsVUFBVTtNQUNWLHdDQUFnQztjQUFoQyxnQ0FBZ0M7TUFDaEMsYUFBYSxFQUFBO0FBdkU3QjtRQTBFb0IsZUFBZTtRQUNmLFlBQVk7UUFDWixlQUFlO1FBQ2YsbUJBQW1CO1FBQ25CLDBCQUEwQjtRQUMxQiwyQ0FBMEMsRUFBQTtBQS9FOUQ7UUFrRm9CLHlCQXpISCxFQUFBO0FBdUNqQjtRQXFGb0IsU0FBUyxFQUFBO0FBckY3QjtRQXdGb0IsY0FySEY7UUFzSEUseUJBQXlCO1FBQ3pCLDBCQUEwQjtRQUMxQixrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZiwyQ0FBMEMsRUFBQTtBQTlGOUQ7UUFpR29CLGVBQWU7UUFDZix5QkF4SU47UUF5SU0sWUFBWSxFQUFBIiwiZmlsZSI6InNyYy9hcHAvYWRtaW4vYWRtaW4uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0gR2xvYmFsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLyogQnJlYWtwb2ludHM6IHhzOiAwLCAgc206IDU3NnB4OyBtZDogNzY4cHg7IGxnOiA5OTJweDsgeGw6IDEyMDBweDsgKi9cclxuXHJcbiRjb2xvcnM6IChcclxuICAgIGJnOiAjYzBjMGMwLFxyXG4gICAgZmV2b3JpdGU6ICNlODQ5MWQsXHJcbiAgICB0aGVtZTogIzM1NDI0YSxcclxuICAgIHByaW1hcnk6ICMwMDdiZmYsXHJcbiAgICBwcmltYXJ5LWxpZ2h0OiBsaWdodGVuKCMwMDVERkYsIDQwJSksXHJcbiAgICBwcmltYXJ5LWRhcms6IGRhcmtlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgYWNjZW50OiAjRkZGNkJCLFxyXG4gICAgZ2lybGlzaDogcmdiKDE5NSwgMTUsIDIwMSksXHJcbiAgICBmb3JtOiBsaWdodGVuKCMzNTQyNGEsIDQwJSksXHJcbiAgICBncmF5OiAjNmM3NTdkLFxyXG4gICAgZ3JheS1kYXJrOiAjMzQzYTQwLFxyXG4gICAgc2Vjb25kYXJ5OiAjNmM3NTdkLFxyXG4gICAgc3VjY2VzczogIzI4YTc0NSxcclxuICAgIGluZm86ICMxN2EyYjgsXHJcbiAgICB3YXJuaW5nOiAjZmZjMTA3LFxyXG4gICAgZGFuZ2VyOiAjZGMzNTQ1LFxyXG4gICAgbGlnaHQ6ICNmOGY5ZmEsXHJcbiAgICBkYXJrOiAjMzQzYTQwXHJcblxyXG4pO1xyXG5cclxuQGZ1bmN0aW9uIGNvbG9yKCRjb2xvci1uYW1lKXtcclxuICAgIEByZXR1cm4gbWFwLWdldCgkY29sb3JzICwgJGNvbG9yLW5hbWUpXHJcbn1cclxuXHJcbiRkZXNrdG9wOiA3NjhweDtcclxuJG9wYWNpdHk6IC45O1xyXG5cclxuQG1peGluIGRlc2t0b3Age1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3B9KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5cclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgLmNvbnRhaW5lci1mbHVpZCwgLmNvbnRhaW5lciB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICB9XHJcblxyXG4gICAgaGVhZGVyIHtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcih0aGVtZSk7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgICAgIHBhZGRpbmc6IDNweDtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC41KTtcclxuICAgICAgICBib3JkZXItYm90dG9tOiBjb2xvcihmZXZvcml0ZSkgM3B4IHNvbGlkO1xyXG5cclxuICAgICAgICAjYnJhbmR7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHNwYW4ge1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmYXtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyZW07XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoZmV2b3JpdGUpOyBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgICNzaXRle1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC5uYXZiYXJ7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgcGFkZGluZzogMDtcclxuXHJcbiAgICAgICAgICAgIC5uYXZ7XHJcbiAgICAgICAgICAgICAgICBsaXtcclxuICAgICAgICAgICAgICAgICAgICBhe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcihpbmZvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGE6aG92ZXJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICNkcm9wZG93bntcclxuICAgICAgICAgICAgICAgICAgICBhe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAuZHJvcGRvd24tbWVudTpob3ZlciwgYTpob3ZlciArIC5kcm9wZG93bi1tZW51e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBibG9jaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAuZHJvcGRvd24tbWVudXtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wOiA0LjVlbTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAjdXNlcntcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBkZWZhdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgI3VzZXI6aG92ZXJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaHJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgI2xvZ291dHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKHNlY29uZGFyeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBsb3dlcmNhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgLjEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAjbG9nb3V0OmhvdmVye1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKHRoZW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHdoaXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/admin/admin.component.ts":
/*!******************************************!*\
  !*** ./src/app/admin/admin.component.ts ***!
  \******************************************/
/*! exports provided: AdminComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminComponent", function() { return AdminComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var AdminComponent = /** @class */ (function () {
    function AdminComponent(router) {
        this.router = router;
    }
    AdminComponent.prototype.ngOnInit = function () {
        this.adminUser = localStorage.getItem("adminUser");
    };
    AdminComponent.prototype.home = function () {
        this.router.navigate(["/kimsapp/admin"]);
    };
    AdminComponent.prototype.logOut = function () {
        window.localStorage.removeItem("adminToken");
        window.localStorage.removeItem("adminUser");
    };
    AdminComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-admin',
            template: __webpack_require__(/*! ./admin.component.html */ "./src/app/admin/admin.component.html"),
            styles: [__webpack_require__(/*! ./admin.component.scss */ "./src/app/admin/admin.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AdminComponent);
    return AdminComponent;
}());



/***/ }),

/***/ "./src/app/admin/ahome/ahome.component.html":
/*!**************************************************!*\
  !*** ./src/app/admin/ahome/ahome.component.html ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\n    <form id=\"home_form\" class=\"col-sm-12 col-md-6 mx-auto rounded \">\n\n        <h1>Home Page</h1>\n        <h4>Choose Section</h4>\n\n        <ul>\n            <li><a (click)='Monitor()'>Monitor</a></li>\n            <li><a (click)='mRecords()'>Medical Records</a></li>\n            <li><a (click)='Users()'>Users</a></li>\n            <li><a href=\"/kimsapp/admin/register\">Register</a></li>\n            \n        </ul>\n\n    </form>\n\n</div>"

/***/ }),

/***/ "./src/app/admin/ahome/ahome.component.scss":
/*!**************************************************!*\
  !*** ./src/app/admin/ahome/ahome.component.scss ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\nform {\n  background-color: #4a5d68;\n  padding: 1em 2em 1em 2em;\n  margin: 1em 0 0 0;\n  width: 90%;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\n@media (min-width: 768px) {\n    form {\n      width: 30%; } }\nform h1 {\n    font-size: 20px;\n    font-weight: bold;\n    color: #e8491d;\n    text-shadow: 5px 5px 3px black; }\nform h4 {\n    font-size: 18px;\n    font-weight: bold; }\nform ul {\n    list-style-type: none; }\nform ul li {\n      margin: 2em 0 1em 0; }\nform ul li a {\n        color: #17a2b8;\n        font-size: 16px;\n        font-weight: bold; }\nform ul li a:hover {\n        cursor: pointer;\n        font-weight: bolder;\n        font-size: 18px;\n        color: #ffc107; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWRtaW4vYWhvbWUvQzpcXFRoZUNvZGVcXG1lYW5BcHBSYXdcXGtpbXNhcHAvc3JjXFxhcHBcXGFkbWluXFxhaG9tZVxcYWhvbWUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkRBQUE7QUFDQSxzRUFBQTtBQTZDQTtFQUNJLHlCQW5DMkI7RUFvQzNCLHdCQUF3QjtFQUN4QixpQkFBaUI7RUFDakIsVUFBVTtFQUNWLDBDQUF5QyxFQUFBO0FBWHpDO0lBTUo7TUFRUSxVQUFVLEVBQUEsRUErQmpCO0FBdkNEO0lBWVEsZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixjQXZEYTtJQXdEYiw4QkFBeUMsRUFBQTtBQWZqRDtJQWtCUSxlQUFlO0lBQ2YsaUJBQWlCLEVBQUE7QUFuQnpCO0lBc0JRLHFCQUFxQixFQUFBO0FBdEI3QjtNQXdCWSxtQkFBbUIsRUFBQTtBQXhCL0I7UUEwQmdCLGNBdkRDO1FBd0RELGVBQWU7UUFDZixpQkFBaUIsRUFBQTtBQTVCakM7UUErQmdCLGVBQWU7UUFDZixtQkFBbUI7UUFDbkIsZUFBZTtRQUNmLGNBOURJLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9hZG1pbi9haG9tZS9haG9tZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLSBHbG9iYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKiBCcmVha3BvaW50czogeHM6IDAsICBzbTogNTc2cHg7IG1kOiA3NjhweDsgbGc6IDk5MnB4OyB4bDogMTIwMHB4OyAqL1xyXG5cclxuJGNvbG9yczogKFxyXG4gICAgYmc6ICNjMGMwYzAsXHJcbiAgICBmZXZvcml0ZTogI2U4NDkxZCxcclxuICAgIHByaW1hcnk6ICMwMDdiZmYsXHJcbiAgICBwcmltYXJ5LWxpZ2h0OiBsaWdodGVuKCMwMDVERkYsIDQwJSksXHJcbiAgICBoZWFkIDogZGFya2VuKCNlODQ5MWQsIDEwJSksXHJcbiAgICBwcmltYXJ5LWRhcms6IGRhcmtlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgYWNjZW50OiAjRkZGNkJCLFxyXG4gICAgZ2lybGlzaDogcmdiKDE5NSwgMTUsIDIwMSksXHJcbiAgICBmb3JtOiBsaWdodGVuKCMzNTQyNGEsIDEwJSksXHJcbiAgICBncmF5OiAjNmM3NTdkLFxyXG4gICAgZ3JheS1kYXJrOiAjMzQzYTQwLFxyXG4gICAgc2Vjb25kYXJ5OiAjNmM3NTdkLFxyXG4gICAgc3VjY2VzczogIzI4YTc0NSxcclxuICAgIGluZm86ICMxN2EyYjgsXHJcbiAgICB3YXJuaW5nOiAjZmZjMTA3LFxyXG4gICAgZGFuZ2VyOiAjZGMzNTQ1LFxyXG4gICAgbGlnaHQ6ICNmOGY5ZmEsXHJcbiAgICBkYXJrOiAjMzQzYTQwXHJcblxyXG4pO1xyXG5cclxuQGZ1bmN0aW9uIGNvbG9yKCRjb2xvci1uYW1lKXtcclxuICAgIEByZXR1cm4gbWFwLWdldCgkY29sb3JzICwgJGNvbG9yLW5hbWUpXHJcbn1cclxuXHJcbiRkZXNrdG9wOiA3NjhweDtcclxuJGRlc2t0b3Bfc206IDM2NHB4O1xyXG4kb3BhY2l0eTogLjk7XHJcblxyXG5AbWl4aW4gZGVza3RvcF9zbSB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcF9zbX0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcbkBtaXhpbiBkZXNrdG9wIHtcclxuICAgIEBtZWRpYSAobWluLXdpZHRoOiAjeyRkZXNrdG9wfSkge1xyXG4gICAgICAgIEBjb250ZW50O1xyXG4gICAgfSBcclxufVxyXG5cclxuXHJcbmZvcm17XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcihmb3JtKTtcclxuICAgIHBhZGRpbmc6IDFlbSAyZW0gMWVtIDJlbTtcclxuICAgIG1hcmdpbjogMWVtIDAgMCAwO1xyXG4gICAgd2lkdGg6IDkwJTtcclxuICAgIGJveC1zaGFkb3c6IDAgMTBweCAzMHB4IHJnYmEoMCwgMCwgMCwgLjMpO1xyXG5cclxuICAgIEBpbmNsdWRlIGRlc2t0b3Age1xyXG4gICAgICAgIHdpZHRoOiAzMCU7XHJcbiAgICB9XHJcblxyXG4gICAgaDF7XHJcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBoNHtcclxuICAgICAgICBmb250LXNpemU6IDE4cHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB9XHJcbiAgICB1bHtcclxuICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XHJcbiAgICAgICAgbGl7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMmVtIDAgMWVtIDA7XHJcbiAgICAgICAgICAgIGF7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhOmhvdmVye1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcclxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMThweDtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcih3YXJuaW5nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/admin/ahome/ahome.component.ts":
/*!************************************************!*\
  !*** ./src/app/admin/ahome/ahome.component.ts ***!
  \************************************************/
/*! exports provided: AhomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AhomeComponent", function() { return AhomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var AhomeComponent = /** @class */ (function () {
    function AhomeComponent(router) {
        this.router = router;
    }
    AhomeComponent.prototype.ngOnInit = function () {
    };
    AhomeComponent.prototype.Monitor = function () {
        this.router.navigate(["/kimsapp/admin/monitor"]);
    };
    AhomeComponent.prototype.mRecords = function () {
        this.router.navigate(["/kimsapp/admin/medicalDb"]);
    };
    AhomeComponent.prototype.Users = function () {
        this.router.navigate(["/kimsapp/admin/userDb"]);
    };
    AhomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-ahome',
            template: __webpack_require__(/*! ./ahome.component.html */ "./src/app/admin/ahome/ahome.component.html"),
            styles: [__webpack_require__(/*! ./ahome.component.scss */ "./src/app/admin/ahome/ahome.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AhomeComponent);
    return AhomeComponent;
}());



/***/ }),

/***/ "./src/app/admin/filedb/filedb.component.html":
/*!****************************************************!*\
  !*** ./src/app/admin/filedb/filedb.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\n  <div class=\"card-group\">\n\n    <form id=\"filedb_form\" class=\"form mx-auto rounded\">\n    \n      <h1>Medical Records Database</h1>\n      <h4><strong>Click to open the File :</strong></h4>\n      <hr>\n      <ul class=\"list-group\">\n\n          <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Total<span class=\"badge\">{{archivednumber}}</span></li>\n    \n      </ul>\n      <hr>\n      <ol >\n\n          <li *ngFor=\"let archivedfile of archivedfiles\" (click)=\"openfile(archivedfile.patientNo)\">\n              \n              {{archivedfile.name}} : {{archivedfile.patientNo}}\n\n          </li>\n          \n      </ol>    \n    <hr>\n    </form>\n\n    \n        <form id=\"open_form\" class=\"form mx-auto rounded\" [hidden]=\"hideform\">\n\n            <h1><strong>Medical Record</strong></h1>\n            \n            <hr>\n           \n            <label id=\"h_name\">Name: <strong id=\"pham_name\" class=\"text-warning\"  >{{name}}</strong></label> <br>\n\n            <label id=\"h_patientNo\">PatientNo: <strong id=\"pham_patientNo\" class=\"text-warning\"  >{{patientNo}}</strong></label>\n            &nbsp;&nbsp;&nbsp;\n            <label id=\"h_age\">Age: <strong id=\"pham_age\" class=\"text-warning\"  >{{age}}</strong></label>\n\n            &nbsp;&nbsp;&nbsp;&nbsp;\n            <label id=\"h_gender\">Gender: <strong id=\"pham_gender\" class=\"text-warning\"  >{{gender}}</strong></label> <br>\n\n            <label id=\"l_signs\" class=\"mt-1\"><strong>Signs & Symptoms</strong></label> <br>\n            <textarea id=\"pham_t_signs\" class=\"form-control form-control-sm\" name=\"signs\" cols=\"40\" rows=\"3\" placeholder=\"The patient was okay.. very healthy.\"  readonly=\"readonly\">{{signs}}</textarea> <br>\n\n            <label id=\"l_tests\" class=\"mt-1\"><strong>Tests</strong></label> <br>\n            <textarea id=\"pham_t_tests\" class=\"form-control form-control-sm\" name=\"tests\" cols=\"40\" rows=\"3\" placeholder=\"No tests done !\"  readonly=\"readonly\">{{tests}}</textarea> <br>\n\n            <label id=\"l_testsResults\" class=\"mt-1\"><strong>Tests' Results</strong></label> <br>\n            <textarea id=\"pham_t_testsResults\" class=\"form-control form-control-sm\" name=\"results\" cols=\"40\" rows=\"3\" placeholder=\"So definately, there was no results...\" readonly=\"readonly\">{{results}}</textarea> <br>\n\n            <label id=\"l_dx\" class=\"mt-1\"><strong>Diagnosis</strong></label> <br>\n            <textarea id=\"pham_t_dx\" class=\"form-control form-control-sm\" cols=\"40\" name=\"dx\" rows=\"3\" placeholder=\"No diagnosis perfomed !\" readonly=\"readonly\">{{dx}}</textarea> <br>          \n\n            <button id=\"btn_save\" type=\"button\" class=\"btn btn-sm btn-danger m-3\" (click)=\"deleteMED()\" > Delete </button>\n            <button id=\"btn_save\" type=\"button\" class=\"btn btn-sm btn-success m-3\" disabled=\"disabled\"> Forward </button>\n            <button id=\"btn_save\" type=\"button\" class=\"btn btn-sm btn-primary m-3\" disabled=\"disabled\"> Print </button>\n            \n\n            <hr>\n\n    </form>\n      \n  \n    \n    </div>\n\n  </div>"

/***/ }),

/***/ "./src/app/admin/filedb/filedb.component.scss":
/*!****************************************************!*\
  !*** ./src/app/admin/filedb/filedb.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\nform {\n  background-color: #4a5d68;\n  padding: 1em 2em 0 2em;\n  margin: 1em 0 0 0;\n  height: 0%;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\nform h1 {\n    font-size: 20px;\n    font-weight: bold;\n    color: #e8491d;\n    text-shadow: 5px 5px 3px black; }\nform h4 {\n    font-size: 12px;\n    font-weight: bold; }\nform ul li {\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n    font-weight: bold;\n    color: #17a2b8; }\nform ul li span {\n      background-color: #e8491d;\n      font-weight: 900;\n      color: black; }\nform ol {\n    list-style-type: none;\n    padding-left: 0; }\nform ol li {\n      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n      color: #17a2b8;\n      margin: 0 0 0 0;\n      padding: 0 0 0 1em;\n      height: 2em;\n      display: flex;\n      flex-direction: row;\n      align-items: flex-end; }\nform ol li:hover {\n      cursor: pointer;\n      color: #ffc107;\n      font-weight: bold;\n      height: 3em; }\nform #h_name, form #h_age, form #h_gender, form #l_signs, form #l_tests, form #l_testsResults, form #l_dx {\n    text-transform: capitalize;\n    font-size: 13px;\n    color: #000000; }\nform textarea {\n    color: #ffc107;\n    background-color: #4a5d68;\n    border: solid 1px #17a2b8;\n    border-radius: 1em; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWRtaW4vZmlsZWRiL0M6XFxUaGVDb2RlXFxtZWFuQXBwUmF3XFxraW1zYXBwL3NyY1xcYXBwXFxhZG1pblxcZmlsZWRiXFxmaWxlZGIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkRBQUE7QUFDQSxzRUFBQTtBQTZDQTtFQUNRLHlCQXBDdUI7RUFxQ3ZCLHNCQUFzQjtFQUN0QixpQkFBaUI7RUFDakIsVUFBVTtFQUNWLDBDQUF5QyxFQUFBO0FBTGpEO0lBUVksZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixjQW5EUztJQW9EVCw4QkFBeUMsRUFBQTtBQVhyRDtJQWNZLGVBQWU7SUFDZixpQkFBaUIsRUFBQTtBQWY3QjtJQW9CZ0IsMENBQXlDO0lBQ3pDLGlCQUFpQjtJQUNqQixjQXBEQyxFQUFBO0FBOEJqQjtNQXlCb0IseUJBbEVDO01BbUVELGdCQUFnQjtNQUNoQixZQUFZLEVBQUE7QUEzQmhDO0lBZ0NZLHFCQUFxQjtJQUNyQixlQUFlLEVBQUE7QUFqQzNCO01Bb0NnQiwwQ0FBeUM7TUFDekMsY0FuRUM7TUFvRUQsZUFBZTtNQUNmLGtCQUFrQjtNQUNsQixXQUFXO01BQ1gsYUFBYTtNQUNiLG1CQUFtQjtNQUNuQixxQkFBcUIsRUFBQTtBQTNDckM7TUE4Q2dCLGVBQWU7TUFDZixjQTVFSTtNQTZFSixpQkFBaUI7TUFDakIsV0FBVyxFQUFBO0FBakQzQjtJQXNEWSwwQkFBMEI7SUFDMUIsZUFBZTtJQUNmLGNBQWMsRUFBQTtBQXhEMUI7SUE0RFksY0F6RlE7SUEwRlIseUJBaEdtQjtJQWlHbkIseUJBNUZLO0lBNkZMLGtCQUFrQixFQUFBIiwiZmlsZSI6InNyYy9hcHAvYWRtaW4vZmlsZWRiL2ZpbGVkYi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLSBHbG9iYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKiBCcmVha3BvaW50czogeHM6IDAsICBzbTogNTc2cHg7IG1kOiA3NjhweDsgbGc6IDk5MnB4OyB4bDogMTIwMHB4OyAqL1xyXG5cclxuJGNvbG9yczogKFxyXG4gICAgYmc6ICNjMGMwYzAsXHJcbiAgICBmZXZvcml0ZTogI2U4NDkxZCxcclxuICAgIHByaW1hcnk6ICMwMDdiZmYsXHJcbiAgICBwcmltYXJ5LWxpZ2h0OiBsaWdodGVuKCMwMDVERkYsIDQwJSksXHJcbiAgICBwcmltYXJ5LWRhcms6IGRhcmtlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgYWNjZW50OiAjRkZGNkJCLFxyXG4gICAgZ2lybGlzaDogcmdiKDE5NSwgMTUsIDIwMSksXHJcbiAgICBmb3JtOiBsaWdodGVuKCMzNTQyNGEsIDEwJSksXHJcbiAgICBncmF5OiAjNmM3NTdkLFxyXG4gICAgZ3JheS1kYXJrOiAjMzQzYTQwLFxyXG4gICAgc2Vjb25kYXJ5OiAjNmM3NTdkLFxyXG4gICAgc3VjY2VzczogIzI4YTc0NSxcclxuICAgIGluZm86ICMxN2EyYjgsXHJcbiAgICB3YXJuaW5nOiAjZmZjMTA3LFxyXG4gICAgZGFuZ2VyOiAjZGMzNTQ1LFxyXG4gICAgbGlnaHQ6ICNmOGY5ZmEsXHJcbiAgICBkYXJrOiAjMzQzYTQwXHJcblxyXG4pO1xyXG5cclxuQGZ1bmN0aW9uIGNvbG9yKCRjb2xvci1uYW1lKXtcclxuICAgIEByZXR1cm4gbWFwLWdldCgkY29sb3JzICwgJGNvbG9yLW5hbWUpXHJcbn1cclxuXHJcblxyXG4kZGVza3RvcDogNzY4cHg7XHJcbiRkZXNrdG9wX3NtOiAzNjRweDtcclxuJG9wYWNpdHk6IC45O1xyXG5cclxuQG1peGluIGRlc2t0b3Bfc20ge1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3Bfc219KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5AbWl4aW4gZGVza3RvcCB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcH0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcblxyXG5mb3Jte1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZvcm0pO1xyXG4gICAgICAgIHBhZGRpbmc6IDFlbSAyZW0gMCAyZW07XHJcbiAgICAgICAgbWFyZ2luOiAxZW0gMCAwIDA7XHJcbiAgICAgICAgaGVpZ2h0OiAwJTtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgICAgICBcclxuICAgICAgICBoMXtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICAgICAgY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGg0e1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgIH1cclxuICAgICAgICB1bHtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGxpe1xyXG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuNSk7XHJcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcihpbmZvKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzcGFue1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogOTAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBvbHtcclxuICAgICAgICAgICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xyXG4gICAgICAgICAgICBwYWRkaW5nLWxlZnQ6IDA7XHJcblxyXG4gICAgICAgICAgICBsaXtcclxuICAgICAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAzMHB4IHJnYmEoMCwgMCwgMCwgLjUpO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwIDAgMCAwO1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMCAwIDAgMWVtO1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAyZW07XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBmbGV4O1xyXG4gICAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgICAgICAgICAgIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaTpob3ZlcntcclxuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcih3YXJuaW5nKTtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiAzZW07XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICNoX25hbWUsICNoX2FnZSwgI2hfZ2VuZGVyLCAjbF9zaWducywgI2xfdGVzdHMsICNsX3Rlc3RzUmVzdWx0cywgI2xfZHgge1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgICAgICBjb2xvcjogIzAwMDAwMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRleHRhcmVhe1xyXG4gICAgICAgICAgICBjb2xvcjogY29sb3Iod2FybmluZyk7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZvcm0pO1xyXG4gICAgICAgICAgICBib3JkZXI6IHNvbGlkIDFweCBjb2xvcihpbmZvKTtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMWVtO1xyXG4gICAgICAgIH1cclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/admin/filedb/filedb.component.ts":
/*!**************************************************!*\
  !*** ./src/app/admin/filedb/filedb.component.ts ***!
  \**************************************************/
/*! exports provided: FiledbComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FiledbComponent", function() { return FiledbComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_stats_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/stats.service */ "./src/app/services/stats.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var FiledbComponent = /** @class */ (function () {
    function FiledbComponent(statsService, notifyService) {
        this.statsService = statsService;
        this.notifyService = notifyService;
        this.hideform = true;
    }
    FiledbComponent.prototype.ngOnInit = function () {
        var _this = this;
        // on reload
        this.statsService.onreloadMED().subscribe(
        //do nothing
        );
        // medical db
        this.statsService.medicalDb().subscribe(function (data) {
            _this.archivednumber = data.archivednumber;
            _this.archivedfiles = data.archivedfiles;
        }, function (error) { console.error("Error", error); });
    };
    // open file
    FiledbComponent.prototype.openfile = function (id) {
        var _this = this;
        var patientNo = { patientNo: id };
        this.statsService.openmedical(patientNo).subscribe(function (data) {
            _this.name = data[0].name;
            _this.patientNo = data[0].patientNo;
            _this.age = data[0].age;
            _this.gender = data[0].gender;
            _this.signs = data[0].signs;
            _this.tests = data[0].tests;
            _this.results = data[0].results;
            _this.dx = data[0].dx;
            _this.hideform = false;
        }, function (error) { console.error("Error", error); });
    };
    ;
    // delete file
    FiledbComponent.prototype.deleteMED = function () {
        var _this = this;
        this.statsService.deleteMED().subscribe(function (data) {
            _this.notifyService.showSuccess("File deleted!", "Success");
            _this.hideform = true;
        }, function (error) { console.error("Error", error); });
    };
    ;
    FiledbComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-filedb',
            template: __webpack_require__(/*! ./filedb.component.html */ "./src/app/admin/filedb/filedb.component.html"),
            styles: [__webpack_require__(/*! ./filedb.component.scss */ "./src/app/admin/filedb/filedb.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_stats_service__WEBPACK_IMPORTED_MODULE_2__["StatsService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], FiledbComponent);
    return FiledbComponent;
}());



/***/ }),

/***/ "./src/app/admin/monitor/monitor.component.html":
/*!******************************************************!*\
  !*** ./src/app/admin/monitor/monitor.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\n<form id=\"monitor_form\" class=\"form col-sm-12 col-md-6 mx-auto rounded\">\n\n  <h1>Monitor</h1>\n  <h4><strong>Patients waiting for services in :</strong></h4>\n  <hr>\n\n  <ul class=\"list-group\">\n\n      <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Examination (from Adm)<span class=\"badge badge-success\">{{fromAdm}}</span></li>\n\n      <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Laboratory<span class=\"badge badge-warning\">{{toLab}}</span></li>\n\n      <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Examination (from Lab)<span class=\"badge badge-success\">{{fromLab}}</span></li>\n\n      <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Xray<span class=\"badge badge-danger\">{{toXray}}</span></li>\n\n      <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Examination (from Xray)<span class=\"badge badge-success\">{{fromXray}}</span></li>\n\n      <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Pharmacy<span class=\"badge badge-info\">{{toPharmacy}}</span></li>\n\n  </ul>\n\n  <hr>\n\n  <h4><strong>Database :</strong></h4>\n  \n  <ul class=\"list-group\">\n\n      <li id=\"archived\" class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Medical Records Archived<span class=\"badge\">{{archived}}</span></li>\n\n  </ul>\n\n\n</form>\n\n</div>"

/***/ }),

/***/ "./src/app/admin/monitor/monitor.component.scss":
/*!******************************************************!*\
  !*** ./src/app/admin/monitor/monitor.component.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\nform {\n  background-color: #4a5d68;\n  padding: 1em 2em 2em 2em;\n  margin: 1em 0 0 0;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\nform h1 {\n    font-size: 20px;\n    font-weight: bold;\n    color: #e8491d;\n    text-shadow: 5px 5px 3px black; }\nform h4 {\n    font-size: 12px;\n    font-weight: bold; }\nform ul li {\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n    color: #17a2b8; }\nform ul li span {\n      width: 10%;\n      font-weight: 900; }\nform ul #archived {\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n    font-weight: bold;\n    color: #17a2b8; }\nform ul #archived span {\n      background-color: #e8491d;\n      font-weight: 900;\n      color: black; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWRtaW4vbW9uaXRvci9DOlxcVGhlQ29kZVxcbWVhbkFwcFJhd1xca2ltc2FwcC9zcmNcXGFwcFxcYWRtaW5cXG1vbml0b3JcXG1vbml0b3IuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkRBQUE7QUFDQSxzRUFBQTtBQThDQTtFQUNRLHlCQXBDdUI7RUFxQ3ZCLHdCQUF3QjtFQUN4QixpQkFBaUI7RUFDakIsMENBQXlDLEVBQUE7QUFKakQ7SUFPWSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLGNBbkRTO0lBb0RULDhCQUF5QyxFQUFBO0FBVnJEO0lBYVksZUFBZTtJQUNmLGlCQUFpQixFQUFBO0FBZDdCO0lBa0JnQiwwQ0FBeUM7SUFDekMsY0FqREMsRUFBQTtBQThCakI7TUFxQm9CLFVBQVU7TUFDVixnQkFBZ0IsRUFBQTtBQXRCcEM7SUEyQmdCLDBDQUF5QztJQUN6QyxpQkFBaUI7SUFDakIsY0EzREMsRUFBQTtBQThCakI7TUFnQ29CLHlCQTFFQztNQTJFRCxnQkFBZ0I7TUFDaEIsWUFBWSxFQUFBIiwiZmlsZSI6InNyYy9hcHAvYWRtaW4vbW9uaXRvci9tb25pdG9yLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tIEdsb2JhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qIEJyZWFrcG9pbnRzOiB4czogMCwgIHNtOiA1NzZweDsgbWQ6IDc2OHB4OyBsZzogOTkycHg7IHhsOiAxMjAwcHg7ICovXHJcblxyXG4kY29sb3JzOiAoXHJcbiAgICBiZzogI2MwYzBjMCxcclxuICAgIGZldm9yaXRlOiAjZTg0OTFkLFxyXG4gICAgdGhlbWU6ICMzNTQyNGEsXHJcbiAgICBwcmltYXJ5OiAjMDA3YmZmLFxyXG4gICAgcHJpbWFyeS1saWdodDogbGlnaHRlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgcHJpbWFyeS1kYXJrOiBkYXJrZW4oIzAwNURGRiwgNDAlKSxcclxuICAgIGFjY2VudDogI0ZGRjZCQixcclxuICAgIGdpcmxpc2g6IHJnYigxOTUsIDE1LCAyMDEpLFxyXG4gICAgZm9ybTogbGlnaHRlbigjMzU0MjRhLCAxMCUpLFxyXG4gICAgZ3JheTogIzZjNzU3ZCxcclxuICAgIGdyYXktZGFyazogIzM0M2E0MCxcclxuICAgIHNlY29uZGFyeTogIzZjNzU3ZCxcclxuICAgIHN1Y2Nlc3M6ICMyOGE3NDUsXHJcbiAgICBpbmZvOiAjMTdhMmI4LFxyXG4gICAgd2FybmluZzogI2ZmYzEwNyxcclxuICAgIGRhbmdlcjogI2RjMzU0NSxcclxuICAgIGxpZ2h0OiAjZjhmOWZhLFxyXG4gICAgZGFyazogIzM0M2E0MFxyXG5cclxuKTtcclxuXHJcbkBmdW5jdGlvbiBjb2xvcigkY29sb3ItbmFtZSl7XHJcbiAgICBAcmV0dXJuIG1hcC1nZXQoJGNvbG9ycyAsICRjb2xvci1uYW1lKVxyXG59XHJcblxyXG5cclxuJGRlc2t0b3A6IDc2OHB4O1xyXG4kZGVza3RvcF9zbTogMzY0cHg7XHJcbiRvcGFjaXR5OiAuOTtcclxuXHJcbkBtaXhpbiBkZXNrdG9wX3NtIHtcclxuICAgIEBtZWRpYSAobWluLXdpZHRoOiAjeyRkZXNrdG9wX3NtfSkge1xyXG4gICAgICAgIEBjb250ZW50O1xyXG4gICAgfSBcclxufVxyXG5cclxuQG1peGluIGRlc2t0b3Age1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3B9KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5cclxuZm9ybXtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcihmb3JtKTtcclxuICAgICAgICBwYWRkaW5nOiAxZW0gMmVtIDJlbSAyZW07XHJcbiAgICAgICAgbWFyZ2luOiAxZW0gMCAwIDA7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuMyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgaDF7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoNHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdWx7XHJcbiAgICAgICAgICAgIGxpe1xyXG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuNSk7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICBzcGFue1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMCU7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDkwMDtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAjYXJjaGl2ZWR7XHJcbiAgICAgICAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC41KTtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNwYW57XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA5MDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG59Il19 */"

/***/ }),

/***/ "./src/app/admin/monitor/monitor.component.ts":
/*!****************************************************!*\
  !*** ./src/app/admin/monitor/monitor.component.ts ***!
  \****************************************************/
/*! exports provided: MonitorComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MonitorComponent", function() { return MonitorComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_stats_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/stats.service */ "./src/app/services/stats.service.ts");



var MonitorComponent = /** @class */ (function () {
    function MonitorComponent(statsService) {
        this.statsService = statsService;
    }
    MonitorComponent.prototype.ngOnInit = function () {
        var _this = this;
        // monitor
        this.statsService.monitor().subscribe(function (data) {
            _this.fromAdm = data.fromAdm;
            _this.toLab = data.toLab;
            _this.fromLab = data.fromLab;
            _this.toXray = data.toXray;
            _this.fromXray = data.fromXray;
            _this.toPharmacy = data.toPharmacy;
            _this.archived = data.archived;
        }, function (error) { console.error("Error", error); });
    };
    MonitorComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-monitor',
            template: __webpack_require__(/*! ./monitor.component.html */ "./src/app/admin/monitor/monitor.component.html"),
            styles: [__webpack_require__(/*! ./monitor.component.scss */ "./src/app/admin/monitor/monitor.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_stats_service__WEBPACK_IMPORTED_MODULE_2__["StatsService"]])
    ], MonitorComponent);
    return MonitorComponent;
}());



/***/ }),

/***/ "./src/app/admin/register/register.component.html":
/*!********************************************************!*\
  !*** ./src/app/admin/register/register.component.html ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n<!--------------------------------------------------------------------------------------------------------------->\n  <section>\n\n    <ul class=\"breadcrumb\">\n      <li class=\"breadcrumb-item\"><a id=\"reg1\">Clinician Registration From</a></li>\n      <li class=\"breadcrumb-item\"><a id=\"reg2\">Admin Registration Form</a></li>\n    </ul>\n\n  </section>\n\n\n<!-------------- CLINICIAN REGISTRATION FORM ------------------------------------------------------------------------->\n\n    <form id=\"reg_cli_form\" class=\"form col-sm-12 col-md-6 mx-auto rounded \"\n    #reg_cli_form=\"ngForm\"\n    (submit)=\"registerClinician(); reg_cli_form.reset()\"\n    \n    >\n\n        <h1>Register Clinician</h1>\n        \n        <hr>\n        \n        \n\n        <input id=\"cliFirstname\" type=\"text\" class=\"form-control form-control-sm rounded\" [(ngModel)]=\"regCli.firstName\"\n        name=\"firstName\" #firstName=\"ngModel\"\n        [class.is-invalid]=\"firstName.invalid && firstName.touched\"  \n        placeholder=\"Firstname\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"firstName.valid || firstName.untouched\">FirstName is Required</small>\n        \n\n\n\n        <input id=\"cliSurname\" type=\"text\" class=\"form-control form-control-sm rounded\"\n         [(ngModel)]=\"regCli.surname\" name=\"surname\"\n         #surname=\"ngModel\"\n          [class.is-invalid]=\"surname.invalid && surname.touched\" \n         placeholder=\"Surname\" required>\n         <small class=\"text-danger ml-2\" [class.d-none]=\"surname.valid || surname.untouched\">Surname is Required</small>\n        \n        \n        <input id=\"cliLastname\" type=\"text\" class=\"form-control form-control-sm rounded\" \n        #lastName=\"ngModel\"\n          [class.is-invalid]=\"lastName.invalid && lastName.touched\"\n        [(ngModel)]=\"regCli.lastName\" name=\"lastName\" placeholder=\"Lastname\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"lastName.valid || lastName.untouched\">LastName is Required</small>\n\n        <br><br>\n\n\n\n        \n        \n        <input id=\"cliNationalId\" type=\"text\" class=\"form-control form-control-sm rounded\" \n        [(ngModel)]=\"regCli.nationalId\" name=\"nationalId\" \n        #nationalId=\"ngModel\"\n          [class.is-invalid]=\"nationalId.invalid && nationalId.touched\"\n        placeholder=\"National Id No.\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"nationalId.valid || nationalId.untouched\">National Id is Required</small>\n\n        <br><br>\n\n\n \n        <label class=\"text-info mt-2\">Gender</label> <br>\n        <label class=\"text-info\">Male</label>\n        <input id=\"cliMale\" type=\"radio\" [(ngModel)]=\"regCli.gender\" name=\"gender\" value=\"male\"  required> &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;\n        <label class=\"text-info\">Female</label>\n        <input id=\"cliFemale\" type=\"radio\" [(ngModel)]=\"regCli.gender\" name=\"gender\" value=\"female\" required> <br> <br>\n\n\n\n      \n\n       \n         \n\n\n        \n        <input id=\"cliphone\" type=\"tel\" class=\"form-control form-control-sm rounded\"\n         [(ngModel)]=\"regCli.phone\" name=\"phone\" \n         #phone=\"ngModel\"\n          [class.is-invalid]=\"phone.invalid && phone.touched\"\n         placeholder=\"phone\" required>\n         <small class=\"text-danger ml-2\" [class.d-none]=\"phone.valid || phone.untouched\">Phone is Required</small>\n\n         <br><br>\n\n\n\n\n\n\n        \n\n        <select id=\"cliSpecialize\" class=\"form-control form-control-sm rounded\" \n        [(ngModel)]=\"regCli.specialize\" name=\"specialize\"\n        #specialize=\"ngModel\"\n          [class.is-invalid]=\"specialize.invalid && specialize.touched\"\n         required>\n\n\n\n          <option value=\"\" disabled selected hidden >Select Specialization</option>\n          <option value=\"Records Tech\">Records Tech</option>\n          <option value=\"Clinical Officer\">Clinical Office</option>\n          <option value=\"Lab Tech\">Lab Tech</option>\n          <option value=\"Xray Tech\">Xray Tech</option>\n          <option value=\"Pharmacist Tech\">Pharmacist Tech</option>\n\n\n        </select>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"specialize.valid || specialize.untouched\">Specialization is Required</small>\n\n         <br><br>\n\n        \n        <input id=\"cliProfNo\" type=\"tel\" class=\"form-control form-control-sm rounded\" \n        [(ngModel)]=\"regCli.profNo\" name=\"profNo\" \n        #profNo=\"ngModel\"\n          [class.is-invalid]=\"profNo.invalid && profNo.touched\"\n        placeholder=\"Profession No\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"profNo.valid || profNo.untouched\">Profession Number is Required</small>\n\n        <br><br>\n\n        <hr>\n\n        \n        <input id=\"climail\" type=\"email\" class=\"form-control form-control-sm rounded\"\n         [(ngModel)]=\"regCli.mail\" name=\"mail\" \n         #mail=\"ngModel\"\n         pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$\"\n          [class.is-invalid]=\"mail.invalid && mail.touched\"\n         placeholder=\"Email\" required> \n        \n          <div *ngIf=\"mail.errors && (mail.invalid && mail.touched)\">\n              <small class=\"text-danger ml-2\" *ngIf=\"mail.errors.required\">Email is Required</small>\n              <small class=\"text-danger ml-2\" *ngIf=\"mail.errors.pattern\">Email should be in this format \"job@gmail.com\"</small>\n          </div>\n\n         <br><br>\n\n\n\n\n        \n\n\n        <input id=\"clipassword\" type=\"password\" class=\"form-control form-control-sm rounded\"\n         [(ngModel)]=\"regCli.password\" name=\"password\"\n         #password=\"ngModel\"\n         pattern=\"(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$\"\n          [class.is-invalid]=\"password.invalid && password.touched\"\n         placeholder=\"Password\" required>\n\n         <div *ngIf=\"password.errors && (password.invalid && password.touched)\">\n            <small class=\"text-danger ml-2\" *ngIf=\"password.errors.required\">Password is Required</small>\n            <small class=\"text-danger ml-2\" *ngIf=\"password.errors.pattern\">Password ( UpperCase, LowerCase, Number/SpecialChar and min of 8 Chars )</small>\n        </div>\n      \n\n         <br><br>\n\n\n\n\n\n\n\n        <button id=\"btn_cli\" type=\"submit\"  class=\"btn btn-success m-3\" [disabled]=\"!reg_cli_form.valid\" > Submit </button>\n        \n\n\n\n\n    </form>\n\n\n    <!------------ ADMIN REGISTRATION FORM -------------------------------------------------------------------------------->\n\n\n\n    <form id=\"reg_adm_form\" class=\"form col-sm-12 col-md-6 mx-auto rounded \"\n    #reg_adm_form=\"ngForm\"\n    (submit)=\"registerAdmin(); reg_adm_form.reset()\"\n    >\n\n        <h1>Register Admin</h1>\n        \n        <hr>\n        \n        \n        <input id=\"adminFirstname\" type=\"text\" class=\"form-control form-control-sm rounded\"\n        #adminFirstname=\"ngModel\"\n        [class.is-invalid]=\"adminFirstname.invalid && adminFirstname.touched\"\n        [(ngModel)]=\"regAdm.firstName\" name=\"firstName\" placeholder=\"Firstname\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"adminFirstname.valid || adminFirstname.untouched\">FirstName is Required</small>\n        \n\n\n        \n        <input id=\"adminSurname\" type=\"text\" class=\"form-control form-control-sm rounded\"\n        #adminSurname=\"ngModel\"\n        [class.is-invalid]=\"adminSurname.invalid && adminSurname.touched\"\n        [(ngModel)]=\"regAdm.surname\" name=\"surname\" placeholder=\"Surname\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"adminSurname.valid || adminSurname.untouched\">Surname is Required</small>\n        \n        \n        <input id=\"adminLastname\" type=\"text\" class=\"form-control form-control-sm rounded\"\n        #adminLastname=\"ngModel\"\n        [class.is-invalid]=\"adminLastname.invalid && adminLastname.touched\"\n        [(ngModel)]=\"regAdm.lastName\" name=\"lastName\" placeholder=\"Lastname\" required> \n        <small class=\"text-danger ml-2\" [class.d-none]=\"adminLastname.valid || adminLastname.untouched\">LastName is Required</small>\n        \n        <br><br>\n        \n      \n        <input id=\"admNationalId\" type=\"text\" class=\"form-control form-control-sm rounded\" \n        #admNationalId=\"ngModel\"\n        [class.is-invalid]=\"admNationalId.invalid && admNationalId.touched\"\n        [(ngModel)]=\"regAdm.nationalId\" name=\"nationalId\" placeholder=\"National Id No\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"admNationalId.valid || admNationalId.untouched\">National Id is Required</small>\n        \n        <br><br>\n\n\n\n        <label class=\"text-info mt-2\">Gender</label> <br>\n        <label class=\"text-info\">Male</label>\n        <input id=\"adminMale\" type=\"radio\" [(ngModel)]=\"regAdm.gender\" name=\"gender\" value=\"male\"  required> &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;\n        <label class=\"text-info\">Female</label>\n        <input id=\"adminFemale\" type=\"radio\" [(ngModel)]=\"regAdm.gender\" name=\"gender\" value=\"female\" required> <br> <br>\n        \n\n\n\n     \n        \n\n      \n        <input id=\"admphone\" type=\"tel\" class=\"form-control form-control-sm rounded\" \n        #admphone=\"ngModel\"\n        [class.is-invalid]=\"admphone.invalid && admphone.touched\"\n        [(ngModel)]=\"regAdm.phone\" name=\"phone\" placeholder=\"phone\" required> \n        <small class=\"text-danger ml-2\" [class.d-none]=\"admphone.valid || admphone.untouched\">Phone Number is Required</small>\n        \n        <br><br>\n\n\n\n\n   \n        <select id=\"admDept\" class=\"form-control form-control-sm rounded\" \n        #admDept=\"ngModel\"\n        [class.is-invalid]=\"admDept.invalid && admDept.touched\"\n        [(ngModel)]=\"regAdm.department\" name=\"department\" required>\n        \n          <option value=\"\" disabled selected hidden>Select Department.</option>\n          <option value=\"medical\">Medical</option>\n          <option value=\"administrative\">Administrative</option>\n        \n        </select>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"admDept.valid || admDept.untouched\">Department is Required</small>\n        \n        <br><br>\n\n\n\n\n\n     \n        <input id=\"admOfficeNo\" type=\"tel\" class=\"form-control form-control-sm rounded\"\n        #admOfficeNo=\"ngModel\"\n        [class.is-invalid]=\"admOfficeNo.invalid && admOfficeNo.touched\"\n        [(ngModel)]=\"regAdm.officeNo\" name=\"officeNo\" placeholder=\"Office Number\" required> \n        <small class=\"text-danger ml-2\" [class.d-none]=\"admOfficeNo.valid || admOfficeNo.untouched\">Office Number is Required</small>\n        \n        <br><br>\n\n\n\n\n        <hr>\n\n     \n\n        <input id=\"admmail\" type=\"email\" class=\"form-control form-control-sm rounded\" \n        #admmail=\"ngModel\"\n        pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$\"\n        [class.is-invalid]=\"admmail.invalid && admmail.touched\"\n        [(ngModel)]=\"regAdm.mail\" name=\"mail\" placeholder=\"Email\" required> \n        <div *ngIf=\"admmail.errors && (admmail.invalid && admmail.touched)\">\n            <small class=\"text-danger ml-2\" *ngIf=\"admmail.errors.required\">Email is Required</small>\n            <small class=\"text-danger ml-2\" *ngIf=\"admmail.errors.pattern\">Email should be in this format \"job@gmail.com\"</small>\n        </div>\n        <br><br>\n\n\n\n     \n        <input id=\"admpassword\" type=\"password\" class=\"form-control form-control-sm rounded\" \n        #admpassword=\"ngModel\"\n        pattern=\"(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$\"\n        [class.is-invalid]=\"admpassword.invalid && admpassword.touched\"\n        [(ngModel)]=\"regAdm.password\" name=\"password\" placeholder=\"Password\" required>\n\n        <div *ngIf=\"admpassword.errors && (admpassword.invalid && admpassword.touched)\">\n            <small class=\"text-danger ml-2\" *ngIf=\"admpassword.errors.required\">Password is Required</small>\n            <small class=\"text-danger ml-2\" *ngIf=\"admpassword.errors.pattern\">Password ( UpperCase, LowerCase, Number/SpecialChar and min of 8 Chars )</small>\n        </div>\n\n\n        <br><br>\n\n        <button id=\"btn_admin\" type=\"submit\" [disabled]=\"!reg_adm_form.valid\" class=\"btn btn-success m-3\"  > Submit </button>\n        \n\n    </form>\n\n\n  \n\n</div>"

/***/ }),

/***/ "./src/app/admin/register/register.component.scss":
/*!********************************************************!*\
  !*** ./src/app/admin/register/register.component.scss ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\nsection .breadcrumb {\n  align-content: center; }\nsection .breadcrumb li {\n    color: #2c9cdd;\n    cursor: pointer; }\nsection .breadcrumb li:hover {\n    font-size: 15px;\n    font-weight: bolder; }\nform {\n  background-color: #4a5d68;\n  padding: 1em 2em 0 2em;\n  margin: 1em 0 0 0;\n  height: 0%;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\nform h1 {\n    font-size: 20px;\n    font-weight: bold;\n    color: #e8491d;\n    text-shadow: 5px 5px 3px black; }\nform h4 {\n    font-size: 12px;\n    font-weight: bold; }\nform input, form select {\n    border: none;\n    border-bottom: solid #e8491d 2px;\n    margin: 1em 0 0 0;\n    background-color: #4a5d68;\n    color: #17a2b8; }\nform small {\n    font-size: 12px; }\nform input::-webkit-input-placeholder {\n    color: #6c757d; }\nform input::-ms-input-placeholder {\n    color: #6c757d; }\nform input::placeholder {\n    color: #6c757d; }\nform input::after {\n    border-bottom: solid #17a2b8 2px; }\nform input[type=text], form input[type=email], form input[type=tel], form input[type=password], form select {\n    width: 15em; }\nform select:required:invalid {\n    color: #6c757d; }\nform option[value=\"\"][disabled] {\n    display: none; }\nform option {\n    color: black; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWRtaW4vcmVnaXN0ZXIvQzpcXFRoZUNvZGVcXG1lYW5BcHBSYXdcXGtpbXNhcHAvc3JjXFxhcHBcXGFkbWluXFxyZWdpc3RlclxccmVnaXN0ZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkRBQUE7QUFDQSxzRUFBQTtBQThDQTtFQUdRLHFCQUFxQixFQUFBO0FBSDdCO0lBTVksY0FBd0I7SUFDeEIsZUFBZSxFQUFBO0FBUDNCO0lBVVksZUFBZTtJQUNmLG1CQUFtQixFQUFBO0FBSy9CO0VBQ0kseUJBckQyQjtFQXNEM0Isc0JBQXNCO0VBQ3RCLGlCQUFpQjtFQUNqQixVQUFVO0VBQ1YsMENBQXlDLEVBQUE7QUFMN0M7SUFRUSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLGNBcEVhO0lBcUViLDhCQUF5QyxFQUFBO0FBWGpEO0lBY1EsZUFBZTtJQUNmLGlCQUFpQixFQUFBO0FBZnpCO0lBbUJRLFlBQVk7SUFDWixnQ0FBd0M7SUFDeEMsaUJBQWlCO0lBQ2pCLHlCQTFFdUI7SUEyRXZCLGNBcEVTLEVBQUE7QUE2Q2pCO0lBNEJRLGVBQWUsRUFBQTtBQTVCdkI7SUErQlEsY0E5RWMsRUFBQTtBQStDdEI7SUErQlEsY0E5RWMsRUFBQTtBQStDdEI7SUErQlEsY0E5RWMsRUFBQTtBQStDdEI7SUFrQ1EsZ0NBQW9DLEVBQUE7QUFsQzVDO0lBcUNRLFdBQVcsRUFBQTtBQXJDbkI7SUF3Q1EsY0F6RlMsRUFBQTtBQWlEakI7SUEyQ1EsYUFBYSxFQUFBO0FBM0NyQjtJQThDUSxZQUFZLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9hZG1pbi9yZWdpc3Rlci9yZWdpc3Rlci5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLSBHbG9iYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKiBCcmVha3BvaW50czogeHM6IDAsICBzbTogNTc2cHg7IG1kOiA3NjhweDsgbGc6IDk5MnB4OyB4bDogMTIwMHB4OyAqL1xyXG5cclxuJGNvbG9yczogKFxyXG4gICAgYmc6ICNjMGMwYzAsXHJcbiAgICBmZXZvcml0ZTogI2U4NDkxZCxcclxuICAgIHByaW1hcnk6ICMwMDdiZmYsXHJcbiAgICBwcmltYXJ5LWxpZ2h0OiBsaWdodGVuKCMwMDVERkYsIDQwJSksXHJcbiAgICBwcmltYXJ5LWRhcms6IGRhcmtlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgYWNjZW50OiAjRkZGNkJCLFxyXG4gICAgZ2lybGlzaDogcmdiKDE5NSwgMTUsIDIwMSksXHJcbiAgICBmb3JtOiBsaWdodGVuKCMzNTQyNGEsIDEwJSksXHJcbiAgICBpbnB1dDogbGlnaHRlbigjMzU0MjRhLCA0MCUpLFxyXG4gICAgYnJlYWQ6IGxpZ2h0ZW4oIzM1NDI0YSwgNDAlKSxcclxuICAgIGdyYXk6ICM2Yzc1N2QsXHJcbiAgICBncmF5LWRhcms6ICMzNDNhNDAsXHJcbiAgICBzZWNvbmRhcnk6ICM2Yzc1N2QsXHJcbiAgICBzdWNjZXNzOiAjMjhhNzQ1LFxyXG4gICAgaW5mbzogIzE3YTJiOCxcclxuICAgIHdhcm5pbmc6ICNmZmMxMDcsXHJcbiAgICBkYW5nZXI6ICNkYzM1NDUsXHJcbiAgICBsaWdodDogI2Y4ZjlmYSxcclxuICAgIGRhcms6ICMzNDNhNDBcclxuXHJcbik7XHJcblxyXG5AZnVuY3Rpb24gY29sb3IoJGNvbG9yLW5hbWUpe1xyXG4gICAgQHJldHVybiBtYXAtZ2V0KCRjb2xvcnMgLCAkY29sb3ItbmFtZSlcclxufVxyXG5cclxuXHJcbiRkZXNrdG9wOiA3NjhweDtcclxuJGRlc2t0b3Bfc206IDM2NHB4O1xyXG4kb3BhY2l0eTogLjk7XHJcblxyXG5AbWl4aW4gZGVza3RvcF9zbSB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcF9zbX0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcbkBtaXhpbiBkZXNrdG9wIHtcclxuICAgIEBtZWRpYSAobWluLXdpZHRoOiAjeyRkZXNrdG9wfSkge1xyXG4gICAgICAgIEBjb250ZW50O1xyXG4gICAgfSBcclxufVxyXG5cclxuc2VjdGlvbntcclxuICAgIFxyXG4gICAgLmJyZWFkY3J1bWJ7XHJcbiAgICAgICAgYWxpZ24tY29udGVudDogY2VudGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxpe1xyXG4gICAgICAgICAgICBjb2xvcjogcmdiKDQ0LCAxNTYsIDIyMSk7XHJcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGk6aG92ZXJ7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTVweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGRlcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmZvcm17XHJcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcihmb3JtKTtcclxuICAgIHBhZGRpbmc6IDFlbSAyZW0gMCAyZW07XHJcbiAgICBtYXJnaW46IDFlbSAwIDAgMDtcclxuICAgIGhlaWdodDogMCU7XHJcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgIFxyXG4gICAgaDF7XHJcbiAgICAgICAgZm9udC1zaXplOiAyMHB4O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgMSk7XHJcbiAgICB9XHJcbiAgICBoNHtcclxuICAgICAgICBmb250LXNpemU6IDEycHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgaW5wdXQsIHNlbGVjdHtcclxuICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgYm9yZGVyLWJvdHRvbTogc29saWQgY29sb3IoZmV2b3JpdGUpIDJweDtcclxuICAgICAgICBtYXJnaW46IDFlbSAwIDAgMDsgXHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZm9ybSk7XHJcbiAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG5cclxuICAgICAgICBcclxuICAgIH1cclxuICAgIHNtYWxse1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgIH1cclxuICAgIGlucHV0OjpwbGFjZWhvbGRlcntcclxuICAgICAgICBjb2xvcjogY29sb3Ioc2Vjb25kYXJ5KTtcclxuICAgIH1cclxuICAgIGlucHV0OjphZnRlcntcclxuICAgICAgICBib3JkZXItYm90dG9tOiBzb2xpZCBjb2xvcihpbmZvKSAycHhcclxuICAgIH1cclxuICAgIGlucHV0W3R5cGU9dGV4dF0sIGlucHV0W3R5cGU9ZW1haWxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9cGFzc3dvcmRdLCBzZWxlY3R7XHJcbiAgICAgICAgd2lkdGg6IDE1ZW07XHJcbiAgICB9XHJcbiAgICBzZWxlY3Q6cmVxdWlyZWQ6aW52YWxpZCB7XHJcbiAgICAgICAgY29sb3I6IGNvbG9yKGdyYXkpO1xyXG4gICAgfVxyXG4gICAgb3B0aW9uW3ZhbHVlPVwiXCJdW2Rpc2FibGVkXXtcclxuICAgICAgICBkaXNwbGF5OiBub25lO1xyXG4gICAgfVxyXG4gICAgb3B0aW9uIHtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICB9XHJcblxyXG5cclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/admin/register/register.component.ts":
/*!******************************************************!*\
  !*** ./src/app/admin/register/register.component.ts ***!
  \******************************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_users_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/users.service */ "./src/app/services/users.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var RegisterComponent = /** @class */ (function () {
    //--------------------------------------------  
    function RegisterComponent(usersService, notifyService) {
        this.usersService = usersService;
        this.notifyService = notifyService;
    }
    //-------------------------------------------- 
    RegisterComponent.prototype.ngOnInit = function () {
        this.regCli = {
            firstName: "", surname: "", lastName: "", nationalId: "", gender: "",
            phone: "", specialize: "", profNo: "", mail: "", password: ""
        };
        this.regAdm = {
            firstName: "", surname: "", lastName: "", nationalId: "", gender: "",
            phone: "", department: "", officeNo: "", mail: "", password: ""
        };
    };
    //------------ Clinician Registration ---------------------- 
    RegisterComponent.prototype.registerClinician = function () {
        var _this = this;
        this.usersService.regClinician(this.regCli).subscribe(function (data) { _this.notifyService.showSuccess("Clinician User Added", "Successfull !!"); }, function (error) {
            _this.notifyService.showError(error.error, "Failed !!");
            console.error("Error", error);
        });
    };
    ;
    //------------ Admin Registration ---------------------- 
    RegisterComponent.prototype.registerAdmin = function () {
        var _this = this;
        this.usersService.regAdmin(this.regAdm).subscribe(function (data) { _this.notifyService.showSuccess("Admin User Added", "Successfull !!"); }, function (error) {
            _this.notifyService.showError(error.error, "Failed !!");
            console.error("Error", error);
        });
    };
    ;
    RegisterComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-register',
            template: __webpack_require__(/*! ./register.component.html */ "./src/app/admin/register/register.component.html"),
            styles: [__webpack_require__(/*! ./register.component.scss */ "./src/app/admin/register/register.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_users_service__WEBPACK_IMPORTED_MODULE_2__["UsersService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], RegisterComponent);
    return RegisterComponent;
}());



/***/ }),

/***/ "./src/app/admin/userdb/userdb.component.html":
/*!****************************************************!*\
  !*** ./src/app/admin/userdb/userdb.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container-fluid\">\n\n    <div class=\"card-group\">\n  \n      <form id=\"userdb_form\" class=\"form mx-auto rounded\">\n      \n        <h1>Clinicians Database</h1>\n        <h4><strong>Click to see Profile :</strong></h4>\n        <hr>\n        <ul class=\"list-group\">\n\n          <li id=\"total\" class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Total<span class=\"badge\">{{clinician}}</span></li>\n    \n      </ul>\n      <hr>\n      <ol >\n\n          <li *ngFor=\"let clinicianprofile of clinicianprofiles\" (click)=\"openclinicianprofile(clinicianprofile.userNo)\">\n              \n              {{clinicianprofile.firstName}} {{clinicianprofile.surname}} {{clinicianprofile.lastName}} : {{clinicianprofile.userNo}}\n\n          </li>\n          \n      </ol>    \n    <hr>  \n      \n      </form>\n  <!---------------------------------------------------------------------------------------->\n\n  <!--------------------------------------------------------------------------------------->\n      <form id=\"cliProfile_form\" class=\"form mx-auto rounded\" [hidden]=\"hideformclinician\">\n      \n          <h4><strong>Clinician Profile</strong></h4>\n          <hr>\n          <ul class=\"list-group\">\n\n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Full Name :<span class=\"badge\">{{name}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">User ID :<span class=\"badge\">{{userNo}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">National ID :<span class=\"badge\">{{nationalId}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">gender :<span class=\"badge\">{{gender}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Tel :<span class=\"badge\">{{phone}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Specialization :<span class=\"badge\">{{specialize}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Profession No :<span class=\"badge\">{{profNo}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Email :<span class=\"badge\">{{mail}}</span></li>\n        \n        \n        </ul>\n\n            <button class=\"btn btn-sm btn-danger m-3\" (click)=\"deleteUSERCLI()\"> Delete </button>\n        \n        </form>\n<!-------------------------------------------------------------------------------->\n\n        <form id=\"admProfile_form\" class=\"form mx-auto rounded\" [hidden]=\"hideformadmin\">\n      \n          <h4><strong>Admin Profile</strong></h4>\n          <hr>\n          <ul class=\"list-group\">\n\n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Full Name :<span class=\"badge\">{{name}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">User ID :<span class=\"badge\">{{userNo}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">National ID :<span class=\"badge\">{{nationalId}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">gender :<span class=\"badge\">{{gender}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Tel :<span class=\"badge\">{{phone}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Department :<span class=\"badge\">{{department}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Office No :<span class=\"badge\">{{officeNo}}</span></li>\n        \n            <li class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Email :<span class=\"badge\">{{mail}}</span></li>\n        \n        </ul>\n\n            <button class=\"btn btn-sm btn-danger m-3\" (click)=\"deleteUSERADM()\"> Delete </button>\n        \n        </form>\n<!------------------------------------------------------------------------------------------->\n        <form id=\"userdb_form\" class=\"form mx-auto rounded\">\n      \n          <h1>Admin Database</h1>\n          <h4><strong>Click to see Profile :</strong></h4>\n          <hr>\n          <ul class=\"list-group\">\n  \n            <li id=\"total\" class=\"list-group-item bg-transparent d-flex justify-content-between align-items-center\">Total<span class=\"badge\">{{admin}}</span></li>\n      \n        </ul>\n        <hr>\n        <ol >\n  \n            <li *ngFor=\"let adminprofile of adminprofiles\" (click)=\"openadminprofile(adminprofile.userNo)\">\n                \n              {{adminprofile.firstName}} {{adminprofile.surname}} {{adminprofile.lastName}} : {{adminprofile.userNo}}\n  \n            </li>\n            \n        </ol>    \n      <hr>  \n        \n        </form>\n    \n      \n      </div>\n  \n    </div>"

/***/ }),

/***/ "./src/app/admin/userdb/userdb.component.scss":
/*!****************************************************!*\
  !*** ./src/app/admin/userdb/userdb.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\nform {\n  background-color: #4a5d68;\n  padding: 1em 2em 0 2em;\n  margin: 1em 0 0 0;\n  height: 0%;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);\n  width: 25em; }\n@media (min-width: 364px) {\n    form {\n      width: 90%; } }\n@media (min-width: 768px) {\n    form {\n      width: 60%; } }\n@media (min-width: 992px) {\n    form {\n      width: 25%; } }\nform h1 {\n    font-size: 20px;\n    font-weight: bold;\n    color: #e8491d;\n    text-shadow: 5px 5px 3px black; }\nform h4 {\n    font-size: 12px;\n    font-weight: bold;\n    margin: 1em 0 0 2em; }\nform ul li {\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n    font-weight: bold;\n    color: #17a2b8; }\nform ul li span {\n      background-color: #e8491d;\n      font-weight: 900;\n      color: black; }\nform ol {\n    list-style-type: none;\n    padding-left: 0; }\nform ol li {\n      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n      color: #17a2b8;\n      margin: 0 0 0 0;\n      padding: 0 1em 0 1em;\n      height: 2em;\n      display: flex;\n      flex-direction: row;\n      align-items: flex-end; }\nform ol li:hover {\n      cursor: pointer;\n      color: #ffc107;\n      font-weight: bold;\n      height: 3em; }\n#total span {\n  background-color: #17a2b8; }\n#cliProfile_form, #admProfile_form {\n  text-align: center;\n  width: 25em; }\n@media (min-width: 364px) {\n    #cliProfile_form, #admProfile_form {\n      width: 100%; } }\n@media (min-width: 768px) {\n    #cliProfile_form, #admProfile_form {\n      width: 60%;\n      float: center; } }\n@media (min-width: 992px) {\n    #cliProfile_form, #admProfile_form {\n      width: 40%; } }\n#cliProfile_form h4, #admProfile_form h4 {\n    font-size: 15px;\n    font-weight: bold;\n    color: #17a2b8;\n    text-shadow: 5px 5px 3px black; }\n#cliProfile_form ul li, #admProfile_form ul li {\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n    color: #17a2b8; }\n#cliProfile_form ul li span, #admProfile_form ul li span {\n      font-weight: 700;\n      font-size: 13px;\n      background-color: transparent;\n      color: #17a2b8; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvYWRtaW4vdXNlcmRiL0M6XFxUaGVDb2RlXFxtZWFuQXBwUmF3XFxraW1zYXBwL3NyY1xcYXBwXFxhZG1pblxcdXNlcmRiXFx1c2VyZGIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsMkRBQUE7QUFDQSxzRUFBQTtBQW1EQTtFQUNRLHlCQTFDdUI7RUEyQ3ZCLHNCQUFzQjtFQUN0QixpQkFBaUI7RUFDakIsVUFBVTtFQUNWLDBDQUF5QztFQUN6QyxXQUFXLEVBQUE7QUF4QmY7SUFrQko7TUFVWSxVQUFVLEVBQUEsRUEyRHJCO0FBakZHO0lBWUo7TUFjWSxVQUFVLEVBQUEsRUF1RHJCO0FBM0VHO0lBTUo7TUFrQlksVUFBVSxFQUFBLEVBbURyQjtBQXJFRDtJQXNCWSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLGNBdkVTO0lBd0VULDhCQUF5QyxFQUFBO0FBekJyRDtJQTRCWSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLG1CQUFtQixFQUFBO0FBOUIvQjtJQW1DZ0IsMENBQXlDO0lBQ3pDLGlCQUFpQjtJQUNqQixjQXpFQyxFQUFBO0FBb0NqQjtNQXdDb0IseUJBdkZDO01Bd0ZELGdCQUFnQjtNQUNoQixZQUFZLEVBQUE7QUExQ2hDO0lBK0NZLHFCQUFxQjtJQUNyQixlQUFlLEVBQUE7QUFoRDNCO01BbURnQiwwQ0FBeUM7TUFDekMsY0F4RkM7TUF5RkQsZUFBZTtNQUNmLG9CQUFvQjtNQUNwQixXQUFXO01BQ1gsYUFBYTtNQUNiLG1CQUFtQjtNQUNuQixxQkFBcUIsRUFBQTtBQTFEckM7TUE2RGdCLGVBQWU7TUFDZixjQWpHSTtNQWtHSixpQkFBaUI7TUFDakIsV0FBVyxFQUFBO0FBTTNCO0VBRVEseUJBNUdTLEVBQUE7QUFnSGpCO0VBQ1Esa0JBQWtCO0VBQ2xCLFdBQVcsRUFBQTtBQWhHZjtJQThGSjtNQUtZLFdBQVcsRUFBQSxFQWtDbEI7QUEvSEQ7SUF3Rko7TUFTWSxVQUFVO01BQ1YsYUFBYSxFQUFBLEVBNkJwQjtBQXpIRDtJQWtGSjtNQWNZLFVBQVUsRUFBQSxFQXlCakI7QUF2Q0w7SUFrQlksZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixjQXBJSztJQXFJTCw4QkFBeUMsRUFBQTtBQXJCckQ7SUEyQmdCLDBDQUF5QztJQUN6QyxjQTVJQyxFQUFBO0FBZ0hqQjtNQThCb0IsZ0JBQWdCO01BQ2hCLGVBQWU7TUFDZiw2QkFBNkI7TUFDN0IsY0FqSkgsRUFBQSIsImZpbGUiOiJzcmMvYXBwL2FkbWluL3VzZXJkYi91c2VyZGIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0gR2xvYmFsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLyogQnJlYWtwb2ludHM6IHhzOiAwLCAgc206IDU3NnB4OyBtZDogNzY4cHg7IGxnOiA5OTJweDsgeGw6IDEyMDBweDsgKi9cclxuXHJcbiRjb2xvcnM6IChcclxuICAgIGJnOiAjYzBjMGMwLFxyXG4gICAgZmV2b3JpdGU6ICNlODQ5MWQsXHJcbiAgICBwcmltYXJ5OiAjMDA3YmZmLFxyXG4gICAgcHJpbWFyeS1saWdodDogbGlnaHRlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgcHJpbWFyeS1kYXJrOiBkYXJrZW4oIzAwNURGRiwgNDAlKSxcclxuICAgIGFjY2VudDogI0ZGRjZCQixcclxuICAgIGdpcmxpc2g6IHJnYigxOTUsIDE1LCAyMDEpLFxyXG4gICAgZm9ybTogbGlnaHRlbigjMzU0MjRhLCAxMCUpLFxyXG4gICAgZ3JheTogIzZjNzU3ZCxcclxuICAgIGdyYXktZGFyazogIzM0M2E0MCxcclxuICAgIHNlY29uZGFyeTogIzZjNzU3ZCxcclxuICAgIHN1Y2Nlc3M6ICMyOGE3NDUsXHJcbiAgICBpbmZvOiAjMTdhMmI4LFxyXG4gICAgd2FybmluZzogI2ZmYzEwNyxcclxuICAgIGRhbmdlcjogI2RjMzU0NSxcclxuICAgIGxpZ2h0OiAjZjhmOWZhLFxyXG4gICAgZGFyazogIzM0M2E0MFxyXG5cclxuKTtcclxuXHJcbkBmdW5jdGlvbiBjb2xvcigkY29sb3ItbmFtZSl7XHJcbiAgICBAcmV0dXJuIG1hcC1nZXQoJGNvbG9ycyAsICRjb2xvci1uYW1lKVxyXG59XHJcblxyXG4kZGVza3RvcF9sZzogOTkycHg7IFxyXG4kZGVza3RvcDogNzY4cHg7XHJcbiRkZXNrdG9wX3NtOiAzNjRweDtcclxuJG9wYWNpdHk6IC45O1xyXG5cclxuQG1peGluIGRlc2t0b3Bfc20ge1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3Bfc219KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5AbWl4aW4gZGVza3RvcCB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcH0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcbkBtaXhpbiBkZXNrdG9wX2xnIHtcclxuICAgIEBtZWRpYSAobWluLXdpZHRoOiAjeyRkZXNrdG9wX2xnfSkge1xyXG4gICAgICAgIEBjb250ZW50O1xyXG4gICAgfSBcclxufVxyXG5cclxuXHJcbmZvcm17XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZm9ybSk7XHJcbiAgICAgICAgcGFkZGluZzogMWVtIDJlbSAwIDJlbTtcclxuICAgICAgICBtYXJnaW46IDFlbSAwIDAgMDtcclxuICAgICAgICBoZWlnaHQ6IDAlO1xyXG4gICAgICAgIGJveC1zaGFkb3c6IDAgMTBweCAzMHB4IHJnYmEoMCwgMCwgMCwgLjMpO1xyXG4gICAgICAgIHdpZHRoOiAyNWVtO1xyXG5cclxuXHJcbiAgICAgICAgQGluY2x1ZGUgZGVza3RvcF9zbXtcclxuICAgICAgICAgICAgd2lkdGg6IDkwJTsgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBAaW5jbHVkZSBkZXNrdG9we1xyXG4gICAgICAgICAgICB3aWR0aDogNjAlOyAgICBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBpbmNsdWRlIGRlc2t0b3BfbGd7XHJcbiAgICAgICAgICAgIHdpZHRoOiAyNSU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIGgxe1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICBjb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgICAgICB0ZXh0LXNoYWRvdzogNXB4IDVweCAzcHggcmdiYSgwLCAwLCAwLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaDR7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMWVtIDAgMCAyZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHVse1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbGl7XHJcbiAgICAgICAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC41KTtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNwYW57XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiA5MDA7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9se1xyXG4gICAgICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XHJcbiAgICAgICAgICAgIHBhZGRpbmctbGVmdDogMDtcclxuXHJcbiAgICAgICAgICAgIGxpe1xyXG4gICAgICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuNSk7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDAgMCAwIDA7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwIDFlbSAwIDFlbTtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogMmVtO1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGk6aG92ZXJ7XHJcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3Iod2FybmluZyk7XHJcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICAgICAgICAgIGhlaWdodDogM2VtO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgIFxyXG59XHJcbiN0b3RhbHtcclxuICAgIHNwYW57XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiNjbGlQcm9maWxlX2Zvcm0sICNhZG1Qcm9maWxlX2Zvcm0ge1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICB3aWR0aDogMjVlbTtcclxuXHJcbiAgICAgICAgQGluY2x1ZGUgZGVza3RvcF9zbXtcclxuICAgICAgICAgICAgd2lkdGg6IDEwMCU7ICAgIFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgQGluY2x1ZGUgZGVza3RvcHtcclxuICAgICAgICAgICAgd2lkdGg6IDYwJTtcclxuICAgICAgICAgICAgZmxvYXQ6IGNlbnRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIEBpbmNsdWRlIGRlc2t0b3BfbGd7XHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBoNHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICB0ZXh0LXNoYWRvdzogNXB4IDVweCAzcHggcmdiYSgwLCAwLCAwLCAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHVse1xyXG5cclxuICAgICAgICAgICAgbGl7XHJcbiAgICAgICAgICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC41KTtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcihpbmZvKTtcclxuICAgICAgICAgICAgICAgIHNwYW57ICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDtcclxuICAgICAgICAgICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9Il19 */"

/***/ }),

/***/ "./src/app/admin/userdb/userdb.component.ts":
/*!**************************************************!*\
  !*** ./src/app/admin/userdb/userdb.component.ts ***!
  \**************************************************/
/*! exports provided: UserdbComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UserdbComponent", function() { return UserdbComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_stats_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/stats.service */ "./src/app/services/stats.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var UserdbComponent = /** @class */ (function () {
    function UserdbComponent(statsService, notifyService) {
        this.statsService = statsService;
        this.notifyService = notifyService;
        this.hideformclinician = true;
        this.hideformadmin = true;
    }
    UserdbComponent.prototype.ngOnInit = function () {
        var _this = this;
        // on reload
        this.statsService.onreloadUSER().subscribe(
        //do nothing
        );
        // User db
        this.statsService.userDb().subscribe(function (data) {
            _this.clinician = data.clinician;
            _this.clinicianprofiles = data.clinicianprofiles;
            _this.admin = data.admin;
            _this.adminprofiles = data.adminprofiles;
        }, function (error) { console.error("Error", error); });
    };
    // open Clinician Profile
    UserdbComponent.prototype.openclinicianprofile = function (id) {
        var _this = this;
        var userNo = { userNo: id };
        this.statsService.openuserclinician(userNo).subscribe(function (data) {
            _this.name = data[0].name;
            _this.userNo = data[0].userNo;
            _this.nationalId = data[0].nationalId;
            _this.gender = data[0].gender;
            _this.phone = data[0].phone;
            _this.specialize = data[0].specialize;
            _this.profNo = data[0].profNo;
            _this.mail = data[0].mail;
            _this.hideformclinician = false;
            _this.hideformadmin = true;
        }, function (error) { console.error("Error", error); });
    };
    ;
    // open file
    UserdbComponent.prototype.openadminprofile = function (id) {
        var _this = this;
        var userNo = { userNo: id };
        this.statsService.openuseradmin(userNo).subscribe(function (data) {
            _this.name = data[0].name;
            _this.userNo = data[0].userNo;
            _this.nationalId = data[0].nationalId;
            _this.gender = data[0].gender;
            _this.phone = data[0].phone;
            _this.department = data[0].department;
            _this.officeNo = data[0].officeNo;
            _this.mail = data[0].mail;
            _this.hideformclinician = true;
            _this.hideformadmin = false;
        }, function (error) { console.error("Error", error); });
    };
    ;
    // delete clinician
    UserdbComponent.prototype.deleteUSERCLI = function () {
        var _this = this;
        this.statsService.deleteUSERCLI().subscribe(function (data) {
            _this.notifyService.showSuccess("User deleted!", "Success");
            _this.hideformclinician = true;
            _this.hideformadmin = true;
        }, function (error) { console.error("Error", error); });
    };
    ;
    // delete Admin
    UserdbComponent.prototype.deleteUSERADM = function () {
        var _this = this;
        this.statsService.deleteUSERADM().subscribe(function (data) {
            _this.notifyService.showSuccess("User deleted!", "Success");
            setTimeout(function () {
                location.reload();
            }, 2000);
        }, function (error) { console.error("Error", error); });
    };
    ;
    UserdbComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-userdb',
            template: __webpack_require__(/*! ./userdb.component.html */ "./src/app/admin/userdb/userdb.component.html"),
            styles: [__webpack_require__(/*! ./userdb.component.scss */ "./src/app/admin/userdb/userdb.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_stats_service__WEBPACK_IMPORTED_MODULE_2__["StatsService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], UserdbComponent);
    return UserdbComponent;
}());



/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./clinician/clinician.component */ "./src/app/clinician/clinician.component.ts");
/* harmony import */ var _admin_admin_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./admin/admin.component */ "./src/app/admin/admin.component.ts");
/* harmony import */ var _clinician_chome_chome_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./clinician/chome/chome.component */ "./src/app/clinician/chome/chome.component.ts");
/* harmony import */ var _clinician_admission_admission_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./clinician/admission/admission.component */ "./src/app/clinician/admission/admission.component.ts");
/* harmony import */ var _clinician_examination_examination_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./clinician/examination/examination.component */ "./src/app/clinician/examination/examination.component.ts");
/* harmony import */ var _clinician_laboratory_laboratory_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./clinician/laboratory/laboratory.component */ "./src/app/clinician/laboratory/laboratory.component.ts");
/* harmony import */ var _clinician_xray_xray_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./clinician/xray/xray.component */ "./src/app/clinician/xray/xray.component.ts");
/* harmony import */ var _clinician_pharmacy_pharmacy_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./clinician/pharmacy/pharmacy.component */ "./src/app/clinician/pharmacy/pharmacy.component.ts");
/* harmony import */ var _admin_ahome_ahome_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./admin/ahome/ahome.component */ "./src/app/admin/ahome/ahome.component.ts");
/* harmony import */ var _admin_monitor_monitor_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./admin/monitor/monitor.component */ "./src/app/admin/monitor/monitor.component.ts");
/* harmony import */ var _admin_filedb_filedb_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./admin/filedb/filedb.component */ "./src/app/admin/filedb/filedb.component.ts");
/* harmony import */ var _admin_userdb_userdb_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./admin/userdb/userdb.component */ "./src/app/admin/userdb/userdb.component.ts");
/* harmony import */ var _admin_register_register_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./admin/register/register.component */ "./src/app/admin/register/register.component.ts");
/* harmony import */ var _auth_clinician_guard__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./auth/clinician.guard */ "./src/app/auth/clinician.guard.ts");
/* harmony import */ var _auth_admin_guard__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./auth/admin.guard */ "./src/app/auth/admin.guard.ts");



















var routes = [
    /*--------- Login Route ------------*/
    { path: "kimsapp", redirectTo: "kimsapp/login", pathMatch: "full" },
    { path: "", redirectTo: "kimsapp/login", pathMatch: "full" },
    { path: "kimsapp/login", component: _login_login_component__WEBPACK_IMPORTED_MODULE_3__["LoginComponent"] },
    /*================ Clinical Component ============*/
    /*--------------- Home Clinician ---------------*/
    { path: "kimsapp/clinician", component: _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_4__["ClinicianComponent"], canActivate: [_auth_clinician_guard__WEBPACK_IMPORTED_MODULE_17__["ClinicianGuard"]],
        children: [{ path: "", component: _clinician_chome_chome_component__WEBPACK_IMPORTED_MODULE_6__["ChomeComponent"] }]
    },
    /*--------------- Admission ---------------*/
    { path: "kimsapp/clinician/admission", component: _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_4__["ClinicianComponent"], canActivate: [_auth_clinician_guard__WEBPACK_IMPORTED_MODULE_17__["ClinicianGuard"]],
        children: [{ path: "", component: _clinician_admission_admission_component__WEBPACK_IMPORTED_MODULE_7__["AdmissionComponent"] }]
    },
    /*--------------- Examination ---------------*/
    { path: "kimsapp/clinician/examination", component: _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_4__["ClinicianComponent"], canActivate: [_auth_clinician_guard__WEBPACK_IMPORTED_MODULE_17__["ClinicianGuard"]],
        children: [{ path: "", component: _clinician_examination_examination_component__WEBPACK_IMPORTED_MODULE_8__["ExaminationComponent"] }]
    },
    /*--------------- Laboratory ---------------*/
    { path: "kimsapp/clinician/lab", component: _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_4__["ClinicianComponent"], canActivate: [_auth_clinician_guard__WEBPACK_IMPORTED_MODULE_17__["ClinicianGuard"]],
        children: [{ path: "", component: _clinician_laboratory_laboratory_component__WEBPACK_IMPORTED_MODULE_9__["LaboratoryComponent"] }]
    },
    /*--------------- Xray ---------------*/
    { path: "kimsapp/clinician/xray", component: _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_4__["ClinicianComponent"], canActivate: [_auth_clinician_guard__WEBPACK_IMPORTED_MODULE_17__["ClinicianGuard"]],
        children: [{ path: "", component: _clinician_xray_xray_component__WEBPACK_IMPORTED_MODULE_10__["XrayComponent"] }]
    },
    /*--------------- Pharmacy ---------------*/
    { path: "kimsapp/clinician/pharmacy", component: _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_4__["ClinicianComponent"], canActivate: [_auth_clinician_guard__WEBPACK_IMPORTED_MODULE_17__["ClinicianGuard"]],
        children: [{ path: "", component: _clinician_pharmacy_pharmacy_component__WEBPACK_IMPORTED_MODULE_11__["PharmacyComponent"] }]
    },
    /*=========== Admin Component ==============*/
    /*------------ Home ---------------------------*/
    { path: "kimsapp/admin", component: _admin_admin_component__WEBPACK_IMPORTED_MODULE_5__["AdminComponent"], canActivate: [_auth_admin_guard__WEBPACK_IMPORTED_MODULE_18__["AdminGuard"]],
        children: [{ path: "", component: _admin_ahome_ahome_component__WEBPACK_IMPORTED_MODULE_12__["AhomeComponent"] }]
    },
    { path: "kimsapp/admin/monitor", component: _admin_admin_component__WEBPACK_IMPORTED_MODULE_5__["AdminComponent"], canActivate: [_auth_admin_guard__WEBPACK_IMPORTED_MODULE_18__["AdminGuard"]],
        children: [{ path: "", component: _admin_monitor_monitor_component__WEBPACK_IMPORTED_MODULE_13__["MonitorComponent"] }]
    },
    { path: "kimsapp/admin/medicalDb", component: _admin_admin_component__WEBPACK_IMPORTED_MODULE_5__["AdminComponent"], canActivate: [_auth_admin_guard__WEBPACK_IMPORTED_MODULE_18__["AdminGuard"]],
        children: [{ path: "", component: _admin_filedb_filedb_component__WEBPACK_IMPORTED_MODULE_14__["FiledbComponent"] }]
    },
    { path: "kimsapp/admin/userDb", component: _admin_admin_component__WEBPACK_IMPORTED_MODULE_5__["AdminComponent"], canActivate: [_auth_admin_guard__WEBPACK_IMPORTED_MODULE_18__["AdminGuard"]],
        children: [{ path: "", component: _admin_userdb_userdb_component__WEBPACK_IMPORTED_MODULE_15__["UserdbComponent"] }]
    },
    { path: "kimsapp/admin/register", component: _admin_admin_component__WEBPACK_IMPORTED_MODULE_5__["AdminComponent"], canActivate: [_auth_admin_guard__WEBPACK_IMPORTED_MODULE_18__["AdminGuard"]],
        children: [{ path: "", component: _admin_register_register_component__WEBPACK_IMPORTED_MODULE_16__["RegisterComponent"] }]
    },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/app.component.scss":
/*!************************************!*\
  !*** ./src/app/app.component.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuc2NzcyJ9 */"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var AppComponent = /** @class */ (function () {
    function AppComponent() {
    }
    AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.scss */ "./src/app/app.component.scss")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var angular_font_awesome__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! angular-font-awesome */ "./node_modules/angular-font-awesome/dist/angular-font-awesome.es5.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _login_login_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./login/login.component */ "./src/app/login/login.component.ts");
/* harmony import */ var _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./clinician/clinician.component */ "./src/app/clinician/clinician.component.ts");
/* harmony import */ var _clinician_chome_chome_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./clinician/chome/chome.component */ "./src/app/clinician/chome/chome.component.ts");
/* harmony import */ var _clinician_admission_admission_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./clinician/admission/admission.component */ "./src/app/clinician/admission/admission.component.ts");
/* harmony import */ var _clinician_examination_examination_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./clinician/examination/examination.component */ "./src/app/clinician/examination/examination.component.ts");
/* harmony import */ var _clinician_xray_xray_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./clinician/xray/xray.component */ "./src/app/clinician/xray/xray.component.ts");
/* harmony import */ var _clinician_laboratory_laboratory_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./clinician/laboratory/laboratory.component */ "./src/app/clinician/laboratory/laboratory.component.ts");
/* harmony import */ var _clinician_pharmacy_pharmacy_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./clinician/pharmacy/pharmacy.component */ "./src/app/clinician/pharmacy/pharmacy.component.ts");
/* harmony import */ var _admin_admin_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./admin/admin.component */ "./src/app/admin/admin.component.ts");
/* harmony import */ var _admin_ahome_ahome_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./admin/ahome/ahome.component */ "./src/app/admin/ahome/ahome.component.ts");
/* harmony import */ var _admin_monitor_monitor_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./admin/monitor/monitor.component */ "./src/app/admin/monitor/monitor.component.ts");
/* harmony import */ var _admin_filedb_filedb_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./admin/filedb/filedb.component */ "./src/app/admin/filedb/filedb.component.ts");
/* harmony import */ var _admin_userdb_userdb_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./admin/userdb/userdb.component */ "./src/app/admin/userdb/userdb.component.ts");
/* harmony import */ var _admin_register_register_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./admin/register/register.component */ "./src/app/admin/register/register.component.ts");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");
/* harmony import */ var _auth_clinician_guard__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./auth/clinician.guard */ "./src/app/auth/clinician.guard.ts");
/* harmony import */ var _auth_admin_guard__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./auth/admin.guard */ "./src/app/auth/admin.guard.ts");
/* harmony import */ var _services_users_service__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./services/users.service */ "./src/app/services/users.service.ts");
/* harmony import */ var _services_files_service__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./services/files.service */ "./src/app/services/files.service.ts");
/* harmony import */ var _services_stats_service__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./services/stats.service */ "./src/app/services/stats.service.ts");
/* harmony import */ var _services_notify_service__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./services/notify.service */ "./src/app/services/notify.service.ts");
/* harmony import */ var ngx_socket_io__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ngx-socket-io */ "./node_modules/ngx-socket-io/index.js");































var config = { url: 'http://localhost:8040', options: {} };
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"],
                _login_login_component__WEBPACK_IMPORTED_MODULE_6__["LoginComponent"],
                _clinician_clinician_component__WEBPACK_IMPORTED_MODULE_7__["ClinicianComponent"],
                _clinician_chome_chome_component__WEBPACK_IMPORTED_MODULE_8__["ChomeComponent"],
                _clinician_admission_admission_component__WEBPACK_IMPORTED_MODULE_9__["AdmissionComponent"],
                _clinician_examination_examination_component__WEBPACK_IMPORTED_MODULE_10__["ExaminationComponent"],
                _clinician_xray_xray_component__WEBPACK_IMPORTED_MODULE_11__["XrayComponent"],
                _clinician_laboratory_laboratory_component__WEBPACK_IMPORTED_MODULE_12__["LaboratoryComponent"],
                _clinician_pharmacy_pharmacy_component__WEBPACK_IMPORTED_MODULE_13__["PharmacyComponent"],
                _admin_admin_component__WEBPACK_IMPORTED_MODULE_14__["AdminComponent"],
                _admin_ahome_ahome_component__WEBPACK_IMPORTED_MODULE_15__["AhomeComponent"],
                _admin_monitor_monitor_component__WEBPACK_IMPORTED_MODULE_16__["MonitorComponent"],
                _admin_filedb_filedb_component__WEBPACK_IMPORTED_MODULE_17__["FiledbComponent"],
                _admin_userdb_userdb_component__WEBPACK_IMPORTED_MODULE_18__["UserdbComponent"],
                _admin_register_register_component__WEBPACK_IMPORTED_MODULE_19__["RegisterComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
                _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
                angular_font_awesome__WEBPACK_IMPORTED_MODULE_3__["AngularFontAwesomeModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_20__["HttpClientModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_21__["FormsModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_22__["BrowserAnimationsModule"],
                ngx_toastr__WEBPACK_IMPORTED_MODULE_23__["ToastrModule"].forRoot({
                    timeOut: 7000,
                    positionClass: 'toast-bottom-right',
                    preventDuplicates: false,
                }),
                ngx_socket_io__WEBPACK_IMPORTED_MODULE_30__["SocketIoModule"].forRoot(config)
            ],
            providers: [_services_users_service__WEBPACK_IMPORTED_MODULE_26__["UsersService"], _services_files_service__WEBPACK_IMPORTED_MODULE_27__["FilesService"], _services_stats_service__WEBPACK_IMPORTED_MODULE_28__["StatsService"], _services_notify_service__WEBPACK_IMPORTED_MODULE_29__["NotifyService"], _auth_clinician_guard__WEBPACK_IMPORTED_MODULE_24__["ClinicianGuard"], _auth_admin_guard__WEBPACK_IMPORTED_MODULE_25__["AdminGuard"]
            ],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/auth/admin.guard.ts":
/*!*************************************!*\
  !*** ./src/app/auth/admin.guard.ts ***!
  \*************************************/
/*! exports provided: AdminGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdminGuard", function() { return AdminGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var AdminGuard = /** @class */ (function () {
    function AdminGuard(router) {
        this.router = router;
    }
    AdminGuard.prototype.canActivate = function (next, state) {
        if (window.localStorage.getItem("adminToken") != null)
            return true;
        this.router.navigate(["/kimsapp/login"]);
        return false;
    };
    AdminGuard.prototype.canActivateChild = function (next, state) {
        return true;
    };
    AdminGuard.prototype.canLoad = function (route, segments) {
        return true;
    };
    AdminGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], AdminGuard);
    return AdminGuard;
}());



/***/ }),

/***/ "./src/app/auth/clinician.guard.ts":
/*!*****************************************!*\
  !*** ./src/app/auth/clinician.guard.ts ***!
  \*****************************************/
/*! exports provided: ClinicianGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClinicianGuard", function() { return ClinicianGuard; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var ClinicianGuard = /** @class */ (function () {
    function ClinicianGuard(router) {
        this.router = router;
    }
    ClinicianGuard.prototype.canActivate = function (next, state) {
        if (window.localStorage.getItem("clinicianToken") != null)
            return true;
        this.router.navigate(["/kimsapp/login"]);
        return false;
    };
    ClinicianGuard.prototype.canActivateChild = function (next, state) {
        return true;
    };
    ClinicianGuard.prototype.canLoad = function (route, segments) {
        return true;
    };
    ClinicianGuard = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ClinicianGuard);
    return ClinicianGuard;
}());



/***/ }),

/***/ "./src/app/clinician/admission/admission.component.html":
/*!**************************************************************!*\
  !*** ./src/app/clinician/admission/admission.component.html ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\n    <form  class=\"col-sm-12 col-md-6 mx-auto rounded \"\n    #admissionForm=\"ngForm\"\n    (ngSubmit)=\"onSubmit(); admissionForm.reset()\"\n    >\n\n        <h1>Admission</h1>\n        \n        \n        <label >FirstName</label><br>\n\n        <input id=\"admFormFirstname\" type=\"text\" class=\"form-control form-control-sm rounded\" name=\"firstName\"\n        #firstName=\"ngModel\"\n        [class.is-invalid]=\"firstName.invalid && firstName.touched\" \n        [(ngModel)]=\"admit.firstName\"\n        placeholder=\"Firstname\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"firstName.valid || firstName.untouched\">FirstName is Required</small>\n        <br><br>\n\n\n        <label>LastName</label><br>\n\n        <input id=\"admFormLastname\" type=\"text\" class=\"form-control form-control-sm  rounded\" name=\"lastName\"\n        #lastName=\"ngModel\"\n        [class.is-invalid]=\"lastName.invalid && lastName.touched\" \n        [(ngModel)]=\"admit.lastName\"\n        placeholder=\"Lastname\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"lastName.valid || lastName.untouched\">LastName is Required</small> \n        <br><br>\n\n\n        <label>Age</label><br>\n\n        <input id=\"admFormAge\" type=\"text\" class=\"form-control form-control-sm rounded\" name=\"age\"\n        #age=\"ngModel\" [class.is-invalid]=\"age.invalid && age.touched\" \n        [(ngModel)]=\"admit.age\"\n        placeholder=\"Age\" required>\n        <small class=\"text-danger ml-2\" [class.d-none]=\"age.valid || age.untouched\">Age is Required</small> \n        <br><br>\n\n\n        <label class=\"mt-2\">Gender</label> <br>\n\n        <label>Male</label>\n        <input id=\"admFormMale\" type=\"radio\" name=\"gender\" value=\"male\"\n        [(ngModel)]=\"admit.gender\"\n        required> &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;\n        \n        <label>Female</label>\n        <input id=\"admFormFemale\" type=\"radio\" name=\"gender\" value=\"female\"\n        [(ngModel)]=\"admit.gender\"\n        required> <br>\n        \n        \n        <button id=\"admit_btn\" type=\"submit\" class=\"btn btn-success m-3\" [disabled]=\"!admissionForm.valid\" > Admit </button>\n      \n\n    </form>\n\n\n</div>"

/***/ }),

/***/ "./src/app/clinician/admission/admission.component.scss":
/*!**************************************************************!*\
  !*** ./src/app/clinician/admission/admission.component.scss ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\nform {\n  background-color: #4a5d68;\n  padding: 1em 2em 0 2em;\n  margin: 1em 0 0 0;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\nform h1 {\n    font-size: 20px;\n    font-weight: bold;\n    color: #e8491d;\n    text-shadow: 5px 5px 3px black; }\nform input {\n    border: none;\n    color: black;\n    background-color: #97a9b4; }\nform small {\n    font-size: 12px; }\nform input[type=text], form input[type=email], form input[type=tel], form input[type=password] {\n    width: 15em; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpbmljaWFuL2FkbWlzc2lvbi9DOlxcVGhlQ29kZVxcbWVhbkFwcFJhd1xca2ltc2FwcC9zcmNcXGFwcFxcY2xpbmljaWFuXFxhZG1pc3Npb25cXGFkbWlzc2lvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBK0NBO0VBQ0kseUJBckMyQjtFQXNDM0Isc0JBQXNCO0VBQ3RCLGlCQUFpQjtFQUNqQiwwQ0FBeUMsRUFBQTtBQUo3QztJQU9RLGVBQWU7SUFDZixpQkFBaUI7SUFDakIsY0FwRGE7SUFxRGIsOEJBQXlDLEVBQUE7QUFWakQ7SUFlUSxZQUFZO0lBQ1osWUFBWTtJQUNaLHlCQXBEd0IsRUFBQTtBQW1DaEM7SUFvQlEsZUFBZSxFQUFBO0FBcEJ2QjtJQXdCUSxXQUFXLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9jbGluaWNpYW4vYWRtaXNzaW9uL2FkbWlzc2lvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLSBHbG9iYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKiBCcmVha3BvaW50czogeHM6IDAsICBzbTogNTc2cHg7IG1kOiA3NjhweDsgbGc6IDk5MnB4OyB4bDogMTIwMHB4OyAqL1xyXG5cclxuJGNvbG9yczogKFxyXG4gICAgYmc6ICNjMGMwYzAsXHJcbiAgICBmZXZvcml0ZTogI2U4NDkxZCxcclxuICAgIHRoZW1lOiAjMzU0MjRhLFxyXG4gICAgcHJpbWFyeTogIzAwN2JmZixcclxuICAgIHByaW1hcnktbGlnaHQ6IGxpZ2h0ZW4oIzAwNURGRiwgNDAlKSxcclxuICAgIHByaW1hcnktZGFyazogZGFya2VuKCMwMDVERkYsIDQwJSksXHJcbiAgICBhY2NlbnQ6ICNGRkY2QkIsXHJcbiAgICBnaXJsaXNoOiByZ2IoMTk1LCAxNSwgMjAxKSxcclxuICAgIGZvcm06IGxpZ2h0ZW4oIzM1NDI0YSwgMTAlKSxcclxuICAgIGlucHV0OiBsaWdodGVuKCMzNTQyNGEsIDQwJSksXHJcbiAgICBncmF5OiAjNmM3NTdkLFxyXG4gICAgZ3JheS1kYXJrOiAjMzQzYTQwLFxyXG4gICAgc2Vjb25kYXJ5OiAjNmM3NTdkLFxyXG4gICAgc3VjY2VzczogIzI4YTc0NSxcclxuICAgIGluZm86ICMxN2EyYjgsXHJcbiAgICB3YXJuaW5nOiAjZmZjMTA3LFxyXG4gICAgZGFuZ2VyOiAjZGMzNTQ1LFxyXG4gICAgbGlnaHQ6ICNmOGY5ZmEsXHJcbiAgICBkYXJrOiAjMzQzYTQwXHJcblxyXG4pO1xyXG5cclxuQGZ1bmN0aW9uIGNvbG9yKCRjb2xvci1uYW1lKXtcclxuICAgIEByZXR1cm4gbWFwLWdldCgkY29sb3JzICwgJGNvbG9yLW5hbWUpXHJcbn1cclxuXHJcblxyXG4kZGVza3RvcDogNzY4cHg7XHJcbiRkZXNrdG9wX3NtOiAzNjRweDtcclxuJG9wYWNpdHk6IC45O1xyXG5cclxuQG1peGluIGRlc2t0b3Bfc20ge1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3Bfc219KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5AbWl4aW4gZGVza3RvcCB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcH0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcblxyXG5mb3Jte1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZm9ybSk7XHJcbiAgICBwYWRkaW5nOiAxZW0gMmVtIDAgMmVtO1xyXG4gICAgbWFyZ2luOiAxZW0gMCAwIDA7XHJcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuXHJcbiAgICBoMXtcclxuICAgICAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICB0ZXh0LXNoYWRvdzogNXB4IDVweCAzcHggcmdiYSgwLCAwLCAwLCAxKTtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGlucHV0e1xyXG4gICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoaW5wdXQpO1xyXG4gICAgfVxyXG4gICAgc21hbGx7XHJcbiAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpbnB1dFt0eXBlPXRleHRdLCBpbnB1dFt0eXBlPWVtYWlsXSwgaW5wdXRbdHlwZT10ZWxdLCBpbnB1dFt0eXBlPXBhc3N3b3JkXXtcclxuICAgICAgICB3aWR0aDogMTVlbTtcclxuICAgIH1cclxuXHJcbn0iXX0= */"

/***/ }),

/***/ "./src/app/clinician/admission/admission.component.ts":
/*!************************************************************!*\
  !*** ./src/app/clinician/admission/admission.component.ts ***!
  \************************************************************/
/*! exports provided: AdmissionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdmissionComponent", function() { return AdmissionComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/files.service */ "./src/app/services/files.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var AdmissionComponent = /** @class */ (function () {
    function AdmissionComponent(filesService, notifyService) {
        this.filesService = filesService;
        this.notifyService = notifyService;
    }
    AdmissionComponent.prototype.ngOnInit = function () {
        this.admit = {
            firstName: "",
            lastName: "",
            age: "",
            gender: ""
        };
    };
    AdmissionComponent.prototype.onSubmit = function () {
        var _this = this;
        this.filesService.admitPatient(this.admit).subscribe(function (data) {
            console.log("Admission Success!");
            _this.notifyService.showSuccess("Patient Admitted", "Successfull !!");
        }, function (error) { console.error("Error", error); });
    };
    AdmissionComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-admission',
            template: __webpack_require__(/*! ./admission.component.html */ "./src/app/clinician/admission/admission.component.html"),
            styles: [__webpack_require__(/*! ./admission.component.scss */ "./src/app/clinician/admission/admission.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__["FilesService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], AdmissionComponent);
    return AdmissionComponent;
}());

/*

this.filesService.admitPatient(this.admit).subscribe(
      data => {
                console.log("Admission Success!");
                this.notifyService.showSuccess("Patient Admitted", "Successfull !!");
                
              },
      error => { console.error("Error", error); }
    )
    */ 


/***/ }),

/***/ "./src/app/clinician/chome/chome.component.html":
/*!******************************************************!*\
  !*** ./src/app/clinician/chome/chome.component.html ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\">\n\n        <form id=\"home_form\" class=\"form mx-auto rounded \">\n    \n            <h1>Home Page</h1>\n            <h4>Choose Section</h4>\n\n            <ul>\n                <li><a (click)=\"Admission()\" >Admission</a></li>\n                <li><a (click)=\"Examination()\">Examination</a></li>\n                <li><a (click)=\"Lab()\">Laboratory</a></li>\n                <li><a (click)=\"Xray()\">Xray</a></li>\n                <li><a (click)=\"Pharmacy()\">Pharmacy</a></li>\n            </ul>\n    \n        </form>\n    \n    </div>"

/***/ }),

/***/ "./src/app/clinician/chome/chome.component.scss":
/*!******************************************************!*\
  !*** ./src/app/clinician/chome/chome.component.scss ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\nform {\n  background-color: #4a5d68;\n  padding: 1em 2em 1em 2em;\n  margin: 1em 0 0 0;\n  width: 90%;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\n@media (min-width: 768px) {\n    form {\n      width: 30%; } }\nform h1 {\n    font-size: 20px;\n    font-weight: bold;\n    color: #e8491d;\n    text-shadow: 5px 5px 3px black; }\nform h4 {\n    font-size: 18px;\n    font-weight: bold; }\nform ul {\n    list-style-type: none; }\nform ul li {\n      margin: 2em 0 1em 0; }\nform ul li a {\n        color: #17a2b8;\n        font-size: 16px;\n        font-weight: bold; }\nform ul li a:hover {\n        cursor: pointer;\n        font-weight: bolder;\n        font-size: 18px;\n        color: #ffc107; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpbmljaWFuL2Nob21lL0M6XFxUaGVDb2RlXFxtZWFuQXBwUmF3XFxraW1zYXBwL3NyY1xcYXBwXFxjbGluaWNpYW5cXGNob21lXFxjaG9tZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBNkNBO0VBQ0kseUJBcEMyQjtFQXFDM0Isd0JBQXdCO0VBQ3hCLGlCQUFpQjtFQUNqQixVQUFVO0VBQ1YsMENBQXlDLEVBQUE7QUFYekM7SUFNSjtNQVFRLFVBQVUsRUFBQSxFQWdDakI7QUF4Q0Q7SUFZUSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLGNBdkRhO0lBd0RiLDhCQUF5QyxFQUFBO0FBZmpEO0lBa0JRLGVBQWU7SUFDZixpQkFBaUIsRUFBQTtBQW5CekI7SUFzQlEscUJBQXFCLEVBQUE7QUF0QjdCO01Bd0JZLG1CQUFtQixFQUFBO0FBeEIvQjtRQTBCZ0IsY0F2REM7UUF3REQsZUFBZTtRQUNmLGlCQUFpQixFQUFBO0FBNUJqQztRQWdDZ0IsZUFBZTtRQUNmLG1CQUFtQjtRQUNuQixlQUFlO1FBQ2YsY0EvREksRUFBQSIsImZpbGUiOiJzcmMvYXBwL2NsaW5pY2lhbi9jaG9tZS9jaG9tZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLSBHbG9iYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKiBCcmVha3BvaW50czogeHM6IDAsICBzbTogNTc2cHg7IG1kOiA3NjhweDsgbGc6IDk5MnB4OyB4bDogMTIwMHB4OyAqL1xyXG5cclxuJGNvbG9yczogKFxyXG4gICAgYmc6ICNjMGMwYzAsXHJcbiAgICBmZXZvcml0ZTogI2U4NDkxZCxcclxuICAgIHByaW1hcnk6ICMwMDdiZmYsXHJcbiAgICBwcmltYXJ5LWxpZ2h0OiBsaWdodGVuKCMwMDVERkYsIDQwJSksXHJcbiAgICBwcmltYXJ5LWRhcms6IGRhcmtlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgYWNjZW50OiAjRkZGNkJCLFxyXG4gICAgZ2lybGlzaDogcmdiKDE5NSwgMTUsIDIwMSksXHJcbiAgICBmb3JtOiBsaWdodGVuKCMzNTQyNGEsIDEwJSksXHJcbiAgICBpbnB1dDogbGlnaHRlbihncmV5LCA1MCUpLFxyXG4gICAgZ3JheTogIzZjNzU3ZCxcclxuICAgIGdyYXktZGFyazogIzM0M2E0MCxcclxuICAgIHNlY29uZGFyeTogIzZjNzU3ZCxcclxuICAgIHN1Y2Nlc3M6ICMyOGE3NDUsXHJcbiAgICBpbmZvOiAjMTdhMmI4LFxyXG4gICAgd2FybmluZzogI2ZmYzEwNyxcclxuICAgIGRhbmdlcjogI2RjMzU0NSxcclxuICAgIGxpZ2h0OiAjZjhmOWZhLFxyXG4gICAgZGFyazogIzM0M2E0MFxyXG5cclxuKTtcclxuXHJcbkBmdW5jdGlvbiBjb2xvcigkY29sb3ItbmFtZSl7XHJcbiAgICBAcmV0dXJuIG1hcC1nZXQoJGNvbG9ycyAsICRjb2xvci1uYW1lKVxyXG59XHJcblxyXG4kZGVza3RvcDogNzY4cHg7XHJcbiRkZXNrdG9wX3NtOiAzNjRweDtcclxuJG9wYWNpdHk6IC45O1xyXG5cclxuQG1peGluIGRlc2t0b3Bfc20ge1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3Bfc219KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5AbWl4aW4gZGVza3RvcCB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcH0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcblxyXG5mb3Jte1xyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZm9ybSk7XHJcbiAgICBwYWRkaW5nOiAxZW0gMmVtIDFlbSAyZW07XHJcbiAgICBtYXJnaW46IDFlbSAwIDAgMDtcclxuICAgIHdpZHRoOiA5MCU7XHJcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuXHJcbiAgICBAaW5jbHVkZSBkZXNrdG9wIHtcclxuICAgICAgICB3aWR0aDogMzAlO1xyXG4gICAgfVxyXG5cclxuICAgIGgxe1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICBjb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgfVxyXG4gICAgaDR7XHJcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgfVxyXG4gICAgdWx7XHJcbiAgICAgICAgbGlzdC1zdHlsZS10eXBlOiBub25lO1xyXG4gICAgICAgIGxpe1xyXG4gICAgICAgICAgICBtYXJnaW46IDJlbSAwIDFlbSAwO1xyXG4gICAgICAgICAgICBhe1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNnB4O1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGE6aG92ZXJ7XHJcbiAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZGVyO1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKHdhcm5pbmcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ== */"

/***/ }),

/***/ "./src/app/clinician/chome/chome.component.ts":
/*!****************************************************!*\
  !*** ./src/app/clinician/chome/chome.component.ts ***!
  \****************************************************/
/*! exports provided: ChomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChomeComponent", function() { return ChomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var ChomeComponent = /** @class */ (function () {
    function ChomeComponent(router) {
        this.router = router;
    }
    ChomeComponent.prototype.ngOnInit = function () {
    };
    ChomeComponent.prototype.Admission = function () {
        this.router.navigate(["/kimsapp/clinician/admission"]);
    };
    ChomeComponent.prototype.Examination = function () {
        this.router.navigate(["/kimsapp/clinician/examination"]);
    };
    ChomeComponent.prototype.Lab = function () {
        this.router.navigate(["/kimsapp/clinician/lab"]);
    };
    ChomeComponent.prototype.Xray = function () {
        this.router.navigate(["/kimsapp/clinician/xray"]);
    };
    ChomeComponent.prototype.Pharmacy = function () {
        this.router.navigate(["/kimsapp/clinician/pharmacy"]);
    };
    ChomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-chome',
            template: __webpack_require__(/*! ./chome.component.html */ "./src/app/clinician/chome/chome.component.html"),
            styles: [__webpack_require__(/*! ./chome.component.scss */ "./src/app/clinician/chome/chome.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ChomeComponent);
    return ChomeComponent;
}());



/***/ }),

/***/ "./src/app/clinician/clinician.component.html":
/*!****************************************************!*\
  !*** ./src/app/clinician/clinician.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n\n<header class=\"sticky-top\">\n\n <div class=\"container\">\n    \n  <nav id=\"navbar\" class=\"navbar navbar-expand-sm navbar-light\">\n\n        <div class=\"navbar col-6 mr-auto\">\n                        <h4 id=\"brand\" class=\"navbar mr-auto\">The<span>Kims</span>Web &nbsp; &nbsp;<fa name=\"stethoscope\" size=\"lg\" class=\"mx-auto\"></fa></h4>\n                        \n                        <h4 id=\"site\" class=\"navbar ml-auto\">Clinical Site</h4>\n                      \n        </div>\n                                \n    \n    \n\n    <button class=\"navbar-toggler\" data-toggle=\"collapse\" data-target=\"#menu\">\n            <span class=\"navbar-toggler-icon\"></span>\n    </button>\n\n    <div class=\"collapse navbar-collapse \" id=\"menu\">\n        \n            <ul id=\"navbar-nav\" class=\"nav ml-auto\">\n\n                    <li class=\"nav-item\"><a (click)=\"home()\" class=\"nav-link\">Home</a></li>\n                    <li id=\"dropdown\" class=\"nav-item dropdown\">\n                        \n                        <a class=\"nav-link \" data-toggle=\"dropdown\">\n                            <fa name=\"user\" size=\"lg\"></fa>\n                            \n                        </a>\n                        \n                        <div class=\"dropdown-menu\">\n                            <small id=\"user\" class=\"dropdown-item\">{{clinicianUser}}</small>\n                            <hr>\n                            <a id=\"logout\" href=\"/kimsapp/login\" (click)=\"logOut()\" class=\"dropdown-item\">LogOut</a>\n\n                        </div>\n\n                        \n                    </li>\n                                    \n\n            </ul>\n\n    </div>\n\n</nav>\n\n\n\n\n\n\n\n </div>\n\n</header>\n\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/clinician/clinician.component.scss":
/*!****************************************************!*\
  !*** ./src/app/clinician/clinician.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\n/*-----------------------------------------------------*/\n.container-fluid, .container {\n  width: 100%; }\nheader {\n  background-color: #35424a;\n  text-align: center;\n  padding: 3px;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);\n  border-bottom: #e8491d 3px solid; }\nheader #brand {\n    font-family: Montserrat;\n    font-size: 16px;\n    font-weight: bold;\n    text-transform: uppercase;\n    color: #17a2b8;\n    text-shadow: 5px 5px 3px black; }\nheader #brand span {\n      font-size: 24px;\n      color: #e8491d;\n      text-shadow: 5px 5px 3px black; }\nheader #brand fa {\n      margin-left: 2em;\n      color: #e8491d; }\nheader #site {\n    font-size: 16px;\n    font-weight: bold;\n    text-transform: uppercase;\n    color: #17a2b8;\n    text-shadow: 5px 5px 3px black; }\nheader .navbar {\n    margin: 0;\n    padding: 0; }\nheader .navbar .nav li a {\n      cursor: pointer;\n      color: #17a2b8;\n      font-weight: bolder;\n      text-transform: uppercase;\n      text-shadow: 5px 5px 3px black; }\nheader .navbar .nav li a:hover {\n      font-weight: bolder; }\nheader .navbar .nav #dropdown a {\n      color: #e8491d;\n      cursor: pointer;\n      text-shadow: 5px 5px 3px black; }\nheader .navbar .nav #dropdown .dropdown-menu:hover, header .navbar .nav #dropdown a:hover + .dropdown-menu {\n      display: block; }\nheader .navbar .nav #dropdown .dropdown-menu {\n      background-color: #e8491d;\n      top: 4.5em;\n      -webkit-transform: translate(-50%, -50%);\n              transform: translate(-50%, -50%);\n      display: none; }\nheader .navbar .nav #dropdown .dropdown-menu #user {\n        cursor: default;\n        color: black;\n        font-size: 16px;\n        font-weight: bolder;\n        text-transform: capitalize;\n        text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3); }\nheader .navbar .nav #dropdown .dropdown-menu #user:hover {\n        background-color: #e8491d; }\nheader .navbar .nav #dropdown .dropdown-menu hr {\n        margin: 0; }\nheader .navbar .nav #dropdown .dropdown-menu #logout {\n        color: #6c757d;\n        text-transform: lowercase;\n        text-transform: capitalize;\n        text-align: center;\n        font-weight: bolder;\n        font-size: 14px;\n        text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.1); }\nheader .navbar .nav #dropdown .dropdown-menu #logout:hover {\n        cursor: pointer;\n        background-color: #35424a;\n        color: white; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpbmljaWFuL0M6XFxUaGVDb2RlXFxtZWFuQXBwUmF3XFxraW1zYXBwL3NyY1xcYXBwXFxjbGluaWNpYW5cXGNsaW5pY2lhbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBd0NJLHdEQUFBO0FBQ0E7RUFDSSxXQUFXLEVBQUE7QUFJZjtFQUNJLHlCQTFDVTtFQTJDVixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLDBDQUEwQztFQUMxQyxnQ0FBd0MsRUFBQTtBQUw1QztJQVVRLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLHlCQUF5QjtJQUN6QixjQTFDSztJQTJDTCw4QkFBeUMsRUFBQTtBQWZqRDtNQWtCWSxlQUFlO01BQ2YsY0E3REs7TUE4REwsOEJBQXlDLEVBQUE7QUFwQnJEO01Bd0JZLGdCQUFnQjtNQUNoQixjQW5FSyxFQUFBO0FBMENqQjtJQWdDUSxlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLHlCQUF5QjtJQUN6QixjQS9ESztJQWdFTCw4QkFBeUMsRUFBQTtBQXBDakQ7SUEwQ1EsU0FBUztJQUNULFVBQVUsRUFBQTtBQTNDbEI7TUFrRG9CLGVBQWU7TUFDZixjQS9FUDtNQWdGTyxtQkFBbUI7TUFDbkIseUJBQXlCO01BQ3pCLDhCQUF5QyxFQUFBO0FBdEQ3RDtNQXlEb0IsbUJBQW1CLEVBQUE7QUF6RHZDO01BK0R3QixjQXpHUDtNQTBHTyxlQUFlO01BQ2YsOEJBQXlDLEVBQUE7QUFqRWpFO01Bb0V3QixjQUFjLEVBQUE7QUFwRXRDO01BeUVvQix5QkFuSEg7TUFvSEcsVUFBVTtNQUNWLHdDQUFnQztjQUFoQyxnQ0FBZ0M7TUFDaEMsYUFBYSxFQUFBO0FBNUVqQztRQStFd0IsZUFBZTtRQUNmLFlBQVk7UUFDWixlQUFlO1FBQ2YsbUJBQW1CO1FBQ25CLDBCQUEwQjtRQUMxQiwyQ0FBMEMsRUFBQTtBQXBGbEU7UUF1RndCLHlCQWpJUCxFQUFBO0FBMENqQjtRQTBGd0IsU0FBUyxFQUFBO0FBMUZqQztRQTZGd0IsY0EzSE47UUE0SE0seUJBQXlCO1FBQ3pCLDBCQUEwQjtRQUMxQixrQkFBa0I7UUFDbEIsbUJBQW1CO1FBQ25CLGVBQWU7UUFDZiwyQ0FBMEMsRUFBQTtBQW5HbEU7UUFzR3dCLGVBQWU7UUFDZix5QkFoSlY7UUFpSlUsWUFBWSxFQUFBIiwiZmlsZSI6InNyYy9hcHAvY2xpbmljaWFuL2NsaW5pY2lhbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLSBHbG9iYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKiBCcmVha3BvaW50czogeHM6IDAsICBzbTogNTc2cHg7IG1kOiA3NjhweDsgbGc6IDk5MnB4OyB4bDogMTIwMHB4OyAqL1xyXG5cclxuJGNvbG9yczogKFxyXG4gICAgYmc6IHJnYigyMzEsIDc4LCAzMSksXHJcbiAgICBmZXZvcml0ZTogI2U4NDkxZCxcclxuICAgIHRoZW1lOiAjMzU0MjRhLFxyXG4gICAgcHJpbWFyeTogIzAwN2JmZixcclxuICAgIHByaW1hcnktbGlnaHQ6IGxpZ2h0ZW4oIzAwNURGRiwgNDAlKSxcclxuICAgIHByaW1hcnktZGFyazogZGFya2VuKCMwMDVERkYsIDQwJSksXHJcbiAgICBhY2NlbnQ6ICNGRkY2QkIsXHJcbiAgICBnaXJsaXNoOiByZ2IoMTk1LCAxNSwgMjAxKSxcclxuICAgIGNsaW5pYzogIGxpZ2h0ZW4oIzM1NDI0YSwgNDAlKSxcclxuICAgIGFkbWluOiByZ2IoMzksIDk3LCA5NyksXHJcbiAgICBpbnB1dDogbGlnaHRlbihncmV5LCA1MCUpLFxyXG4gICAgZ3JheTogIzZjNzU3ZCxcclxuICAgIGdyYXktZGFyazogIzM0M2E0MCxcclxuICAgIHNlY29uZGFyeTogIzZjNzU3ZCxcclxuICAgIHN1Y2Nlc3M6ICMyOGE3NDUsXHJcbiAgICBpbmZvOiAjMTdhMmI4LFxyXG4gICAgd2FybmluZzogI2ZmYzEwNyxcclxuICAgIGRhbmdlcjogI2RjMzU0NSxcclxuICAgIGxpZ2h0OiAjZjhmOWZhLFxyXG4gICAgZGFyazogIzM0M2E0MFxyXG5cclxuKTtcclxuXHJcbkBmdW5jdGlvbiBjb2xvcigkY29sb3ItbmFtZSl7XHJcbiAgICBAcmV0dXJuIG1hcC1nZXQoJGNvbG9ycyAsICRjb2xvci1uYW1lKVxyXG59XHJcblxyXG4kZGVza3RvcDogNzY4cHg7XHJcbiRvcGFjaXR5OiAuOTtcclxuXHJcbkBtaXhpbiBkZXNrdG9wIHtcclxuICAgIEBtZWRpYSAobWluLXdpZHRoOiAjeyRkZXNrdG9wfSkge1xyXG4gICAgICAgIEBjb250ZW50O1xyXG4gICAgfSBcclxufVxyXG5cclxuXHJcbiAgICAvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuICAgIC5jb250YWluZXItZmx1aWQsIC5jb250YWluZXIge1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGhlYWRlciB7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IodGhlbWUpO1xyXG4gICAgICAgIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAgICAgICBwYWRkaW5nOiAzcHg7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAwLjUpO1xyXG4gICAgICAgIGJvcmRlci1ib3R0b206IGNvbG9yKGZldm9yaXRlKSAzcHggc29saWQ7XHJcblxyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAjYnJhbmR7XHJcbiAgICAgICAgICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgXHJcbiAgICAgICAgICAgIHNwYW4ge1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmYXtcclxuICAgICAgICAgICAgICAgIG1hcmdpbi1sZWZ0OiAyZW07XHJcbiAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoZmV2b3JpdGUpOyBcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgICNzaXRle1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDE2cHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC5uYXZiYXJ7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgcGFkZGluZzogMDtcclxuXHJcbiAgICAgICAgICAgXHJcblxyXG4gICAgICAgICAgICAubmF2e1xyXG4gICAgICAgICAgICAgICAgbGl7XHJcbiAgICAgICAgICAgICAgICAgICAgYXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpOyAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGE6aG92ZXJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIH0gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAjZHJvcGRvd257XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLmRyb3Bkb3duLW1lbnU6aG92ZXIsIGE6aG92ZXIgKyAuZHJvcGRvd24tbWVudXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAuZHJvcGRvd24tbWVudXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3A6IDQuNWVtO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcclxuICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjdXNlcntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1cnNvcjogZGVmYXVsdDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTZweDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjdXNlcjpob3ZlcntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBocntcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAjbG9nb3V0e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKHNlY29uZGFyeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogbG93ZXJjYXNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC10cmFuc2Zvcm06IGNhcGl0YWxpemU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNHB4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgLjEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICNsb2dvdXQ6aG92ZXJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcih0aGVtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogd2hpdGU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/clinician/clinician.component.ts":
/*!**************************************************!*\
  !*** ./src/app/clinician/clinician.component.ts ***!
  \**************************************************/
/*! exports provided: ClinicianComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClinicianComponent", function() { return ClinicianComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");



var ClinicianComponent = /** @class */ (function () {
    function ClinicianComponent(router) {
        this.router = router;
    }
    ClinicianComponent.prototype.ngOnInit = function () {
        this.clinicianUser = localStorage.getItem("clinicianUser");
    };
    ClinicianComponent.prototype.home = function () {
        this.router.navigate(["/kimsapp/clinician"]);
    };
    ClinicianComponent.prototype.logOut = function () {
        window.localStorage.removeItem("clinicianToken");
        window.localStorage.removeItem("clinicianUser");
    };
    ClinicianComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-clinician',
            template: __webpack_require__(/*! ./clinician.component.html */ "./src/app/clinician/clinician.component.html"),
            styles: [__webpack_require__(/*! ./clinician.component.scss */ "./src/app/clinician/clinician.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], ClinicianComponent);
    return ClinicianComponent;
}());



/***/ }),

/***/ "./src/app/clinician/examination/examination.component.html":
/*!******************************************************************!*\
  !*** ./src/app/clinician/examination/examination.component.html ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"card-deck\">\n        \n    <form id=\"adm_exam_form\" class=\"form mr-auto rounded   \">\n\n        <h4><strong>Patients from Admission</strong></h4>\n        <hr>\n        \n        <ol >\n\n            <li *ngFor=\"let admittedPatient of admittedPatients\" (click)=\"openAdmFile(admittedPatient.patientNo)\">\n                \n                {{admittedPatient.firstName}} {{admittedPatient.lastName}} : {{admittedPatient.patientNo}}\n\n            </li>\n            \n        </ol>\n        \n            \n\n    </form>\n    <!-- Examination Form 1 -->\n    <form id=\"examination_form1\" #examination_form1=\"ngForm\" class=\"form mx-auto  rounded\" [hidden]=\"hideFormONE\">\n\n            <h1><strong>Examination Form</strong></h1>\n            \n            <hr>\n           \n            <label id=\"h_name\">Name: <strong id=\"name\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.name }}</strong></label> <br>\n\n            <label id=\"h_patientNo\">PatientNo: <strong id=\"patientNo\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.patientNo }}</strong></label>\n\n            &nbsp;&nbsp;&nbsp;\n            <label id=\"h_age\">Age: <strong id=\"age\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\">{{ openedFile.age }}</strong></label>\n\n            &nbsp;&nbsp;&nbsp;&nbsp;\n            <label id=\"h_gender\">Gender: <strong id=\"gender\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\">{{ openedFile.gender }}</strong></label> <br>\n\n            <label id=\"l_signs\" class=\"mt-1\"><strong>Signs & Symptoms</strong></label> <br>\n            <textarea id=\"t_signs\" type=\"text\" class=\"rounded\" name=\"signs\" [(ngModel)]=\"exam.signs\" class=\"form-control form-control-sm\" cols=\"40\" rows=\"3\" placeholder=\"Type signs and symptoms here\" [readonly]=\"signReadonly\" (keyup)=\"signKeyup()\" required></textarea> <br>\n\n            <label id=\"l_tests\" class=\"mt-1\"><strong>Tests / Xray</strong></label> <br>\n            <textarea id=\"t_tests\" class=\"rounded\" name=\"tests\" [(ngModel)]=\"exam.tests\" class=\"form-control form-control-sm\" cols=\"40\" rows=\"3\" placeholder=\"Type tests/xray here\" [readonly]=\"testReadonly\" (keyup)=\"testKeyup()\" required></textarea> <br>\n\n            <label id=\"l_testsResults\" class=\"mt-1\"><strong>Tests / Xray Results</strong></label> <br>\n            <textarea id=\"t_testsResults\" class=\"rounded\" name=\"results\" [(ngModel)]=\"exam.results\" class=\"form-control form-control-sm\" cols=\"40\" rows=\"3\" placeholder=\"Read Only\" readonly=\"readonly\" ></textarea> <br>\n\n            <label id=\"l_dx\" class=\"mt-1\"><strong>Diagnosis</strong></label> <br>\n            <textarea id=\"t_dx\" class=\"rounded\" cols=\"40\" name=\"dx\" [(ngModel)]=\"exam.dx\" rows=\"3\" class=\"form-control form-control-sm\" placeholder=\"Type diagnosis here\" [readonly]=\"dxReadonly\" (keyup)=\"dxKeyup()\" ></textarea> <br>\n\n            <button id=\"delete_btn\" type=\"button\" (click)=\"delete(); examination_form1.reset()\" class=\"btn btn-sm btn-danger m-3\" [disabled]=\"deleteDisabled\" > Delete </button> \n\n            <button id=\"btn_ToLab\" type=\"button\" (click)=\"toLab(); examination_form1.reset()\" class=\"btn btn-sm btn-warning m-3\" [disabled]=\"tolabDisabled\"> To lab </button>\n\n            <button id=\"btn_ToXray\" type=\"button\" (click)=\"toXray(); examination_form1.reset()\" class=\"btn btn-sm btn-primary m-3\" [disabled]=\"toxrayDisabled\"> To Xray </button>\n\n            <button id=\"btn_ToPharmacy\" type=\"button\" (click)=\"toPharmacy(); examination_form1.reset()\" class=\"btn btn-sm btn-success m-3\" [disabled]=\"topharmacyDisabled\"> To Pharmacy </button>\n\n            <hr>\n\n    </form>\n    <!-- Examination form 2 -->\n    <form id=\"examination_form2\" #examination_form2=\"ngForm\" class=\"form mx-auto  rounded\" [hidden]=\"hideFormTWO\" >\n\n        <h1><strong>Examination Form</strong></h1>\n        \n        <hr>\n       \n        <label id=\"h_name\">Name: <strong id=\"name\" class=\"text-warning\" *ngFor=\"let referedFile of referedFiles\" >{{ referedFile.name }}</strong></label> <br>\n\n        <label id=\"h_patientNo\">PatientNo: <strong id=\"patientNo\" class=\"text-warning\" *ngFor=\"let referedFile of referedFiles\" >{{ referedFile.patientNo }}</strong></label>\n\n        &nbsp;&nbsp;&nbsp;\n        <label id=\"h_age\">Age: <strong id=\"age\" class=\"text-warning\" *ngFor=\"let referedFile of referedFiles\">{{ referedFile.age }}</strong></label>\n\n        &nbsp;&nbsp;&nbsp;&nbsp;\n        <label id=\"h_gender\">Gender: <strong id=\"gender\" class=\"text-warning\" *ngFor=\"let referedFile of referedFiles\">{{ referedFile.gender }}</strong></label> <br>\n\n        <label id=\"l_signs\" class=\"mt-1\"><strong>Signs & Symptoms</strong></label> <br>\n        <textarea id=\"t_signs\" type=\"text\" class=\"rounded\" name=\"signs\" class=\"form-control form-control-sm\" cols=\"40\" rows=\"3\" placeholder=\"Type signs and symptoms here\" readonly=\"readonly\" (keyup)=\"signKeyup()\" *ngFor=\"let referedFile of referedFiles\" required>{{ referedFile.signs }}</textarea> <br>\n\n        <label id=\"l_tests\" class=\"mt-1\"><strong>Tests / Xray</strong></label> <br>\n        <textarea id=\"t_tests\" class=\"rounded\" name=\"tests\" class=\"form-control form-control-sm\" cols=\"40\" rows=\"3\" placeholder=\"Type tests/xray here\" readonly=\"readonly\" (keyup)=\"testKeyup()\" *ngFor=\"let referedFile of referedFiles\">{{ referedFile.tests }}</textarea> <br>\n\n        <label id=\"l_testsResults\" class=\"mt-1\"><strong>Tests / Xray Results</strong></label> <br>\n        <textarea id=\"t_testsResults\" class=\"rounded\" name=\"results\"  class=\"form-control form-control-sm\" cols=\"40\" rows=\"3\" placeholder=\"Read Only\" readonly=\"readonly\" *ngFor=\"let referedFile of referedFiles\">{{ referedFile.results }}</textarea> <br>\n\n        <label id=\"l_dx\" class=\"mt-1\"><strong>Diagnosis</strong></label> <br>\n        <textarea id=\"t_dx\" class=\"rounded\" cols=\"40\" name=\"dx\" [(ngModel)]=\"exam2.dx\" rows=\"3\" class=\"form-control form-control-sm\" placeholder=\"Type diagnosis here\" [readonly]=\"dxReadonly\" (keyup)=\"dxxKeyup()\" *ngFor=\"let referedFile of referedFiles\">{{ referedFile.dx }}</textarea> <br>\n\n        <button id=\"btn_ToPharmacy\" type=\"button\" (click)=\"toPharm(); examination_form2.reset()\" class=\"btn btn-sm btn-success m-3\" [disabled]=\"topharmDisabled\"> To Pharmacy </button>\n\n        <hr>\n\n</form>\n\n\n<!------------------------------------------------------------>\n\n    <form id=\"to_exam_form\" class=\"form ml-auto rounded\">\n\n        <h4><strong>Patients from Lab</strong></h4>\n        <ol >\n\n            <li id=\"listLab\" *ngFor=\"let labPatient of labPatients\" (click)=\"openLabFile(labPatient.patientNo)\">\n                \n                {{labPatient.name}} : {{labPatient.patientNo}}\n\n            </li>\n            \n        </ol>\n        <hr>\n        <h4><strong>Patients from Xray</strong></h4>\n        \n        <ol >\n\n            <li id=\"listXray\" *ngFor=\"let xrayPatient of xrayPatients\" (click)=\"openXrayFile(xrayPatient.patientNo)\">\n                \n                {{xrayPatient.name}} : {{xrayPatient.patientNo}}\n\n            </li>\n            \n        </ol>       \n\n    </form>\n\n<!------------------------------------------------------------>\n\n\n\n</div>"

/***/ }),

/***/ "./src/app/clinician/examination/examination.component.scss":
/*!******************************************************************!*\
  !*** ./src/app/clinician/examination/examination.component.scss ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\n.card-deck {\n  margin: 1em 0 0 0; }\n.card-deck form {\n    background-color: #4a5d68;\n    padding: 1em 2em 0 2em;\n    margin: 0 1em 1em 1em;\n    height: 0%;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\n.card-deck form h1 {\n      font-size: 20px;\n      font-weight: bold;\n      color: #e8491d;\n      text-shadow: 5px 5px 3px black; }\n.card-deck form h4 {\n      font-size: 12px;\n      font-weight: bold; }\n.card-deck form ol li {\n      color: #17a2b8; }\n.card-deck form ol li:hover {\n      cursor: pointer;\n      color: #ffc107;\n      font-weight: bold; }\n.card-deck form #h_name, .card-deck form #h_age, .card-deck form #h_gender, .card-deck form #l_signs, .card-deck form #l_tests, .card-deck form #l_testsResults, .card-deck form #l_dx {\n      text-transform: capitalize;\n      font-size: 13px;\n      color: #000000; }\n.card-deck form textarea {\n      color: black;\n      background-color: #97a9b4;\n      border: none;\n      border-radius: 1em; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpbmljaWFuL2V4YW1pbmF0aW9uL0M6XFxUaGVDb2RlXFxtZWFuQXBwUmF3XFxraW1zYXBwL3NyY1xcYXBwXFxjbGluaWNpYW5cXGV4YW1pbmF0aW9uXFxleGFtaW5hdGlvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBOENBO0VBQ0ksaUJBQWlCLEVBQUE7QUFEckI7SUFJUSx5QkF0Q3VCO0lBdUN2QixzQkFBc0I7SUFDdEIscUJBQXFCO0lBQ3JCLFVBQVU7SUFDViwwQ0FBeUMsRUFBQTtBQVJqRDtNQVdZLGVBQWU7TUFDZixpQkFBaUI7TUFDakIsY0F0RFM7TUF1RFQsOEJBQXlDLEVBQUE7QUFkckQ7TUFpQlksZUFBZTtNQUNmLGlCQUFpQixFQUFBO0FBbEI3QjtNQXNCZ0IsY0FsREMsRUFBQTtBQTRCakI7TUF5QmdCLGVBQWU7TUFDZixjQXJESTtNQXNESixpQkFBaUIsRUFBQTtBQTNCakM7TUErQlksMEJBQTBCO01BQzFCLGVBQWU7TUFDZixjQUFjLEVBQUE7QUFqQzFCO01BcUNZLFlBQVk7TUFDWix5QkF2RW9CO01Bd0VwQixZQUFZO01BQ1osa0JBQWtCLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9jbGluaWNpYW4vZXhhbWluYXRpb24vZXhhbWluYXRpb24uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0gR2xvYmFsIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLyogQnJlYWtwb2ludHM6IHhzOiAwLCAgc206IDU3NnB4OyBtZDogNzY4cHg7IGxnOiA5OTJweDsgeGw6IDEyMDBweDsgKi9cclxuXHJcbiRjb2xvcnM6IChcclxuICAgIGJnOiAjYzBjMGMwLFxyXG4gICAgdGhlbWU6IGhzbCgyMDMsIDE3JSwgMjUlKSxcclxuICAgIGZldm9yaXRlOiAjZTg0OTFkLFxyXG4gICAgc2hvdyA6IGRhcmtlbiggI2ZmYzEwNywgMTAlKSxcclxuICAgIHByaW1hcnk6ICMwMDdiZmYsXHJcbiAgICBwcmltYXJ5LWxpZ2h0OiBsaWdodGVuKCMwMDVERkYsIDQwJSksXHJcbiAgICBwcmltYXJ5LWRhcms6IGRhcmtlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgYWNjZW50OiAjRkZGNkJCLFxyXG4gICAgZ2lybGlzaDogcmdiKDE5NSwgMTUsIDIwMSksXHJcbiAgICBmb3JtOiBsaWdodGVuKCMzNTQyNGEsIDEwJSksXHJcbiAgICBpbnB1dDogbGlnaHRlbigjMzU0MjRhLCA0MCUpLFxyXG4gICAgZ3JheTogIzZjNzU3ZCxcclxuICAgIGdyYXktZGFyazogIzM0M2E0MCxcclxuICAgIHNlY29uZGFyeTogIzZjNzU3ZCxcclxuICAgIHN1Y2Nlc3M6ICMyOGE3NDUsXHJcbiAgICBpbmZvOiAjMTdhMmI4LFxyXG4gICAgd2FybmluZzogI2ZmYzEwNyxcclxuICAgIGRhbmdlcjogI2RjMzU0NSxcclxuICAgIGxpZ2h0OiAjZjhmOWZhLFxyXG4gICAgZGFyazogIzM0M2E0MFxyXG5cclxuKTtcclxuXHJcbkBmdW5jdGlvbiBjb2xvcigkY29sb3ItbmFtZSl7XHJcbiAgICBAcmV0dXJuIG1hcC1nZXQoJGNvbG9ycyAsICRjb2xvci1uYW1lKVxyXG59XHJcblxyXG4kZGVza3RvcDogNzY4cHg7XHJcbiRkZXNrdG9wX3NtOiAzNjRweDtcclxuJG9wYWNpdHk6IC45O1xyXG5cclxuQG1peGluIGRlc2t0b3Bfc20ge1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3Bfc219KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5AbWl4aW4gZGVza3RvcCB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcH0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcbi5jYXJkLWRlY2sge1xyXG4gICAgbWFyZ2luOiAxZW0gMCAwIDA7XHJcbiAgICAgICAgXHJcbiAgICBmb3Jte1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZvcm0pO1xyXG4gICAgICAgIHBhZGRpbmc6IDFlbSAyZW0gMCAyZW07XHJcbiAgICAgICAgbWFyZ2luOiAwIDFlbSAxZW0gMWVtO1xyXG4gICAgICAgIGhlaWdodDogMCU7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuMyk7XHJcblxyXG4gICAgICAgIGgxe1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDIwcHg7XHJcbiAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICBjb2xvcjogY29sb3IoZmV2b3JpdGUpO1xyXG4gICAgICAgICAgICB0ZXh0LXNoYWRvdzogNXB4IDVweCAzcHggcmdiYSgwLCAwLCAwLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaDR7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9se1xyXG4gICAgICAgICAgICBsaXtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcihpbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsaTpob3ZlcntcclxuICAgICAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcih3YXJuaW5nKTtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICNoX25hbWUsICNoX2FnZSwgI2hfZ2VuZGVyLCAjbF9zaWducywgI2xfdGVzdHMsICNsX3Rlc3RzUmVzdWx0cywgI2xfZHgge1xyXG4gICAgICAgICAgICB0ZXh0LXRyYW5zZm9ybTogY2FwaXRhbGl6ZTtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxM3B4O1xyXG4gICAgICAgICAgICBjb2xvcjogIzAwMDAwMDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRleHRhcmVhe1xyXG4gICAgICAgICAgICBjb2xvcjogYmxhY2s7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGlucHV0KTtcclxuICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICBib3JkZXItcmFkaXVzOiAxZW07XHJcbiAgICAgICAgfVxyXG4gICAgXHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/clinician/examination/examination.component.ts":
/*!****************************************************************!*\
  !*** ./src/app/clinician/examination/examination.component.ts ***!
  \****************************************************************/
/*! exports provided: ExaminationComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExaminationComponent", function() { return ExaminationComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/files.service */ "./src/app/services/files.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var ExaminationComponent = /** @class */ (function () {
    function ExaminationComponent(filesService, notifyService) {
        this.filesService = filesService;
        this.notifyService = notifyService;
        this.admittedPatients = [];
        this.labPatients = [];
        this.xrayPatients = [];
        this.openedFiles = [];
        this.referedFiles = [];
        this.hideFormONE = false;
        this.hideFormTWO = true;
        this.signReadonly = true;
        this.testReadonly = true;
        this.dxReadonly = true;
        this.deleteDisabled = true;
        this.tolabDisabled = true;
        this.toxrayDisabled = true;
        this.topharmacyDisabled = true;
        this.topharmDisabled = true;
    }
    ExaminationComponent.prototype.ngOnInit = function () {
        var _this = this;
        // List patients from Admission
        this.filesService.listAdmitPatient().subscribe(function (data) { _this.admittedPatients = data; }, function (error) { console.error("Error", error); });
        // List patients from lab functions
        this.filesService.listPatientfromLab().subscribe(function (data) { _this.labPatients = data; }, function (error) { console.error("Error", error); });
        // List patients from xray functions
        this.filesService.listPatientfromXray().subscribe(function (data) { _this.xrayPatients = data; }, function (error) { console.error("Error", error); });
        // page Reload function
        this.filesService.examinationReload().subscribe(
        // Do Nothing
        );
        //Update Exam Form
        this.filesService.updateExamForm().subscribe(function (data) {
            _this.openedFiles = data;
            _this.referedFiles = data;
        }, function (error) { console.error("Error", error); });
        // define captured data
        this.exam = {
            signs: "",
            tests: "",
            results: "",
            dx: ""
        };
        this.exam2 = {
            dx: ""
        };
    };
    //=== Opening admission file ===
    ExaminationComponent.prototype.openAdmFile = function (id) {
        var _this = this;
        var patientNo = { patientNo: id };
        this.filesService.openAdmFile(patientNo).subscribe(function (data) {
            _this.hideFormONE = false;
            _this.hideFormTWO = true;
            _this.signReadonly = false;
            _this.deleteDisabled = false;
            _this.notifyService.showInfo("File from Admission Opened !", "Info..");
        }, function (error) {
            console.log("Error", error);
            _this.notifyService.showWarning(error.error, "Warnning!");
        });
    };
    //==== Change in Sign Area function ======
    ExaminationComponent.prototype.signKeyup = function () {
        this.testReadonly = false;
        this.dxReadonly = false;
        this.deleteDisabled = true;
    };
    ;
    //==== Change in Sign Area function ======
    ExaminationComponent.prototype.testKeyup = function () {
        this.dxReadonly = true;
        this.tolabDisabled = false;
        this.toxrayDisabled = false;
    };
    ;
    //==== Change in Dx Area function ======
    ExaminationComponent.prototype.dxKeyup = function () {
        this.testReadonly = true;
        this.signReadonly = true;
        this.deleteDisabled = true;
        this.tolabDisabled = true;
        this.toxrayDisabled = true;
        this.topharmacyDisabled = false;
    };
    ;
    ExaminationComponent.prototype.dxxKeyup = function () {
        this.topharmDisabled = false;
    };
    ;
    // ==== Delete File =======
    ExaminationComponent.prototype.delete = function () {
        var _this = this;
        this.filesService.deleteFile().subscribe(function (data) { _this.notifyService.showSuccess("File deleted!", "Success"); }, function (error) { console.log(error, "Error!"); });
    };
    // ==== to Lab =========
    ExaminationComponent.prototype.toLab = function () {
        var _this = this;
        this.filesService.tolab(this.exam).subscribe(function (data) { _this.notifyService.showSuccess("Sent To Lab..", "Success !"); }, function (error) { console.log(error, "Error!"); });
    };
    //=== Opening Lab file ===
    ExaminationComponent.prototype.openLabFile = function (id) {
        var _this = this;
        var patientNo = { patientNo: id };
        this.filesService.openFilefromLab(patientNo).subscribe(function (data) {
            _this.hideFormONE = true;
            _this.hideFormTWO = false;
            _this.signReadonly = true;
            _this.testReadonly = true;
            _this.dxReadonly = false;
            _this.deleteDisabled = true;
            _this.tolabDisabled = true;
            _this.toxrayDisabled = true;
            _this.notifyService.showInfo(" File from Lab Opened !", "Info..");
        }, function (error) {
            console.log("Error", error);
            _this.notifyService.showWarning(error.error, "Warnning!");
        });
    };
    // ==== To Xray =========
    ExaminationComponent.prototype.toXray = function () {
        var _this = this;
        this.filesService.toxray(this.exam).subscribe(function (data) { _this.notifyService.showSuccess("Sent To Xray.", "Success !"); }, function (error) { console.log(error, "Error!"); });
    };
    //=== Opening Xray file ===
    ExaminationComponent.prototype.openXrayFile = function (id) {
        var _this = this;
        var patientNo = { patientNo: id };
        this.filesService.openFilefromXray(patientNo).subscribe(function (data) {
            _this.hideFormONE = true;
            _this.hideFormTWO = false;
            _this.signReadonly = true;
            _this.testReadonly = true;
            _this.dxReadonly = false;
            _this.deleteDisabled = true;
            _this.tolabDisabled = true;
            _this.toxrayDisabled = true;
            _this.notifyService.showInfo(" File from Xray Opened !", "Info..");
        }, function (error) {
            console.log("Error", error);
            _this.notifyService.showWarning(error.error, "Warnning!");
        });
    };
    // ==== To Pharmacy =========
    ExaminationComponent.prototype.toPharmacy = function () {
        var _this = this;
        this.filesService.topharmacy(this.exam).subscribe(function (data) { _this.notifyService.showSuccess("Sent To Pharmacy..", "Success !"); }, function (error) { console.log(error, "Error!"); });
    };
    ExaminationComponent.prototype.toPharm = function () {
        var _this = this;
        this.filesService.topharm(this.exam2).subscribe(function (data) { _this.notifyService.showSuccess("Sent To Pharmacy..", "Success !"); }, function (error) { console.log(error, "Error!"); });
    };
    ExaminationComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-examination',
            template: __webpack_require__(/*! ./examination.component.html */ "./src/app/clinician/examination/examination.component.html"),
            styles: [__webpack_require__(/*! ./examination.component.scss */ "./src/app/clinician/examination/examination.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__["FilesService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], ExaminationComponent);
    return ExaminationComponent;
}());



/***/ }),

/***/ "./src/app/clinician/laboratory/laboratory.component.html":
/*!****************************************************************!*\
  !*** ./src/app/clinician/laboratory/laboratory.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"card-deck\">\n\n    <form id=\"exam_lab_form\" class=\"form rounded  \">\n\n        <h4><strong>Patients from Examination</strong></h4>\n        <hr>\n        <ol >\n\n            <li *ngFor=\"let labPatient of labPatients\" (click)=\"openLabFile(labPatient.patientNo)\">\n                \n                {{labPatient.name}} : {{labPatient.patientNo}}\n\n            </li>\n            \n        </ol>             \n\n    </form>\n\n\n    <form id=\"lab_form\" #lab_form=\"ngForm\" class=\"form mx-auto rounded\" (ngSubmit)=\"onSubmit(); lab_form.reset()\" >\n\n            <h1><strong>Laboratory Form</strong></h1>\n            \n            <hr>\n           \n            <label id=\"h_name\">Name: <strong id=\"lab_name\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.name }}</strong></label> <br>\n\n            <label id=\"h_patientNo\">PatientNo: <strong id=\"lab_patientNo\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.patientNo }}</strong></label>\n\n            &nbsp;&nbsp;&nbsp;\n            <label id=\"h_age\">Age: <strong id=\"lab_age\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.age }}</strong></label>\n\n            &nbsp;&nbsp;&nbsp;&nbsp;\n            <label id=\"h_gender\">Gender: <strong id=\"lab_gender\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.gender }}</strong></label> <br>\n\n            <label id=\"l_signs\" class=\"mt-1\"><strong>Signs & Symptoms</strong></label> <br>\n            <textarea id=\"lab_t_signs\" name=\"signs\" class=\"form-control form-control-sm\" cols=\"40\" rows=\"3\" placeholder=\"Type signs and symptoms here\" *ngFor=\"let openedFile of openedFiles\" readonly=\"readonly\">{{ openedFile.signs }}</textarea> <br>\n\n            <label id=\"l_tests\" class=\"mt-1\"><strong>Tests</strong></label> <br>\n            <textarea id=\"lab_t_tests\"  class=\"form-control form-control-sm\" name=\"tests\" cols=\"40\" rows=\"3\" placeholder=\"Type tests here\" *ngFor=\"let openedFile of openedFiles\" readonly=\"readonly\">{{ openedFile.tests }}</textarea> <br>\n\n            <label id=\"l_testsResults\" class=\"mt-1\"><strong>Tests' Results</strong></label> <br>\n            <textarea id=\"lab_t_testsResults\" [(ngModel)]=\"lab.results\" class=\"form-control form-control-sm\" name=\"results\" cols=\"40\" rows=\"3\" placeholder=\"Type tests results here\" *ngFor=\"let openedFile of openedFiles\" (keyup)=\"resultKeyup()\">{{ openedFile.results }}</textarea> <br>\n\n            \n\n            <button id=\"btn_LabToExam\" type=\"submit\" class=\"btn btn-sm btn-warning m-3\" [disabled]=\"toExamDisabled\"> To Examination </button>\n\n            \n\n            <hr>\n\n    </form>\n\n\n\n\n\n</div>\n"

/***/ }),

/***/ "./src/app/clinician/laboratory/laboratory.component.scss":
/*!****************************************************************!*\
  !*** ./src/app/clinician/laboratory/laboratory.component.scss ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\n.card-deck {\n  margin: 1em 0 0 0; }\n.card-deck form {\n    background-color: #4a5d68;\n    padding: 1em 2em 0 2em;\n    margin: 0 1em 1em 1em;\n    height: 0%;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\n.card-deck form h1 {\n      font-size: 20px;\n      font-weight: bold;\n      color: #e8491d;\n      text-shadow: 5px 5px 3px black; }\n.card-deck form h4 {\n      font-size: 12px;\n      font-weight: bold; }\n.card-deck form ol li {\n      color: #17a2b8; }\n.card-deck form ol li:hover {\n      cursor: pointer;\n      color: #ffc107;\n      font-weight: bold; }\n.card-deck form #h_name, .card-deck form #h_age, .card-deck form #h_gender, .card-deck form #l_signs, .card-deck form #l_tests, .card-deck form #l_testsResults, .card-deck form #l_dx {\n      text-transform: capitalize;\n      font-size: 13px;\n      color: #000000; }\n.card-deck form textarea {\n      color: black;\n      background-color: #97a9b4;\n      border: none;\n      border-radius: 1em; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpbmljaWFuL2xhYm9yYXRvcnkvQzpcXFRoZUNvZGVcXG1lYW5BcHBSYXdcXGtpbXNhcHAvc3JjXFxhcHBcXGNsaW5pY2lhblxcbGFib3JhdG9yeVxcbGFib3JhdG9yeS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBNENBO0VBQ0ksaUJBQWlCLEVBQUE7QUFEckI7SUFJUSx5QkF0Q3VCO0lBdUN2QixzQkFBc0I7SUFDdEIscUJBQXFCO0lBQ3JCLFVBQVU7SUFDViwwQ0FBeUMsRUFBQTtBQVJqRDtNQVlZLGVBQWU7TUFDZixpQkFBaUI7TUFDakIsY0F0RFM7TUF1RFQsOEJBQXlDLEVBQUE7QUFmckQ7TUFrQlksZUFBZTtNQUNmLGlCQUFpQixFQUFBO0FBbkI3QjtNQXVCZ0IsY0FuREMsRUFBQTtBQTRCakI7TUEwQmdCLGVBQWU7TUFDZixjQXRESTtNQXVESixpQkFBaUIsRUFBQTtBQTVCakM7TUFnQ1ksMEJBQTBCO01BQzFCLGVBQWU7TUFDZixjQUFjLEVBQUE7QUFsQzFCO01BcUNZLFlBQVk7TUFDWix5QkF2RW9CO01Bd0VwQixZQUFZO01BQ1osa0JBQWtCLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9jbGluaWNpYW4vbGFib3JhdG9yeS9sYWJvcmF0b3J5LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tIEdsb2JhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qIEJyZWFrcG9pbnRzOiB4czogMCwgIHNtOiA1NzZweDsgbWQ6IDc2OHB4OyBsZzogOTkycHg7IHhsOiAxMjAwcHg7ICovXHJcblxyXG4kY29sb3JzOiAoXHJcbiAgICBiZzogI2MwYzBjMCxcclxuICAgIGZldm9yaXRlOiAjZTg0OTFkLFxyXG4gICAgcHJpbWFyeTogIzAwN2JmZixcclxuICAgIHByaW1hcnktbGlnaHQ6IGxpZ2h0ZW4oIzAwNURGRiwgNDAlKSxcclxuICAgIHByaW1hcnktZGFyazogZGFya2VuKCMwMDVERkYsIDQwJSksXHJcbiAgICBhY2NlbnQ6ICNGRkY2QkIsXHJcbiAgICBnaXJsaXNoOiByZ2IoMTk1LCAxNSwgMjAxKSxcclxuICAgIGZvcm06IGxpZ2h0ZW4oIzM1NDI0YSwgMTAlKSxcclxuICAgIGlucHV0OiBsaWdodGVuKCMzNTQyNGEsIDQwJSksXHJcbiAgICBncmF5OiAjNmM3NTdkLFxyXG4gICAgZ3JheS1kYXJrOiAjMzQzYTQwLFxyXG4gICAgc2Vjb25kYXJ5OiAjNmM3NTdkLFxyXG4gICAgc3VjY2VzczogIzI4YTc0NSxcclxuICAgIGluZm86ICMxN2EyYjgsXHJcbiAgICB3YXJuaW5nOiAjZmZjMTA3LFxyXG4gICAgZGFuZ2VyOiAjZGMzNTQ1LFxyXG4gICAgbGlnaHQ6ICNmOGY5ZmEsXHJcbiAgICBkYXJrOiAjMzQzYTQwXHJcblxyXG4pO1xyXG5cclxuQGZ1bmN0aW9uIGNvbG9yKCRjb2xvci1uYW1lKXtcclxuICAgIEByZXR1cm4gbWFwLWdldCgkY29sb3JzICwgJGNvbG9yLW5hbWUpXHJcbn1cclxuXHJcbiRkZXNrdG9wOiA3NjhweDtcclxuJGRlc2t0b3Bfc206IDM2NHB4O1xyXG4kb3BhY2l0eTogLjk7XHJcblxyXG5AbWl4aW4gZGVza3RvcF9zbSB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcF9zbX0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcbkBtaXhpbiBkZXNrdG9wIHtcclxuICAgIEBtZWRpYSAobWluLXdpZHRoOiAjeyRkZXNrdG9wfSkge1xyXG4gICAgICAgIEBjb250ZW50O1xyXG4gICAgfSBcclxufVxyXG5cclxuLmNhcmQtZGVjayB7XHJcbiAgICBtYXJnaW46IDFlbSAwIDAgMDtcclxuICAgICAgICBcclxuICAgIGZvcm17XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IoZm9ybSk7XHJcbiAgICAgICAgcGFkZGluZzogMWVtIDJlbSAwIDJlbTtcclxuICAgICAgICBtYXJnaW46IDAgMWVtIDFlbSAxZW07XHJcbiAgICAgICAgaGVpZ2h0OiAwJTtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgaDF7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoNHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2x7XHJcbiAgICAgICAgICAgIGxpe1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpOmhvdmVye1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKHdhcm5pbmcpO1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgI2hfbmFtZSwgI2hfYWdlLCAjaF9nZW5kZXIsICNsX3NpZ25zLCAjbF90ZXN0cywgI2xfdGVzdHNSZXN1bHRzLCAjbF9keCB7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjMDAwMDAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0YXJlYXtcclxuICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcihpbnB1dCk7XHJcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMWVtO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgfVxyXG5cclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/clinician/laboratory/laboratory.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/clinician/laboratory/laboratory.component.ts ***!
  \**************************************************************/
/*! exports provided: LaboratoryComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LaboratoryComponent", function() { return LaboratoryComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/files.service */ "./src/app/services/files.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var LaboratoryComponent = /** @class */ (function () {
    function LaboratoryComponent(filesService, notifyService) {
        this.filesService = filesService;
        this.notifyService = notifyService;
        this.labPatients = [];
        this.openedFiles = [];
        this.toExamDisabled = true;
    }
    LaboratoryComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Lab List patients function
        this.filesService.listLabPatient().subscribe(function (data) { _this.labPatients = data; }, function (error) { console.error("Error", error); });
        // page Reload function
        this.filesService.labReload().subscribe(
        // Do Nothing
        );
        //Update Lab Form
        this.filesService.updateLabForm().subscribe(function (data) { _this.openedFiles = data; }, function (error) { console.error("Error", error); });
        // define captured data
        this.lab = {
            results: "",
        };
    };
    //=== Opening Lab file ===
    LaboratoryComponent.prototype.openLabFile = function (id) {
        var _this = this;
        var patientNo = { patientNo: id };
        this.filesService.openLabFile(patientNo).subscribe(function (data) { _this.notifyService.showInfo("File Opened !", "Info.."); }, function (error) {
            console.log("Error", error);
            _this.notifyService.showWarning(error.error, "Warnning!");
        });
    };
    //==== Change in Results Area function ======
    LaboratoryComponent.prototype.resultKeyup = function () {
        this.toExamDisabled = false;
    };
    ;
    // ==== Back to Examination =========
    LaboratoryComponent.prototype.onSubmit = function () {
        var _this = this;
        this.filesService.labToExam(this.lab).subscribe(function (data) { _this.notifyService.showSuccess("Sent Back To Exam..", "Success !"); }, function (error) { console.log(error, "Error!"); });
    };
    LaboratoryComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-laboratory',
            template: __webpack_require__(/*! ./laboratory.component.html */ "./src/app/clinician/laboratory/laboratory.component.html"),
            styles: [__webpack_require__(/*! ./laboratory.component.scss */ "./src/app/clinician/laboratory/laboratory.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__["FilesService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], LaboratoryComponent);
    return LaboratoryComponent;
}());



/***/ }),

/***/ "./src/app/clinician/pharmacy/pharmacy.component.html":
/*!************************************************************!*\
  !*** ./src/app/clinician/pharmacy/pharmacy.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"card-deck\">\n\n    <form id=\"exam_pharm_form\" class=\"form rounded  \">\n\n        <h4><strong>Patients from Examination</strong></h4>\n        <hr>\n        <ol >\n\n            <li *ngFor=\"let pharmacyPatient of pharmacyPatients\" (click)=\"openPharmacyFile(pharmacyPatient.patientNo)\">\n                \n                {{pharmacyPatient.name}} : {{pharmacyPatient.patientNo}}\n\n            </li>\n            \n        </ol>              \n\n    </form>\n\n\n    <form id=\"pharm_form\" #pharm_form=\"ngForm\" class=\"form mx-auto rounded\" (ngSubmit)=\"onSubmit()\">\n\n            <h1><strong>Pharmacy Form</strong></h1>\n            \n            <hr>\n           \n            <label id=\"h_name\">Name: <strong id=\"pham_name\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.name }}</strong></label> <br>\n\n            <label id=\"h_patientNo\">PatientNo: <strong id=\"pham_patientNo\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.patientNo }}</strong></label>\n            &nbsp;&nbsp;&nbsp;\n            <label id=\"h_age\">Age: <strong id=\"pham_age\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.age }}</strong></label>\n\n            &nbsp;&nbsp;&nbsp;&nbsp;\n            <label id=\"h_gender\">Gender: <strong id=\"pham_gender\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.gender }}</strong></label> <br>\n\n            <label id=\"l_signs\" class=\"mt-1\"><strong>Signs & Symptoms</strong></label> <br>\n            <textarea id=\"pham_t_signs\" class=\"form-control form-control-sm\" name=\"signs\" cols=\"40\" rows=\"3\" placeholder=\"Type signs and symptoms here\" *ngFor=\"let openedFile of openedFiles\" readonly=\"readonly\">{{ openedFile.signs }}</textarea> <br>\n\n            <label id=\"l_tests\" class=\"mt-1\"><strong>Tests</strong></label> <br>\n            <textarea id=\"pham_t_tests\" class=\"form-control form-control-sm\" name=\"tests\" cols=\"40\" rows=\"3\" placeholder=\"Type tests here\" *ngFor=\"let openedFile of openedFiles\" readonly=\"readonly\">{{ openedFile.tests }}</textarea> <br>\n\n            <label id=\"l_testsResults\" class=\"mt-1\"><strong>Tests' Results</strong></label> <br>\n            <textarea id=\"pham_t_testsResults\" class=\"form-control form-control-sm\" name=\"results\" cols=\"40\" rows=\"3\" placeholder=\"Type tests here\" *ngFor=\"let openedFile of openedFiles\" readonly=\"readonly\">{{ openedFile.results }}</textarea> <br>\n\n            <label id=\"l_dx\" class=\"mt-1\"><strong>Diagnosis</strong></label> <br>\n            <textarea id=\"pham_t_dx\" class=\"form-control form-control-sm\" cols=\"40\" name=\"dx\" rows=\"3\" placeholder=\"Type diagnosis here\" *ngFor=\"let openedFile of openedFiles\" readonly=\"readonly\">{{ openedFile.dx }}</textarea> <br>          \n\n            <button id=\"btn_save\" type=\"submit\" class=\"btn btn-sm btn-success m-3\" [disabled]=\"saveDisabled\"> Save File </button>\n\n            \n\n            <hr>\n\n    </form>\n\n\n\n\n\n</div>\n"

/***/ }),

/***/ "./src/app/clinician/pharmacy/pharmacy.component.scss":
/*!************************************************************!*\
  !*** ./src/app/clinician/pharmacy/pharmacy.component.scss ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\n.card-deck {\n  margin: 1em 0 0 0; }\n.card-deck form {\n    background-color: #4a5d68;\n    padding: 1em 2em 0 2em;\n    margin: 0 1em 1em 1em;\n    height: 0%;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\n.card-deck form h1 {\n      font-size: 20px;\n      font-weight: bold;\n      color: #e8491d;\n      text-shadow: 5px 5px 3px black; }\n.card-deck form h4 {\n      font-size: 12px;\n      font-weight: bold; }\n.card-deck form ol li {\n      color: #17a2b8; }\n.card-deck form ol li:hover {\n      cursor: pointer;\n      color: #ffc107;\n      font-weight: bold; }\n.card-deck form #h_name, .card-deck form #h_age, .card-deck form #h_gender, .card-deck form #l_signs, .card-deck form #l_tests, .card-deck form #l_testsResults, .card-deck form #l_dx {\n      text-transform: capitalize;\n      font-size: 13px;\n      color: #000000; }\n.card-deck form textarea {\n      color: black;\n      background-color: #97a9b4;\n      border: none;\n      border-radius: 1em; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpbmljaWFuL3BoYXJtYWN5L0M6XFxUaGVDb2RlXFxtZWFuQXBwUmF3XFxraW1zYXBwL3NyY1xcYXBwXFxjbGluaWNpYW5cXHBoYXJtYWN5XFxwaGFybWFjeS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBNENBO0VBQ0ksaUJBQWlCLEVBQUE7QUFEckI7SUFLUSx5QkF2Q3VCO0lBd0N2QixzQkFBc0I7SUFDdEIscUJBQXFCO0lBQ3JCLFVBQVU7SUFDViwwQ0FBeUMsRUFBQTtBQVRqRDtNQWNZLGVBQWU7TUFDZixpQkFBaUI7TUFDakIsY0F4RFM7TUF5RFQsOEJBQXlDLEVBQUE7QUFqQnJEO01Bb0JZLGVBQWU7TUFDZixpQkFBaUIsRUFBQTtBQXJCN0I7TUF5QmdCLGNBckRDLEVBQUE7QUE0QmpCO01BNEJnQixlQUFlO01BQ2YsY0F4REk7TUF5REosaUJBQWlCLEVBQUE7QUE5QmpDO01Ba0NZLDBCQUEwQjtNQUMxQixlQUFlO01BQ2YsY0FBYyxFQUFBO0FBcEMxQjtNQXVDWSxZQUFZO01BQ1oseUJBekVvQjtNQTBFcEIsWUFBWTtNQUNaLGtCQUFrQixFQUFBIiwiZmlsZSI6InNyYy9hcHAvY2xpbmljaWFuL3BoYXJtYWN5L3BoYXJtYWN5LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tIEdsb2JhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qIEJyZWFrcG9pbnRzOiB4czogMCwgIHNtOiA1NzZweDsgbWQ6IDc2OHB4OyBsZzogOTkycHg7IHhsOiAxMjAwcHg7ICovXHJcblxyXG4kY29sb3JzOiAoXHJcbiAgICBiZzogI2MwYzBjMCxcclxuICAgIGZldm9yaXRlOiAjZTg0OTFkLFxyXG4gICAgcHJpbWFyeTogIzAwN2JmZixcclxuICAgIHByaW1hcnktbGlnaHQ6IGxpZ2h0ZW4oIzAwNURGRiwgNDAlKSxcclxuICAgIHByaW1hcnktZGFyazogZGFya2VuKCMwMDVERkYsIDQwJSksXHJcbiAgICBhY2NlbnQ6ICNGRkY2QkIsXHJcbiAgICBnaXJsaXNoOiByZ2IoMTk1LCAxNSwgMjAxKSxcclxuICAgIGZvcm06IGxpZ2h0ZW4oIzM1NDI0YSwgMTAlKSxcclxuICAgIGlucHV0OiBsaWdodGVuKCMzNTQyNGEsIDQwJSksXHJcbiAgICBncmF5OiAjNmM3NTdkLFxyXG4gICAgZ3JheS1kYXJrOiAjMzQzYTQwLFxyXG4gICAgc2Vjb25kYXJ5OiAjNmM3NTdkLFxyXG4gICAgc3VjY2VzczogIzI4YTc0NSxcclxuICAgIGluZm86ICMxN2EyYjgsXHJcbiAgICB3YXJuaW5nOiAjZmZjMTA3LFxyXG4gICAgZGFuZ2VyOiAjZGMzNTQ1LFxyXG4gICAgbGlnaHQ6ICNmOGY5ZmEsXHJcbiAgICBkYXJrOiAjMzQzYTQwXHJcblxyXG4pO1xyXG5cclxuQGZ1bmN0aW9uIGNvbG9yKCRjb2xvci1uYW1lKXtcclxuICAgIEByZXR1cm4gbWFwLWdldCgkY29sb3JzICwgJGNvbG9yLW5hbWUpXHJcbn1cclxuXHJcbiRkZXNrdG9wOiA3NjhweDtcclxuJGRlc2t0b3Bfc206IDM2NHB4O1xyXG4kb3BhY2l0eTogLjk7XHJcblxyXG5AbWl4aW4gZGVza3RvcF9zbSB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcF9zbX0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcbkBtaXhpbiBkZXNrdG9wIHtcclxuICAgIEBtZWRpYSAobWluLXdpZHRoOiAjeyRkZXNrdG9wfSkge1xyXG4gICAgICAgIEBjb250ZW50O1xyXG4gICAgfSBcclxufVxyXG5cclxuLmNhcmQtZGVjayB7XHJcbiAgICBtYXJnaW46IDFlbSAwIDAgMDtcclxuXHJcbiAgICAgICAgXHJcbiAgICBmb3Jte1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZvcm0pO1xyXG4gICAgICAgIHBhZGRpbmc6IDFlbSAyZW0gMCAyZW07XHJcbiAgICAgICAgbWFyZ2luOiAwIDFlbSAxZW0gMWVtO1xyXG4gICAgICAgIGhlaWdodDogMCU7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuMyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgaDF7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoNHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2x7XHJcbiAgICAgICAgICAgIGxpe1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpOmhvdmVye1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKHdhcm5pbmcpO1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgI2hfbmFtZSwgI2hfYWdlLCAjaF9nZW5kZXIsICNsX3NpZ25zLCAjbF90ZXN0cywgI2xfdGVzdHNSZXN1bHRzLCAjbF9keCB7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjMDAwMDAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0YXJlYXtcclxuICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcihpbnB1dCk7XHJcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMWVtO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgfVxyXG5cclxufVxyXG4iXX0= */"

/***/ }),

/***/ "./src/app/clinician/pharmacy/pharmacy.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/clinician/pharmacy/pharmacy.component.ts ***!
  \**********************************************************/
/*! exports provided: PharmacyComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PharmacyComponent", function() { return PharmacyComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/files.service */ "./src/app/services/files.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var PharmacyComponent = /** @class */ (function () {
    function PharmacyComponent(filesService, notifyService) {
        this.filesService = filesService;
        this.notifyService = notifyService;
        this.pharmacyPatients = [];
        this.openedFiles = [];
        this.saveDisabled = true;
    }
    PharmacyComponent.prototype.ngOnInit = function () {
        var _this = this;
        // List Pharm Patients function
        this.filesService.listPharmacyPatient().subscribe(function (data) { _this.pharmacyPatients = data; }, function (error) { console.error("Error", error); });
        // page Reload function
        this.filesService.pharmacyReload().subscribe(
        // Do Nothing
        );
        //Update Pharmacy Form
        this.filesService.updatePharmacyForm().subscribe(function (data) { _this.openedFiles = data; }, function (error) { console.error("Error", error); });
    };
    //=== Opening Pharmacy file ===
    PharmacyComponent.prototype.openPharmacyFile = function (id) {
        var _this = this;
        var patientNo = { patientNo: id };
        this.filesService.openPharmacyFile(patientNo).subscribe(function (data) {
            _this.saveDisabled = false;
            _this.notifyService.showInfo("File Opened !", "Info..");
        }, function (error) {
            console.log("Error", error);
            _this.notifyService.showWarning(error.error, "Warnning!");
        });
    };
    // ==== Save File =========
    PharmacyComponent.prototype.onSubmit = function () {
        var _this = this;
        this.filesService.saveFile(this.save).subscribe(function (data) { _this.notifyService.showSuccess("File Saved..", "Success !"); }, function (error) { console.log(error, "Error!"); });
    };
    PharmacyComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-pharmacy',
            template: __webpack_require__(/*! ./pharmacy.component.html */ "./src/app/clinician/pharmacy/pharmacy.component.html"),
            styles: [__webpack_require__(/*! ./pharmacy.component.scss */ "./src/app/clinician/pharmacy/pharmacy.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__["FilesService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], PharmacyComponent);
    return PharmacyComponent;
}());



/***/ }),

/***/ "./src/app/clinician/xray/xray.component.html":
/*!****************************************************!*\
  !*** ./src/app/clinician/xray/xray.component.html ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"card-deck\">\n\n    <form id=\"exam_xray_form\" class=\"form rounded  \">\n\n        <h4><strong>Patients from Examination</strong></h4>\n        <hr>\n        <ol >\n\n            <li *ngFor=\"let xrayPatient of xrayPatients\" (click)=\"openXrayFile(xrayPatient.patientNo)\">\n                \n                {{xrayPatient.name}} : {{xrayPatient.patientNo}}\n\n            </li>\n            \n        </ol>              \n\n    </form>\n\n\n    <form id=\"xray_form\" #xray_form=\"ngForm\" class=\"form mx-auto rounded\" (ngSubmit)=\"onSubmit(); xray_form.reset()\">\n\n            <h1><strong>Xray Form</strong></h1>\n            \n            <hr>\n           \n            <label id=\"h_name\">Name: <strong id=\"xray_name\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.name }}</strong></label> <br>\n\n            <label id=\"h_patientNo\">PatientNo: <strong id=\"xray_patientNo\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.patientNo }}</strong></label>\n            &nbsp;&nbsp;&nbsp;\n            <label id=\"h_age\">Age: <strong id=\"xray_age\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.age }}</strong></label>\n\n            &nbsp;&nbsp;&nbsp;&nbsp;\n            <label id=\"h_gender\">Gender: <strong id=\"xray_gender\" class=\"text-warning\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.gender }}</strong></label> <br>\n\n            <label id=\"l_signs\" class=\"mt-1\"><strong>Signs & Symptoms</strong></label> <br>\n            <textarea id=\"xray_t_signs\"  class=\"form-control form-control-sm\" name=\"signs\" cols=\"40\" rows=\"3\" placeholder=\"Type signs and symptoms here\" readonly=\"readonly\"*ngFor=\"let openedFile of openedFiles\" >{{ openedFile.signs }}</textarea> <br>\n\n            <label id=\"l_tests\" class=\"mt-1\"><strong>Tests</strong></label> <br>\n            <textarea id=\"xray_t_tests\"  class=\"form-control form-control-sm\" name=\"tests\" cols=\"40\" rows=\"3\" placeholder=\"Type tests here\"readonly=\"readonly\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.tests }}</textarea> <br>\n\n            <label id=\"l_testsResults\" class=\"mt-1\"><strong>Tests' Results</strong></label> <br>\n            <textarea id=\"xray_t_testsResults\" [(ngModel)]=\"xray.results\" class=\"form-control form-control-sm\" name=\"results\" cols=\"40\" rows=\"3\" placeholder=\"Type tests here\" (keyup)=\"resultKeyup()\" *ngFor=\"let openedFile of openedFiles\" >{{ openedFile.results }}</textarea> <br>\n\n            \n\n            <button id=\"btn_XrayToExam\" type=\"submit\" class=\"btn btn-sm btn-primary m-3\" [disabled]=\"toExamDisabled\"> To Examination </button>\n\n            \n\n            <hr>\n\n    </form>\n\n\n\n\n\n</div>\n"

/***/ }),

/***/ "./src/app/clinician/xray/xray.component.scss":
/*!****************************************************!*\
  !*** ./src/app/clinician/xray/xray.component.scss ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\n.card-deck {\n  margin: 1em 0 0 0; }\n.card-deck form {\n    background-color: #4a5d68;\n    padding: 1em 2em 0 2em;\n    margin: 0 1em 1em 1em;\n    height: 0%;\n    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }\n.card-deck form h1 {\n      font-size: 20px;\n      font-weight: bold;\n      color: #e8491d;\n      text-shadow: 5px 5px 3px black; }\n.card-deck form h4 {\n      font-size: 12px;\n      font-weight: bold; }\n.card-deck form ol li {\n      color: #17a2b8; }\n.card-deck form ol li:hover {\n      cursor: pointer;\n      color: #ffc107;\n      font-weight: bold; }\n.card-deck form #h_name, .card-deck form #h_age, .card-deck form #h_gender, .card-deck form #l_signs, .card-deck form #l_tests, .card-deck form #l_testsResults, .card-deck form #l_dx {\n      text-transform: capitalize;\n      font-size: 13px;\n      color: #000000; }\n.card-deck form textarea {\n      color: black;\n      background-color: #97a9b4;\n      border: none;\n      border-radius: 1em; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY2xpbmljaWFuL3hyYXkvQzpcXFRoZUNvZGVcXG1lYW5BcHBSYXdcXGtpbXNhcHAvc3JjXFxhcHBcXGNsaW5pY2lhblxceHJheVxceHJheS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBNENBO0VBQ0ksaUJBQWlCLEVBQUE7QUFEckI7SUFJUSx5QkF0Q3VCO0lBdUN2QixzQkFBc0I7SUFDdEIscUJBQXFCO0lBQ3JCLFVBQVU7SUFDViwwQ0FBeUMsRUFBQTtBQVJqRDtNQWFZLGVBQWU7TUFDZixpQkFBaUI7TUFDakIsY0F2RFM7TUF3RFQsOEJBQXlDLEVBQUE7QUFoQnJEO01BbUJZLGVBQWU7TUFDZixpQkFBaUIsRUFBQTtBQXBCN0I7TUF3QmdCLGNBcERDLEVBQUE7QUE0QmpCO01BMkJnQixlQUFlO01BQ2YsY0F2REk7TUF3REosaUJBQWlCLEVBQUE7QUE3QmpDO01BaUNZLDBCQUEwQjtNQUMxQixlQUFlO01BQ2YsY0FBYyxFQUFBO0FBbkMxQjtNQXNDWSxZQUFZO01BQ1oseUJBeEVvQjtNQXlFcEIsWUFBWTtNQUNaLGtCQUFrQixFQUFBIiwiZmlsZSI6InNyYy9hcHAvY2xpbmljaWFuL3hyYXkveHJheS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qLS0tLS0tLS0tLS0tLS0tLS0tLSBHbG9iYWwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4vKiBCcmVha3BvaW50czogeHM6IDAsICBzbTogNTc2cHg7IG1kOiA3NjhweDsgbGc6IDk5MnB4OyB4bDogMTIwMHB4OyAqL1xyXG5cclxuJGNvbG9yczogKFxyXG4gICAgYmc6ICNjMGMwYzAsXHJcbiAgICBmZXZvcml0ZTogI2U4NDkxZCxcclxuICAgIHByaW1hcnk6ICMwMDdiZmYsXHJcbiAgICBwcmltYXJ5LWxpZ2h0OiBsaWdodGVuKCMwMDVERkYsIDQwJSksXHJcbiAgICBwcmltYXJ5LWRhcms6IGRhcmtlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgYWNjZW50OiAjRkZGNkJCLFxyXG4gICAgZ2lybGlzaDogcmdiKDE5NSwgMTUsIDIwMSksXHJcbiAgICBmb3JtOiBsaWdodGVuKCMzNTQyNGEsIDEwJSksXHJcbiAgICBpbnB1dDogbGlnaHRlbigjMzU0MjRhLCA0MCUpLFxyXG4gICAgZ3JheTogIzZjNzU3ZCxcclxuICAgIGdyYXktZGFyazogIzM0M2E0MCxcclxuICAgIHNlY29uZGFyeTogIzZjNzU3ZCxcclxuICAgIHN1Y2Nlc3M6ICMyOGE3NDUsXHJcbiAgICBpbmZvOiAjMTdhMmI4LFxyXG4gICAgd2FybmluZzogI2ZmYzEwNyxcclxuICAgIGRhbmdlcjogI2RjMzU0NSxcclxuICAgIGxpZ2h0OiAjZjhmOWZhLFxyXG4gICAgZGFyazogIzM0M2E0MFxyXG5cclxuKTtcclxuXHJcbkBmdW5jdGlvbiBjb2xvcigkY29sb3ItbmFtZSl7XHJcbiAgICBAcmV0dXJuIG1hcC1nZXQoJGNvbG9ycyAsICRjb2xvci1uYW1lKVxyXG59XHJcblxyXG4kZGVza3RvcDogNzY4cHg7XHJcbiRkZXNrdG9wX3NtOiAzNjRweDtcclxuJG9wYWNpdHk6IC45O1xyXG5cclxuQG1peGluIGRlc2t0b3Bfc20ge1xyXG4gICAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGRlc2t0b3Bfc219KSB7XHJcbiAgICAgICAgQGNvbnRlbnQ7XHJcbiAgICB9IFxyXG59XHJcblxyXG5AbWl4aW4gZGVza3RvcCB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcH0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcbi5jYXJkLWRlY2sge1xyXG4gICAgbWFyZ2luOiAxZW0gMCAwIDA7XHJcbiAgICAgICAgXHJcbiAgICBmb3Jte1xyXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGZvcm0pO1xyXG4gICAgICAgIHBhZGRpbmc6IDFlbSAyZW0gMCAyZW07XHJcbiAgICAgICAgbWFyZ2luOiAwIDFlbSAxZW0gMWVtO1xyXG4gICAgICAgIGhlaWdodDogMCU7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuMyk7XHJcblxyXG5cclxuXHJcbiAgICAgICAgaDF7XHJcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogMjBweDtcclxuICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBoNHtcclxuICAgICAgICAgICAgZm9udC1zaXplOiAxMnB4O1xyXG4gICAgICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgb2x7XHJcbiAgICAgICAgICAgIGxpe1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxpOmhvdmVye1xyXG4gICAgICAgICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKHdhcm5pbmcpO1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgI2hfbmFtZSwgI2hfYWdlLCAjaF9nZW5kZXIsICNsX3NpZ25zLCAjbF90ZXN0cywgI2xfdGVzdHNSZXN1bHRzLCAjbF9keCB7XHJcbiAgICAgICAgICAgIHRleHQtdHJhbnNmb3JtOiBjYXBpdGFsaXplO1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDEzcHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiAjMDAwMDAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0ZXh0YXJlYXtcclxuICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcihpbnB1dCk7XHJcbiAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMWVtO1xyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICB9XHJcblxyXG59XHJcbiJdfQ== */"

/***/ }),

/***/ "./src/app/clinician/xray/xray.component.ts":
/*!**************************************************!*\
  !*** ./src/app/clinician/xray/xray.component.ts ***!
  \**************************************************/
/*! exports provided: XrayComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "XrayComponent", function() { return XrayComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/files.service */ "./src/app/services/files.service.ts");
/* harmony import */ var src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/notify.service */ "./src/app/services/notify.service.ts");




var XrayComponent = /** @class */ (function () {
    function XrayComponent(filesService, notifyService) {
        this.filesService = filesService;
        this.notifyService = notifyService;
        this.xrayPatients = [];
        this.openedFiles = [];
        this.toExamDisabled = true;
    }
    XrayComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Xray List patients functions
        this.filesService.listXrayPatient().subscribe(function (data) { _this.xrayPatients = data; }, function (error) { console.error("Error", error); });
        // page Reload function
        this.filesService.xrayReload().subscribe(
        // Do Nothing
        );
        //Update Exam Form
        this.filesService.updateXrayForm().subscribe(function (data) { _this.openedFiles = data; }, function (error) { console.error("Error", error); });
        // define captured data
        this.xray = {
            results: "",
        };
    };
    //=== Opening Xray file ===
    XrayComponent.prototype.openXrayFile = function (id) {
        var _this = this;
        var patientNo = { patientNo: id };
        this.filesService.openXrayFile(patientNo).subscribe(function (data) { _this.notifyService.showInfo("File Opened !", "Info.."); }, function (error) {
            console.log("Error", error);
            _this.notifyService.showWarning(error.error, "Warnning!");
        });
    };
    //==== Change in Results Area function ======
    XrayComponent.prototype.resultKeyup = function () {
        this.toExamDisabled = false;
    };
    ;
    // ==== Back to Examination =========
    XrayComponent.prototype.onSubmit = function () {
        var _this = this;
        this.filesService.xrayToExam(this.xray).subscribe(function (data) { _this.notifyService.showSuccess("Sent Back To Exam..", "Success !"); }, function (error) { console.log(error, "Error!"); });
    };
    XrayComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-xray',
            template: __webpack_require__(/*! ./xray.component.html */ "./src/app/clinician/xray/xray.component.html"),
            styles: [__webpack_require__(/*! ./xray.component.scss */ "./src/app/clinician/xray/xray.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [src_app_services_files_service__WEBPACK_IMPORTED_MODULE_2__["FilesService"],
            src_app_services_notify_service__WEBPACK_IMPORTED_MODULE_3__["NotifyService"]])
    ], XrayComponent);
    return XrayComponent;
}());



/***/ }),

/***/ "./src/app/login/login.component.html":
/*!********************************************!*\
  !*** ./src/app/login/login.component.html ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<!------------- Clip Path -------------------------------------->\n<div id=\"bg\"></div>\n<!------------- Header -------------------------------------->\n    <header class=\"fixed-top\">\n\n      <div class=\"container\">\n        <fa name=\"stethoscope\" size=\"2x\"></fa>\n        <h4>the <span class=\"highlight\">kims </span>web</h4>\n\n      </div>\n\n\n    </header>\n\n    \n<!------------- Main -------------------------------------->\n  <main>\n\n<!------------- Title Section -------------------------------------->    \n      <section id=\"title_section\">\n          <form class=\"form\" >\n\n              <h4>Outpatient Medical Web-System</h4>\n              <p>The ultimate way of managing medical records in a more efficient way.</p>\n    \n            </form>\n            <hr>\n      </section>\n\n<!------------- Login Section -------------------------------------->\n        <section id=\"login_section\">     \n\n            <div>\n    \n                <h4>Login as..</h4>\n                <hr>\n                <p>To use this system, log in as per your profession.</p>\n                <p>If you don't have an account, get signed up by your institution's admin.</p>\n\n<!------------- Tab Form -------------------------------------->\n                <form id=\"login_tabs\" class=\"list-group small mt-1 \" role=\"tablist\">\n\n                  <a id=\"a1\" class=\"list-group-item list-group-item-action active\" data-toggle=\"list\">Clinician</a>\n                    <a id=\"a2\" class=\"list-group-item list-group-item-action\" data-toggle=\"list\">Admin</a>\n\n                </form>\n\n<!------------- Clinician Login Form -------------------------------------->                \n                <form id=\"logcli_form\" class=\"form\" role=\"tabpanel\"\n                #logcli_form=\"ngForm\"\n                (submit)=\"logClinic()\"\n                >\n\n                <input id=\"cliMail\" type=\"email\" class=\"form-control form-control-sm rounded\" \n                #cliMail=\"ngModel\"\n                pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$\"\n                [class.is-invalid]=\"cliMail.invalid && cliMail.touched\"\n                [(ngModel)]=\"logCli.mail\" name=\"mail\" placeholder=\"Email\" required> \n\n                <div *ngIf=\"cliMail.errors && (cliMail.invalid && cliMail.touched)\">\n                    <small class=\"text-danger ml-2\" *ngIf=\"cliMail.errors.required\">Email is Required</small>\n                    <small class=\"text-danger ml-2\" *ngIf=\"cliMail.errors.pattern\">Email should be in this format \"job@gmail.com\"</small>\n                </div>\n              \n                  \n\n\n\n                \n                  <input id=\"cliPassword\" type=\"password\" class=\"form-control form-control-sm\" required\n                  [(ngModel)]=\"logCli.password\" name=\"password\"\n                  #cliPassword=\"ngModel\"\n                  pattern=\".{8,}\"\n                  [class.is-invalid]=\"cliPassword.invalid && cliPassword.touched\"\n                   placeholder=\"Password\">\n\n                   <div *ngIf=\"cliPassword.errors && (cliPassword.invalid && cliPassword.touched)\">\n                      <small *ngIf=\"cliPassword.errors.required\">Password is Required !</small>\n                      <small *ngIf=\"cliPassword.errors.pattern\"> Atleast 8 characters !</small>\n                  </div>\n\n\n                  \n                \n\n\n                  <button type=\"submit\"\n                  [disabled]=\"!logcli_form.valid\" class=\"btn btn-sm\">Login</button>\n                \n                </form>\n\n\n\n\n\n<!------------- Admin Login Form -------------------------------------->   \n\n\n                <form id=\"logadmin_form\" class=\"form\" role=\"tabpanel\"\n                #logadmin_form=\"ngForm\"\n                (submit)=\"logAdmin()\"    \n                >\n\n\n\n                <input id=\"admMail\" type=\"email\" class=\"form-control form-control-sm rounded\" \n                #admMail=\"ngModel\"\n                pattern=\"[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$\"\n                [class.is-invalid]=\"admMail.invalid && admMail.touched\"\n                [(ngModel)]=\"logAdm.mail\" name=\"mail\" placeholder=\"Email\" required> \n                \n                <div *ngIf=\"admMail.errors && (admMail.invalid && admMail.touched)\">\n                    <small class=\"text-danger ml-2\" *ngIf=\"admMail.errors.required\">Email is Required</small>\n                    <small class=\"text-danger ml-2\" *ngIf=\"admMail.errors.pattern\">Email should be in this format \"job@gmail.com\"</small>\n                </div>\n                \n\n                 \n             \n                  \n\n\n                  <input id=\"admPassword\" type=\"password\" class=\"form-control form-control-sm\" required\n                  [(ngModel)]=\"logAdm.password\" name=\"password\"\n                  #admPassword=\"ngModel\"\n                  pattern=\".{8,}\"\n                  [class.is-invalid]=\"admPassword.invalid && admPassword.touched\"\n                   placeholder=\"Password\">\n\n\n                   <div *ngIf=\"admPassword.errors && (admPassword.invalid && admPassword.touched)\">\n                      <small *ngIf=\"admPassword.errors.required\">Password is Required !</small>\n                      <small *ngIf=\"admPassword.errors.pattern\"> Atleast 8 characters !</small>\n                  </div>\n\n\n\n                  \n          \n                   \n\n\n                  <button type=\"submit\"\n                  [disabled]=\"!logadmin_form.valid\" class=\"btn btn-sm\" >Login</button>\n                \n                </form>\n      \n \n            </div>\n                  \n\n        </section>\n\n\n<!------------- Info Section --------------------------------------> \n      <section id=\"info_section\">\n\n        <div id=\"navigation\">\n          <ul class=\"breadcrumb\">\n              \n              <li id=\"about\" class=\"breadcrumb-item\"><a>About</a></li>\n              <li id=\"career\" class=\"breadcrumb-item\"><a>Work With Us</a></li>\n              <li id=\"contact\" class=\"breadcrumb-item\"><a>Contact Us</a></li>\n          </ul>\n        </div>\n<!------------------------ About Form -------------------------------------> \n        <form id=\"about_form\" class=\"form\" >\n\n          <h4 class=\"text-info\">Info</h4>\n\n            <p>\n              TheKimsWeb is a system that enables medical records\n               to be managed in an online platform. It serves health institutions \n               with a secure, effective and efficient way of operating with medical records on a daily basis.\n            </p>\n\n            <p>\n                This is an out-sourced system to Outpatient Health Institution. It has over 80 percent \n                coverage in Africa, and its currently the top trending web system in the technology \n                sector. We have agents around the globe receiving installation request, and our \n                front-line team are always standby to make installations at payment within the shortest time possible. \n                \n              </p>\n              \n              <p>\n                This system is \n                powered and managed by<strong> The Sainez Organization,</strong> named after \n                  <i>Sainez Amon Kimutai.</i>\n                    \n                </p>\n                <h4 class=\"text-info\" >Patners With:</h4>\n                <ul>\n                    <li>ITECH-KENYA</li>\n                    <li>Savannah Informatics</li>\n                    <li>Kenya MOH</li>\n                </ul>\n      </form>\n\n<!--------------------- Career Form --------------------------------------> \n\n      <form id=\"career_form\" class=\"form\" >\n\n        <h4 class=\"text-info\">Career</h4>\n\n        <p>\n          Our mission is to provide secure, \n          effective and efficient healthcare through the \n          best use of information technology. In order to archieve this we \n          teach on the use of technology by offering interniships to graduands and \n          jobs to the best interns.\n        </p>\n        <h4 class=\"text-info\">Available Internships</h4>\n        <ul>\n          <li>Front-End Interns</li>\n          <li>Back-End Interns</li>\n          <li>System Analysis Interns</li>\n          \n        </ul>\n        <i><strong>Note: </strong>All interniships are paid and run for 6 months.</i>\n        <h4 class=\"text-info mt-3\">Job Vacancies</h4>\n        <ul>\n          <li>Sinior Web Designer</li>\n          <li>Testing Programmer</li>\n          <li>Analyst Programmer</li>\n          \n        </ul>\n        \n\n      </form>\n<!---------------------- Contact Form -------------------------------------> \n      <form id=\"contact_form\" class=\"form\">\n        <h4 class=\"text-info\">Find Us:</h4>\n        <p>\n            Our main headquarters is at Kapsabet Town, Kenya, or in any of our branches in Kitale, Eldoret, \n            Kakamega and Kisumu. Please follow us in social media platforms.\n        </p>\n\n        <div id=\"social\" class=\"row\">\n\n          <a class=\"card text-center  col-sm-4 col-xm-12\"><fa name=\"facebook\" size=\"2x\"></fa> thekimsweb</a>\n          <a class=\"card text-center col-sm-4 col-xm-12\"><fa name=\"twitter\" size=\"2x\"></fa> @thekims_kimsweb</a>\n          <a class=\"card text-center col-sm-4 col-xm-12\"><fa name=\"instagram\" size=\"2x\"></fa> @thekimsweb</a>\n          <a class=\"card text-center col-sm-4 col-xm-12\"><fa name=\"envelope\" size=\"2x\"></fa> service@kimsweb.co.ke</a>\n          <a class=\"card text-center col-sm-4 col-xm-12\"><fa name=\"youtube\" size=\"2x\"></fa> thekimsweb.youtube.com</a>\n          <a class=\"card text-center col-sm-4 col-xm-12\"><fa name=\"whatsapp\" size=\"2x\"></fa> +254 718 896 779</a>\n          <a class=\"card text-center col-sm-4 col-xm-12\"><fa name=\"phone\" size=\"2x\"></fa> +254 718 896 779</a>\n  \n\n        </div>\n\n\n        \n\n      </form>\n\n      </section>\n\n\n    </main>\n\n\n  \n\n"

/***/ }),

/***/ "./src/app/login/login.component.scss":
/*!********************************************!*\
  !*** ./src/app/login/login.component.scss ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/*------------------- Global -----------------------------*/\n/* Breakpoints: xs: 0,  sm: 576px; md: 768px; lg: 992px; xl: 1200px; */\n#bg {\n  -webkit-clip-path: polygon(100% 0, 100% 50%, 0 100%, 0 100%, 0 0);\n          clip-path: polygon(100% 0, 100% 50%, 0 100%, 0 100%, 0 0);\n  background-color: #35424a;\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  top: 0;\n  z-index: -1; }\n@media (min-width: 768px) {\n    #bg {\n      -webkit-clip-path: polygon(0 0, 75% 0, 55% 100%, 0% 100%);\n              clip-path: polygon(0 0, 75% 0, 55% 100%, 0% 100%); } }\n/*-----------------------------------------------------*/\n.container-fluid, .container {\n  width: 100%;\n  overflow: hidden; }\n/*---------------------------------------------*/\n/*============ Login ===========================*/\nheader {\n  background-color: #35424a;\n  text-align: center;\n  padding: 3px;\n  border-bottom: #e8491d 3px solid;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7); }\nheader fa {\n    position: absolute;\n    top: 7px;\n    left: 5%;\n    color: #e8491d; }\nheader h4 {\n    font-family: Montserrat;\n    font-size: 24px;\n    font-weight: bold;\n    text-transform: uppercase;\n    color: #17a2b8;\n    text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3); }\nheader h4 span {\n      font-size: 24px;\n      color: #e8491d;\n      text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3); }\nmain #title_section {\n  margin: 50px 0 0 0;\n  padding: 0; }\nmain #title_section form {\n    text-align: center;\n    padding: 0;\n    margin: 0;\n    color: #e8491d; }\nmain #title_section form h4 {\n      font-size: 24px;\n      font-weight: bold;\n      text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3);\n      padding: 0;\n      margin: 0; }\nmain #title_section form p {\n      font-size: 15px;\n      text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3);\n      padding: 0;\n      margin: 0; }\nmain #title_section hr {\n    margin: 0;\n    background-color: #35424a; }\nmain #login_section {\n  width: 80%;\n  background-color: white;\n  margin: 1em auto;\n  margin-top: 0px;\n  border-radius: 20px;\n  padding: 1em 2em 2em 2em;\n  opacity: 0.9;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7); }\n@media (min-width: 768px) {\n    main #login_section {\n      position: absolute;\n      top: 20%;\n      left: 60%;\n      width: 30%;\n      margin: 1em auto; } }\nmain #login_section form {\n    border-radius: 20px;\n    border: none;\n    padding: 1ex; }\nmain #login_section h4 {\n    color: #17a2b8;\n    font-size: 24px;\n    font-weight: bold;\n    margin-bottom: 0; }\nmain #login_section hr {\n    margin: 0; }\nmain #login_section p {\n    margin: 0 0 .3em 0; }\nmain #login_section #login_tabs {\n    flex-direction: row; }\nmain #login_section #login_tabs a {\n      font-weight: bolder;\n      text-shadow: 5px 5px 3px rgba(0, 0, 0, 0.3);\n      border-radius: 0;\n      border-top-left-radius: 10px;\n      border-top-right-radius: 10px; }\nmain #login_section .list-group {\n    padding: 0;\n    margin: 0; }\nmain #login_section .list-group a {\n      padding: 1em 0 0 0;\n      text-align: center;\n      color: #e8491d;\n      font-weight: bolder;\n      font-size: 14px;\n      border: none;\n      background-color: whitesmoke; }\nmain #login_section .list-group #a1.active {\n      background-color: #35424a; }\nmain #login_section .list-group #a2.active {\n      background-color: #35424a; }\nmain #login_section #logcli_form {\n    background-color: #35424a;\n    padding: 0 1em 1em 1em;\n    display: flex;\n    flex-direction: column;\n    align-items: flex-start;\n    border-radius: 0;\n    border-top-right-radius: 10px;\n    border-bottom-left-radius: 10px;\n    border-bottom-right-radius: 10px; }\nmain #login_section #logcli_form input {\n      border: none;\n      border-bottom: solid #e8491d 2px;\n      margin: 1em 0 0 0;\n      background-color: #35424a;\n      color: #17a2b8; }\nmain #login_section #logcli_form small {\n      margin: 0 0 0 4px;\n      color: red;\n      font-size: 12px; }\nmain #login_section #logcli_form input[type=text], main #login_section #logcli_form input[type=email], main #login_section #logcli_form input[type=tel], main #login_section #logcli_form input[type=password] {\n      width: 10em; }\nmain #login_section #logcli_form button {\n      background-color: #17a2b8;\n      margin: 1em 0 0 0;\n      color: black;\n      width: 10em; }\nmain #login_section #logadmin_form {\n    background-color: #35424a;\n    padding: 0 1em 1em 1em;\n    display: flex;\n    flex-direction: column;\n    align-items: flex-end;\n    border-radius: 0;\n    border-top-left-radius: 10px;\n    border-bottom-left-radius: 10px;\n    border-bottom-right-radius: 10px; }\nmain #login_section #logadmin_form input {\n      border: none;\n      border-bottom: solid #e8491d 2px;\n      margin: 1em 0 0 0;\n      background-color: #35424a;\n      color: #17a2b8; }\nmain #login_section #logadmin_form small {\n      margin: 0 0 0 4px;\n      color: red;\n      font-size: 12px; }\nmain #login_section #logadmin_form input[type=text], main #login_section #logadmin_form input[type=email], main #login_section #logadmin_form input[type=tel], main #login_section #logadmin_form input[type=password] {\n      width: 10em; }\nmain #login_section #logadmin_form button {\n      background-color: #17a2b8;\n      margin: 1em 0 0 0;\n      color: black;\n      width: 10em; }\nmain #info_section {\n  margin: 2em;\n  margin: 0 2em 1em 2em;\n  background-color: white;\n  border-radius: 20px;\n  padding: 1em;\n  opacity: 0.9;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7); }\n@media (min-width: 768px) {\n    main #info_section {\n      position: absolute;\n      top: 16%;\n      width: 50%; } }\nmain #info_section .breadcrumb li a {\n    color: #2c9cdd;\n    cursor: pointer; }\nmain #info_section .breadcrumb li a:hover {\n    color: black;\n    font-weight: bold; }\nmain #info_section form {\n    padding: 1ex;\n    border: none;\n    border-radius: 20px; }\nmain #info_section form h4 {\n      font-size: 14px;\n      font-weight: bold; }\nmain #info_section #contact_form #social a {\n    border: none;\n    margin: 0 0 2em 0; }\nmain #info_section #contact_form #social a fa[name=facebook] {\n      color: #3b5998; }\nmain #info_section #contact_form #social a fa[name=twitter] {\n      color: #00aced; }\nmain #info_section #contact_form #social a fa[name=instagram] {\n      color: #e8491d; }\nmain #info_section #contact_form #social a fa[name=envelope] {\n      color: orange; }\nmain #info_section #contact_form #social a fa[name=youtube] {\n      color: red; }\nmain #info_section #contact_form #social a fa[name=whatsapp] {\n      color: #28a745; }\nmain #info_section #contact_form #social a fa[name=phone] {\n      color: black; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvbG9naW4vQzpcXFRoZUNvZGVcXG1lYW5BcHBSYXdcXGtpbXNhcHAvc3JjXFxhcHBcXGxvZ2luXFxsb2dpbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwyREFBQTtBQUNBLHNFQUFBO0FBd0NJO0VBQ0ksaUVBQXlEO1VBQXpELHlEQUF5RDtFQUN6RCx5QkFyQ1U7RUFzQ1YsV0FBVztFQUNYLFlBQVk7RUFFWixrQkFBa0I7RUFDbEIsTUFBTTtFQUNOLFdBQVcsRUFBQTtBQWZmO0lBT0E7TUFXWSx5REFBaUQ7Y0FBakQsaURBQWlELEVBQUEsRUFFeEQ7QUFFTCx3REFBQTtBQUNBO0VBQ0ksV0FBVztFQUNYLGdCQUFnQixFQUFBO0FBSXhCLGdEQUFBO0FBR0EsaURBQUE7QUFFQTtFQUVJLHlCQWhFYztFQWlFZCxrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLGdDQUF3QztFQUN4QywwQ0FBeUMsRUFBQTtBQU43QztJQVNRLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsUUFBUTtJQUNSLGNBM0VhLEVBQUE7QUErRHJCO0lBZ0JRLHVCQUF1QjtJQUN2QixlQUFlO0lBQ2YsaUJBQWlCO0lBQ2pCLHlCQUF5QjtJQUN6QixjQXRFUztJQXVFVCwyQ0FBMEMsRUFBQTtBQXJCbEQ7TUF3QlksZUFBZTtNQUNmLGNBeEZTO01BeUZULDJDQUEwQyxFQUFBO0FBU3REO0VBTVEsa0JBQWtCO0VBQ2xCLFVBQVUsRUFBQTtBQVBsQjtJQVVZLGtCQUFrQjtJQUNsQixVQUFVO0lBQ1YsU0FBUztJQUNULGNBL0dTLEVBQUE7QUFrR3JCO01BZ0JnQixlQUFlO01BQ2YsaUJBQWlCO01BQ2pCLDJDQUEwQztNQUMxQyxVQUFVO01BQ1YsU0FBUyxFQUFBO0FBcEJ6QjtNQXdCZ0IsZUFBZTtNQUNmLDJDQUEwQztNQUMxQyxVQUFVO01BQ1YsU0FBUyxFQUFBO0FBM0J6QjtJQWdDZ0IsU0FBUztJQUNULHlCQWxJRSxFQUFBO0FBaUdsQjtFQTJDUSxVQUFVO0VBQ1YsdUJBQXVCO0VBQ3ZCLGdCQUFnQjtFQUNoQixlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLHdCQUF3QjtFQUN4QixZQXpISTtFQTBISiwwQ0FBeUMsRUFBQTtBQXZIN0M7SUFxRUo7TUFxRGdCLGtCQUFrQjtNQUNsQixRQUFRO01BQ1IsU0FBUztNQUNULFVBQVU7TUFDVixnQkFBZ0IsRUFBQSxFQXVJM0I7QUFoTUw7SUFnRWdCLG1CQUFtQjtJQUNuQixZQUFZO0lBQ1osWUFBWSxFQUFBO0FBbEU1QjtJQXNFZ0IsY0EzSkM7SUE0SkQsZUFBZTtJQUNmLGlCQUFpQjtJQUNqQixnQkFBZ0IsRUFBQTtBQXpFaEM7SUE0RWdCLFNBQVMsRUFBQTtBQTVFekI7SUErRWdCLGtCQUFrQixFQUFBO0FBL0VsQztJQW9GZ0IsbUJBQW1CLEVBQUE7QUFwRm5DO01BdUZvQixtQkFBbUI7TUFDbkIsMkNBQTBDO01BQzFDLGdCQUFnQjtNQUNoQiw0QkFBNEI7TUFDNUIsNkJBQTZCLEVBQUE7QUEzRmpEO0lBZ0dnQixVQUFVO0lBQ1YsU0FBUyxFQUFBO0FBakd6QjtNQW9Hb0Isa0JBQWtCO01BQ2xCLGtCQUFrQjtNQUNsQixjQXhNQztNQXlNRCxtQkFBbUI7TUFDbkIsZUFBZTtNQUNmLFlBQVk7TUFDWiw0QkFBNEIsRUFBQTtBQTFHaEQ7TUE4R29CLHlCQS9NRixFQUFBO0FBaUdsQjtNQWtIb0IseUJBbk5GLEVBQUE7QUFpR2xCO0lBd0hnQix5QkF6TkU7SUEwTkYsc0JBQXNCO0lBQ3RCLGFBQWE7SUFDYixzQkFBc0I7SUFDdEIsdUJBQXVCO0lBQ3ZCLGdCQUFnQjtJQUNoQiw2QkFBNkI7SUFDN0IsK0JBQStCO0lBQy9CLGdDQUFnQyxFQUFBO0FBaEloRDtNQW9Jb0IsWUFBWTtNQUNaLGdDQUF3QztNQUN4QyxpQkFBaUI7TUFDakIseUJBeE9GO01BeU9FLGNBN05ILEVBQUE7QUFxRmpCO01BMklvQixpQkFBaUI7TUFDakIsVUFBVTtNQUNWLGVBQWUsRUFBQTtBQTdJbkM7TUFnSm9CLFdBQVcsRUFBQTtBQWhKL0I7TUFtSm9CLHlCQXhPSDtNQXlPRyxpQkFBaUI7TUFDakIsWUFBWTtNQUNaLFdBQVcsRUFBQTtBQXRKL0I7SUE4SmdCLHlCQS9QRTtJQWdRRixzQkFBc0I7SUFDdEIsYUFBYTtJQUNiLHNCQUFzQjtJQUN0QixxQkFBcUI7SUFDckIsZ0JBQWdCO0lBQ2hCLDRCQUE0QjtJQUM1QiwrQkFBK0I7SUFDL0IsZ0NBQWdDLEVBQUE7QUF0S2hEO01BeUtvQixZQUFZO01BQ1osZ0NBQXdDO01BQ3hDLGlCQUFpQjtNQUNqQix5QkE3UUY7TUE4UUUsY0FsUUgsRUFBQTtBQXFGakI7TUFnTG9CLGlCQUFpQjtNQUNqQixVQUFVO01BQ1YsZUFBZSxFQUFBO0FBbExuQztNQXFMb0IsV0FBVyxFQUFBO0FBckwvQjtNQXdMb0IseUJBN1FIO01BOFFHLGlCQUFpQjtNQUNqQixZQUFZO01BQ1osV0FBVyxFQUFBO0FBM0wvQjtFQXFNUSxXQUFXO0VBQ1gscUJBQXFCO0VBQ3JCLHVCQUF1QjtFQUN2QixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLFlBbFJJO0VBbVJKLDBDQUF5QyxFQUFBO0FBaFI3QztJQXFFSjtNQStNWSxrQkFBa0I7TUFDbEIsUUFBUTtNQUNSLFVBQVUsRUFBQSxFQXlEakI7QUExUUw7SUFxTlksY0FBd0I7SUFDeEIsZUFBZSxFQUFBO0FBdE4zQjtJQXlORyxZQUFZO0lBQ1osaUJBQWlCLEVBQUE7QUExTnBCO0lBOE5ZLFlBQVk7SUFDWixZQUFZO0lBQ1osbUJBQW1CLEVBQUE7QUFoTy9CO01BbU9nQixlQUFlO01BQ2YsaUJBQWlCLEVBQUE7QUFwT2pDO0lBNE9vQixZQUFZO0lBQ1osaUJBQWlCLEVBQUE7QUE3T3JDO01BZ1B3QixjQUFjLEVBQUE7QUFoUHRDO01BbVB3QixjQUFjLEVBQUE7QUFuUHRDO01Bc1B3QixjQXhWSCxFQUFBO0FBa0dyQjtNQXlQd0IsYUFBYSxFQUFBO0FBelByQztNQTRQd0IsVUFBVSxFQUFBO0FBNVBsQztNQStQd0IsY0FyVkosRUFBQTtBQXNGcEI7TUFrUXdCLFlBQVksRUFBQSIsImZpbGUiOiJzcmMvYXBwL2xvZ2luL2xvZ2luLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tIEdsb2JhbCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbi8qIEJyZWFrcG9pbnRzOiB4czogMCwgIHNtOiA1NzZweDsgbWQ6IDc2OHB4OyBsZzogOTkycHg7IHhsOiAxMjAwcHg7ICovXHJcblxyXG4kY29sb3JzOiAoXHJcbiAgICBiZzogI2MwYzBjMCxcclxuICAgIGZldm9yaXRlOiAjZTg0OTFkLFxyXG4gICAgdGhlbWU6ICMzNTQyNGEsXHJcbiAgICBwcmltYXJ5OiAjMDA3YmZmLFxyXG4gICAgcHJpbWFyeS1saWdodDogbGlnaHRlbigjMDA1REZGLCA0MCUpLFxyXG4gICAgcHJpbWFyeS1kYXJrOiBkYXJrZW4oIzAwNURGRiwgNDAlKSxcclxuICAgIGFjY2VudDogI0ZGRjZCQixcclxuICAgIGdpcmxpc2g6IHJnYigxOTUsIDE1LCAyMDEpLFxyXG4gICAgZm9ybTogbGlnaHRlbigjMzU0MjRhLCA0MCUpLFxyXG4gICAgaW5wdXQ6IGxpZ2h0ZW4oZ3JleSwgNTAlKSxcclxuICAgIGdyYXk6ICM2Yzc1N2QsXHJcbiAgICBncmF5LWRhcms6ICMzNDNhNDAsXHJcbiAgICBzZWNvbmRhcnk6ICM2Yzc1N2QsXHJcbiAgICBzdWNjZXNzOiAjMjhhNzQ1LFxyXG4gICAgaW5mbzogIzE3YTJiOCxcclxuICAgIHdhcm5pbmc6ICNmZmMxMDcsXHJcbiAgICBkYW5nZXI6ICNkYzM1NDUsXHJcbiAgICBsaWdodDogI2Y4ZjlmYSxcclxuICAgIGRhcms6ICMzNDNhNDBcclxuXHJcbik7XHJcblxyXG5AZnVuY3Rpb24gY29sb3IoJGNvbG9yLW5hbWUpe1xyXG4gICAgQHJldHVybiBtYXAtZ2V0KCRjb2xvcnMgLCAkY29sb3ItbmFtZSlcclxufVxyXG5cclxuJGRlc2t0b3A6IDc2OHB4O1xyXG4kb3BhY2l0eTogLjk7XHJcblxyXG5AbWl4aW4gZGVza3RvcCB7XHJcbiAgICBAbWVkaWEgKG1pbi13aWR0aDogI3skZGVza3RvcH0pIHtcclxuICAgICAgICBAY29udGVudDtcclxuICAgIH0gXHJcbn1cclxuXHJcblxyXG5cclxuICAgICNiZ3tcclxuICAgICAgICBjbGlwLXBhdGg6IHBvbHlnb24oMTAwJSAwLCAxMDAlIDUwJSwgMCAxMDAlLCAwIDEwMCUsIDAgMCk7XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IodGhlbWUpO1xyXG4gICAgICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgICAgIGhlaWdodDogMTAwJTtcclxuICAgICAgICAgXHJcbiAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgIHRvcDogMDtcclxuICAgICAgICB6LWluZGV4OiAtMTtcclxuXHJcbiAgICAgICAgICAgIEBpbmNsdWRlIGRlc2t0b3B7XHJcbiAgICAgICAgICAgICAgICBjbGlwLXBhdGg6IHBvbHlnb24oMCAwLCA3NSUgMCwgNTUlIDEwMCUsIDAlIDEwMCUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIC8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xyXG4gICAgLmNvbnRhaW5lci1mbHVpZCwgLmNvbnRhaW5lciB7XHJcbiAgICAgICAgd2lkdGg6IDEwMCU7XHJcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICAgIH1cclxuXHJcblxyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5cclxuLyo9PT09PT09PT09PT0gTG9naW4gPT09PT09PT09PT09PT09PT09PT09PT09PT09Ki9cclxuXHJcbmhlYWRlciB7XHJcblxyXG4gICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IodGhlbWUpO1xyXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgcGFkZGluZzogM3B4O1xyXG4gICAgYm9yZGVyLWJvdHRvbTogY29sb3IoZmV2b3JpdGUpIDNweCBzb2xpZDtcclxuICAgIGJveC1zaGFkb3c6IDAgMTBweCAzMHB4IHJnYmEoMCwgMCwgMCwgLjcpO1xyXG5cclxuICAgIGZhe1xyXG4gICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICAgICAgICB0b3A6IDdweDtcclxuICAgICAgICBsZWZ0OiA1JTtcclxuICAgICAgICBjb2xvcjpjb2xvcihmZXZvcml0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgaDQge1xyXG4gICAgICAgIGZvbnQtZmFtaWx5OiBNb250c2VycmF0O1xyXG4gICAgICAgIGZvbnQtc2l6ZTogMjRweDtcclxuICAgICAgICBmb250LXdlaWdodDogYm9sZDtcclxuICAgICAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xyXG4gICAgICAgIGNvbG9yOiBjb2xvcihpbmZvKTtcclxuICAgICAgICB0ZXh0LXNoYWRvdzogNXB4IDVweCAzcHggcmdiYSgwLCAwLCAwLCAuMyk7XHJcblxyXG4gICAgICAgIHNwYW4ge1xyXG4gICAgICAgICAgICBmb250LXNpemU6IDI0cHg7XHJcbiAgICAgICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufVxyXG5cclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBNYWluIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxubWFpbiB7XHJcbiAgICAgICAgXHJcbiBcclxuXHJcbiAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVGl0bGUgU2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICN0aXRsZV9zZWN0aW9ue1xyXG4gICAgICAgIG1hcmdpbjogNTBweCAwIDAgMDtcclxuICAgICAgICBwYWRkaW5nOiAwO1xyXG5cclxuICAgICAgICBmb3Jte1xyXG4gICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgIHBhZGRpbmc6IDA7XHJcbiAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuXHJcbiAgICAgICAgICAgIGg0e1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LXNoYWRvdzogNXB4IDVweCAzcHggcmdiYSgwLCAwLCAwLCAuMyk7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwO1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwe1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAxNXB4O1xyXG4gICAgICAgICAgICAgICAgdGV4dC1zaGFkb3c6IDVweCA1cHggM3B4IHJnYmEoMCwgMCwgMCwgLjMpO1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMDtcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBocntcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKHRoZW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbG9naW4gU2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcblxyXG4gICAgI2xvZ2luX3NlY3Rpb257XHJcbiAgICAgICAgd2lkdGg6IDgwJTtcclxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICAgICAgICBtYXJnaW46IDFlbSBhdXRvO1xyXG4gICAgICAgIG1hcmdpbi10b3A6IDBweDtcclxuICAgICAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xyXG4gICAgICAgIHBhZGRpbmc6IDFlbSAyZW0gMmVtIDJlbTtcclxuICAgICAgICBvcGFjaXR5OiAkb3BhY2l0eTtcclxuICAgICAgICBib3gtc2hhZG93OiAwIDEwcHggMzBweCByZ2JhKDAsIDAsIDAsIC43KTtcclxuXHJcbiAgICAgICAgICAgIEBpbmNsdWRlIGRlc2t0b3B7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgICAgICAgICAgICAgICB0b3A6IDIwJTtcclxuICAgICAgICAgICAgICAgIGxlZnQ6IDYwJTtcclxuICAgICAgICAgICAgICAgIHdpZHRoOiAzMCU7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW46IDFlbSBhdXRvO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBcclxuICAgICAgICAgICAgZm9ybXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTtcclxuICAgICAgICAgICAgICAgIHBhZGRpbmc6IDFleDtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGg0e1xyXG4gICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgZm9udC1zaXplOiAyNHB4O1xyXG4gICAgICAgICAgICAgICAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW4tYm90dG9tOiAwOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBocntcclxuICAgICAgICAgICAgICAgIG1hcmdpbjogMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwe1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwIDAgLjNlbSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgI2xvZ2luX3RhYnMge1xyXG4gICAgICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgYXtcclxuICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIHRleHQtc2hhZG93OiA1cHggNXB4IDNweCByZ2JhKDAsIDAsIDAsIC4zKTtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXItcmFkaXVzOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDEwcHg7IFxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAubGlzdC1ncm91cCB7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwO1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luOiAwO1xyXG5cclxuICAgICAgICAgICAgICAgIGEge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDFlbSAwIDAgMDtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKGZldm9yaXRlKTtcclxuICAgICAgICAgICAgICAgICAgICBmb250LXdlaWdodDogYm9sZGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGVzbW9rZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAjYTEuYWN0aXZlIHtcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcih0aGVtZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgI2EyLmFjdGl2ZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IodGhlbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBDbGluaWNpYW4gbG9nIEZvcm0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcbiAgICAgICAgICAgICNsb2djbGlfZm9ybSB7XHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvcih0aGVtZSk7XHJcbiAgICAgICAgICAgICAgICBwYWRkaW5nOiAwIDFlbSAxZW0gMWVtO1xyXG4gICAgICAgICAgICAgICAgZGlzcGxheTogZmxleDtcclxuICAgICAgICAgICAgICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgICAgICAgICAgICAgICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcclxuICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDA7XHJcbiAgICAgICAgICAgICAgICBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMTBweDsgXHJcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAxMHB4OyBcclxuICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAxMHB4O1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgaW5wdXR7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlci1ib3R0b206IHNvbGlkIGNvbG9yKGZldm9yaXRlKSAycHg7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luOiAxZW0gMCAwIDA7IFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKHRoZW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogY29sb3IoaW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzbWFsbHtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAgMCAwIDRweDtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlucHV0W3R5cGU9dGV4dF0sIGlucHV0W3R5cGU9ZW1haWxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9cGFzc3dvcmRde1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnV0dG9ue1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMWVtIDAgMCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTBlbTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBBZG1pbiBsb2cgRm9ybSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuICAgICAgICAgICAgI2xvZ2FkbWluX2Zvcm0ge1xyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IodGhlbWUpO1xyXG4gICAgICAgICAgICAgICAgcGFkZGluZzogMCAxZW0gMWVtIDFlbTtcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgYWxpZ24taXRlbXM6IGZsZXgtZW5kO1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgICAgICAgICAgICAgIGJvcmRlci10b3AtbGVmdC1yYWRpdXM6IDEwcHg7IFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMTBweDsgXHJcbiAgICAgICAgICAgICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMTBweDtcclxuXHJcbiAgICAgICAgICAgICAgICBpbnB1dHtcclxuICAgICAgICAgICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyLWJvdHRvbTogc29saWQgY29sb3IoZmV2b3JpdGUpIDJweDtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDFlbSAwIDAgMDsgXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogY29sb3IodGhlbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcihpbmZvKTs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzbWFsbHtcclxuICAgICAgICAgICAgICAgICAgICBtYXJnaW46IDAgMCAwIDRweDtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTJweDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlucHV0W3R5cGU9dGV4dF0sIGlucHV0W3R5cGU9ZW1haWxdLCBpbnB1dFt0eXBlPXRlbF0sIGlucHV0W3R5cGU9cGFzc3dvcmRde1xyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMGVtO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnV0dG9ue1xyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMWVtIDAgMCAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiBibGFjaztcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTBlbTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEluZm8gU2VjdGlvbiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBcclxuXHJcbiAgICAjaW5mb19zZWN0aW9uIHtcclxuICAgICAgICBtYXJnaW46IDJlbTtcclxuICAgICAgICBtYXJnaW46IDAgMmVtIDFlbSAyZW07XHJcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcclxuICAgICAgICBwYWRkaW5nOiAxZW07XHJcbiAgICAgICAgb3BhY2l0eTogJG9wYWNpdHk7XHJcbiAgICAgICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAuNyk7XHJcbiAgICAgICBcclxuXHJcbiAgICAgICAgQGluY2x1ZGUgZGVza3RvcHtcclxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICB0b3A6IDE2JTsgICAgICAgIFxyXG4gICAgICAgICAgICB3aWR0aDogNTAlOyAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAuYnJlYWRjcnVtYiBsaSBhe1xyXG4gICAgICAgICAgICBjb2xvcjogcmdiKDQ0LCAxNTYsIDIyMSk7XHJcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuXHRcdH1cclxuXHRcdC5icmVhZGNydW1iIGxpIGE6aG92ZXJ7XHJcblx0XHRcdGNvbG9yOiBibGFjaztcclxuXHRcdFx0Zm9udC13ZWlnaHQ6IGJvbGQ7XHJcblx0XHR9XHJcbiAgICAgICAgXHJcbiAgICAgICAgZm9ybXtcclxuICAgICAgICAgICAgcGFkZGluZzogMWV4O1xyXG4gICAgICAgICAgICBib3JkZXI6IG5vbmU7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XHJcblxyXG4gICAgICAgICAgICBoNHtcclxuICAgICAgICAgICAgICAgIGZvbnQtc2l6ZTogMTRweDtcclxuICAgICAgICAgICAgICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgICNjb250YWN0X2Zvcm17XHJcbiAgICAgICAgICAgICNzb2NpYWx7XHJcbiAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIGF7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBub25lO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcmdpbjogMCAwIDJlbSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBmYVtuYW1lPWZhY2Vib29rXXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICMzYjU5OTg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZhW25hbWU9dHdpdHRlcl17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAjMDBhY2VkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmYVtuYW1lPWluc3RhZ3JhbV17XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBjb2xvcihmZXZvcml0ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGZhW25hbWU9ZW52ZWxvcGVde1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogb3JhbmdlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmYVtuYW1lPXlvdXR1YmVde1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogcmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmYVtuYW1lPXdoYXRzYXBwXXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGNvbG9yKHN1Y2Nlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmYVtuYW1lPXBob25lXXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IGJsYWNrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gXHJcblxyXG59XHJcblxyXG4gLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFxyXG5cclxuIl19 */"

/***/ }),

/***/ "./src/app/login/login.component.ts":
/*!******************************************!*\
  !*** ./src/app/login/login.component.ts ***!
  \******************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_users_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/users.service */ "./src/app/services/users.service.ts");
/* harmony import */ var _services_notify_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/notify.service */ "./src/app/services/notify.service.ts");





var LoginComponent = /** @class */ (function () {
    function LoginComponent(route, router, usersService, notifyService) {
        this.route = route;
        this.router = router;
        this.usersService = usersService;
        this.notifyService = notifyService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.logCli = {
            mail: "", password: ""
        };
        this.logAdm = {
            mail: "", password: ""
        };
    };
    LoginComponent.prototype.logClinic = function () {
        var _this = this;
        this.usersService.logClinician(this.logCli).subscribe(function (data) {
            window.localStorage.setItem("clinicianToken", data.token);
            window.localStorage.setItem("clinicianUser", data.signedUser);
            _this.router.navigate(["/kimsapp/clinician"]);
        }, function (error) {
            _this.notifyService.showError(error.error, "Access Restricted..");
        });
    };
    LoginComponent.prototype.logAdmin = function () {
        var _this = this;
        this.usersService.logAdmin(this.logAdm).subscribe(function (data) {
            window.localStorage.setItem("adminToken", data.token);
            window.localStorage.setItem("adminUser", data.signedUser);
            _this.router.navigate(["/kimsapp/admin"]);
        }, function (error) {
            _this.notifyService.showError(error.error, "Access Restricted..");
        });
    };
    LoginComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.component.html */ "./src/app/login/login.component.html"),
            styles: [__webpack_require__(/*! ./login.component.scss */ "./src/app/login/login.component.scss")]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"],
            _services_users_service__WEBPACK_IMPORTED_MODULE_3__["UsersService"],
            _services_notify_service__WEBPACK_IMPORTED_MODULE_4__["NotifyService"]])
    ], LoginComponent);
    return LoginComponent;
}());



/***/ }),

/***/ "./src/app/services/files.service.ts":
/*!*******************************************!*\
  !*** ./src/app/services/files.service.ts ***!
  \*******************************************/
/*! exports provided: FilesService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilesService", function() { return FilesService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/lib/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");





//--------------------------------------------------------
var FilesService = /** @class */ (function () {
    //--------------------------------------------------------
    function FilesService(http) {
        this.http = http;
        //Headers
        this.header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        //--------- MAIN URL -----------------------------
        this._url = "http://127.0.0.1:8040/";
        this.socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__(this._url);
    }
    // ADMISSION ROUTER
    //-------------Post Admission --------------------------------------
    FilesService.prototype.admitPatient = function (record) {
        return this.http.post(this._url + 'admission', record, { headers: this.header });
    };
    // EXAMINATION ROUTER
    //------------- List Admitted Patients ---------------------------
    FilesService.prototype.listAdmitPatient = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/admission', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- Post Open Admission File
    FilesService.prototype.openAdmFile = function (record) {
        return this.http.post(this._url + "openadmissionfile", record, { headers: this.header });
    };
    //-------------- Examination on Reload ------------------
    FilesService.prototype.examinationReload = function () {
        return this.http.delete(this._url + "examinationreload", { headers: this.header });
    };
    //--------------- Update Examination form -------------------
    FilesService.prototype.updateExamForm = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/updateexamform', function (data) {
                observer.next(data);
            });
        });
    };
    //--------------- Delete File ----------------------------
    FilesService.prototype.deleteFile = function () {
        return this.http.delete(this._url + "deletefile", { headers: this.header });
    };
    //--------------- To Lab ----------------------------
    FilesService.prototype.tolab = function (record) {
        return this.http.post(this._url + "tolab", record, { headers: this.header });
    };
    //------------- List Patients from lab ---------------------------
    FilesService.prototype.listPatientfromLab = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/listfromlab', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- open File from Lab --------------------
    FilesService.prototype.openFilefromLab = function (record) {
        return this.http.post(this._url + "openfilefromlab", record, { headers: this.header });
    };
    //--------------- To Xray ----------------------------
    FilesService.prototype.toxray = function (record) {
        return this.http.post(this._url + "toxray", record, { headers: this.header });
    };
    //------------- List  Patients from xray ---------------------------
    FilesService.prototype.listPatientfromXray = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/listfromxray', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- Open File from Xray ---------------------------------
    FilesService.prototype.openFilefromXray = function (record) {
        return this.http.post(this._url + "openfilefromxray", record, { headers: this.header });
    };
    //--------------- To Pharmacy ----------------------------
    FilesService.prototype.topharmacy = function (record) {
        return this.http.post(this._url + "topharmacy", record, { headers: this.header });
    };
    FilesService.prototype.topharm = function (record) {
        return this.http.post(this._url + "topharm", record, { headers: this.header });
    };
    // LAB ROUTER
    //------------- List ToLab Patients ---------------------------
    FilesService.prototype.listLabPatient = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/listtolab', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- Open LabFile
    FilesService.prototype.openLabFile = function (record) {
        return this.http.post(this._url + "openlabfile", record, { headers: this.header });
    };
    //-------------- Lab on Reload ------------------
    FilesService.prototype.labReload = function () {
        return this.http.delete(this._url + "labreload", { headers: this.header });
    };
    //--------------- Update Lab form -------------------
    FilesService.prototype.updateLabForm = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/updatelabform', function (data) {
                observer.next(data);
            });
        });
    };
    //--------------- Lab to exam ----------------------------
    FilesService.prototype.labToExam = function (record) {
        return this.http.post(this._url + "labtoexam", record, { headers: this.header });
    };
    // XRAY ROUTER
    //------------- List ToLab Patients ---------------------------
    FilesService.prototype.listXrayPatient = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/listtoxray', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- Open Xray File
    FilesService.prototype.openXrayFile = function (record) {
        return this.http.post(this._url + "openxrayfile", record, { headers: this.header });
    };
    //-------------- Xray on Reload ------------------
    FilesService.prototype.xrayReload = function () {
        return this.http.delete(this._url + "xrayreload", { headers: this.header });
    };
    //--------------- Update Xray form -------------------
    FilesService.prototype.updateXrayForm = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/updatexrayform', function (data) {
                observer.next(data);
            });
        });
    };
    //--------------- Xray to exam ----------------------------
    FilesService.prototype.xrayToExam = function (record) {
        return this.http.post(this._url + "xraytoexam", record, { headers: this.header });
    };
    // PHARMACY ROUTER 
    //------------- List Pharmacy Patients ---------------------------
    FilesService.prototype.listPharmacyPatient = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/listpharmacy', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- Open Pharmacy File
    FilesService.prototype.openPharmacyFile = function (record) {
        return this.http.post(this._url + "openpharmacyfile", record, { headers: this.header });
    };
    //-------------- Pharmacy on Reload ------------------
    FilesService.prototype.pharmacyReload = function () {
        return this.http.delete(this._url + "pharmacyreload", { headers: this.header });
    };
    //--------------- Update Xray form -------------------
    FilesService.prototype.updatePharmacyForm = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/updatepharmacyform', function (data) {
                observer.next(data);
            });
        });
    };
    //--------------- save File ----------------------------
    FilesService.prototype.saveFile = function (record) {
        return this.http.post(this._url + "savefile", record, { headers: this.header });
    };
    FilesService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
        //--------------------------------------------------------
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], FilesService);
    return FilesService;
}());

//------------------------------------------------------


/***/ }),

/***/ "./src/app/services/notify.service.ts":
/*!********************************************!*\
  !*** ./src/app/services/notify.service.ts ***!
  \********************************************/
/*! exports provided: NotifyService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NotifyService", function() { return NotifyService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ngx-toastr */ "./node_modules/ngx-toastr/fesm5/ngx-toastr.js");



//---------------------------------------------------
var NotifyService = /** @class */ (function () {
    //---------------------------------------------------
    function NotifyService(toastr) {
        this.toastr = toastr;
    }
    //------------- Toastr Notifications-------------------
    NotifyService.prototype.showSuccess = function (message, title) {
        this.toastr.success(message, title);
    };
    NotifyService.prototype.showError = function (message, title) {
        this.toastr.error(message, title);
    };
    NotifyService.prototype.showInfo = function (message, title) {
        this.toastr.info(message, title);
    };
    NotifyService.prototype.showWarning = function (message, title) {
        this.toastr.warning(message, title);
    };
    NotifyService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
        //--------------------------------------------------
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"]])
    ], NotifyService);
    return NotifyService;
}());

//----------------------------------------------------


/***/ }),

/***/ "./src/app/services/stats.service.ts":
/*!*******************************************!*\
  !*** ./src/app/services/stats.service.ts ***!
  \*******************************************/
/*! exports provided: StatsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StatsService", function() { return StatsService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! socket.io-client */ "./node_modules/socket.io-client/lib/index.js");
/* harmony import */ var socket_io_client__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(socket_io_client__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");





//-------------------------------------------------
var StatsService = /** @class */ (function () {
    function StatsService(http) {
        this.http = http;
        //Headers
        this.header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        //--------- MAIN URL -----------------------------
        this._url = "http://127.0.0.1:8040/";
        this.socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__(this._url);
    }
    //--------------------------------------------------------
    // Monitor
    StatsService.prototype.monitor = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/monitor', function (data) {
                observer.next(data);
            });
        });
    };
    // Medical Records database
    StatsService.prototype.medicalDb = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/medicaldb', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- Open medical file -----------------------------
    StatsService.prototype.openmedical = function (record) {
        return this.http.post(this._url + "openmedical", record, { headers: this.header });
    };
    //--------------- Reload MED Db ----------------------------
    StatsService.prototype.onreloadMED = function () {
        return this.http.delete(this._url + "medonreload", { headers: this.header });
    };
    //--------------- Delete File ----------------------------
    StatsService.prototype.deleteMED = function () {
        return this.http.delete(this._url + "deletemedical", { headers: this.header });
    };
    // User database
    StatsService.prototype.userDb = function () {
        var socket = socket_io_client__WEBPACK_IMPORTED_MODULE_3__();
        return rxjs__WEBPACK_IMPORTED_MODULE_4__["Observable"].create(function (observer) {
            socket.on('/userdb', function (data) {
                observer.next(data);
            });
        });
    };
    //-------------- Open user Clinician -----------------------
    StatsService.prototype.openuserclinician = function (record) {
        return this.http.post(this._url + "openuserclinician", record, { headers: this.header });
    };
    //-------------- Open user Admin  -----------------------
    StatsService.prototype.openuseradmin = function (record) {
        return this.http.post(this._url + "openuseradmin", record, { headers: this.header });
    };
    //--------------- User db reload ----------------------------
    StatsService.prototype.onreloadUSER = function () {
        return this.http.delete(this._url + "useronreload", { headers: this.header });
    };
    //--------------- Delete USER ----------------------------
    StatsService.prototype.deleteUSERCLI = function () {
        return this.http.delete(this._url + "deleteusercli", { headers: this.header });
    };
    StatsService.prototype.deleteUSERADM = function () {
        return this.http.delete(this._url + "deleteuseradm", { headers: this.header });
    };
    StatsService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
        //---------------------------------------------------
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], StatsService);
    return StatsService;
}());

//------------------------------------------------------


/***/ }),

/***/ "./src/app/services/users.service.ts":
/*!*******************************************!*\
  !*** ./src/app/services/users.service.ts ***!
  \*******************************************/
/*! exports provided: UsersService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsersService", function() { return UsersService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");



//---------------------------------
var UsersService = /** @class */ (function () {
    //--------------------------------------------------------
    function UsersService(http) {
        this.http = http;
        //Headers
        this.header = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpHeaders"]({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        //--------- MAIN URL -----------------------------
        this._url = "http://127.0.0.1:8040/";
    }
    //-------------Post Clinician Registration -----------------------------
    UsersService.prototype.regClinician = function (record) {
        return this.http.post(this._url + "regclinician", record, { headers: this.header });
    };
    //-------------Post Clinician Login -----------------------------
    UsersService.prototype.logClinician = function (record) {
        return this.http.post(this._url + "logclinician", record, { headers: this.header });
    };
    //-------------Post Admin Registration -----------------------------
    UsersService.prototype.regAdmin = function (record) {
        return this.http.post(this._url + "regadmin", record, { headers: this.header });
    };
    //-------------Post Clinician Login -----------------------------
    UsersService.prototype.logAdmin = function (record) {
        return this.http.post(this._url + "logadmin", record, { headers: this.header });
    };
    UsersService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
            providedIn: 'root'
        })
        //--------------------------------------------------------
        ,
        tslib__WEBPACK_IMPORTED_MODULE_0__["__metadata"]("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], UsersService);
    return UsersService;
}());

//--------------------------------------------------------


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: true
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills */ "./src/polyfills.ts");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(function (err) { return console.error(err); });


/***/ }),

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zone.js/dist/zone */ "./node_modules/zone.js/dist/zone.js");
/* harmony import */ var zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(zone_js_dist_zone__WEBPACK_IMPORTED_MODULE_0__);
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/guide/browser-support
 */
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 * because those flags need to be set before `zone.js` being loaded, and webpack
 * will put import in the top of bundle, so user need to create a separate file
 * in this directory (for example: zone-flags.ts), and put the following flags
 * into that file, and then add the following code before importing zone.js.
 * import './zone-flags.ts';
 *
 * The flags allowed in zone-flags.ts are listed here.
 *
 * The following flags will work for all browsers.
 *
 * (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
 * (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
 * (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
 *
 *  in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
 *  with the following flag, it will bypass `zone.js` patch for IE/Edge
 *
 *  (window as any).__Zone_enable_cross_context_check = true;
 *
 */
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
 // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\TheCode\meanAppRaw\kimsapp\src\main.ts */"./src/main.ts");


/***/ }),

/***/ 1:
/*!********************!*\
  !*** ws (ignored) ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map