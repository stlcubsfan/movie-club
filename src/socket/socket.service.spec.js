(function (angular) {
    'use strict';

    describe('socket', function () {

        var $rootScope;
        var socket;

        beforeEach(module('movieClub'));
        beforeEach(inject(function (_$rootScope_, _socket_) {
            socket = _socket_;
            $rootScope = _$rootScope_;
        }));

        it('should exist', function () {
            expect(socket).toBeDefined();
        });

        describe('on', function () {
            it('should trigger a start event when the first listener for an event registers', function () {
                spyOn($rootScope, '$emit');
                socket.on('event-name', angular.noop);

                expect($rootScope.$emit).toHaveBeenCalledWith('mc-start-event-event-name');
            });

            it('should not trigger a start event when subsequent listeners for the same event register', function () {
                socket.on('event-name', angular.noop);

                spyOn($rootScope, '$emit');
                socket.on('event-name', angular.noop);
                socket.on('event-name', angular.noop);

                expect($rootScope.$emit).not.toHaveBeenCalled();
            });

            it('should trigger a start event if a listener for a different event registers', function () {
                socket.on('first-event-name', angular.noop);

                spyOn($rootScope, '$emit');
                socket.on('second-event-name', angular.noop);

                expect($rootScope.$emit).toHaveBeenCalledWith('mc-start-event-second-event-name');
            });
        });

        describe('emit', function () {

            it('should notify the listeners for the event published', function () {
                var callback1 = jasmine.createSpy('callback1');
                var callback2 = jasmine.createSpy('callback2');
                var callback3 = jasmine.createSpy('callback3');
                socket.on('event', callback1);
                socket.on('event', callback2);
                socket.on('event', callback3);

                socket.emit('event', 'data');

                expect(callback1).toHaveBeenCalled();
                expect(callback2).toHaveBeenCalled();
                expect(callback3).toHaveBeenCalled();
            });

            it('should pass along the data and the callback to the listeners', function () {
                var callback = jasmine.createSpy('callback');
                socket.on('event', callback);

                socket.emit('event', 'data', 'callback');

                expect(callback).toHaveBeenCalledWith('data', 'callback');
            });
        });

        describe('removeListener', function () {

            it('should trigger a stop event when the last listener is removed', function () {
                socket.on('event-name', angular.noop);

                spyOn($rootScope, '$emit');
                socket.removeListener('event-name', angular.noop);

                expect($rootScope.$emit).toHaveBeenCalledWith('mc-stop-event-event-name');
            });

            it('should not trigger a stop event when there are listeners remaining', function () {
                socket.on('event-name', angular.noop);
                socket.on('event-name', function otherFunc() { });

                spyOn($rootScope, '$emit');
                socket.removeListener('event-name', angular.noop);

                expect($rootScope.$emit).not.toHaveBeenCalled();
            });

            it('should not trigger a stop event if a non-existent listener is removed', function () {
                spyOn($rootScope, '$emit');
                socket.removeListener('event-name', angular.noop);

                expect($rootScope.$emit).not.toHaveBeenCalled();
            });

            it('should remove the listener so that it is no longer notified of events', function () {
                var callback = jasmine.createSpy('callback');
                socket.on('event-name', callback);

                socket.removeListener('event-name', callback);
                socket.emit('event-name');

                expect(callback).not.toHaveBeenCalled();
            });
        });
    });
}(window.angular));
