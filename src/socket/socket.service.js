(function (angular) {
    'use strict';

    angular
        .module('movieClub')
        .factory('socket', socket);

    function socket($rootScope) {

        var eventRegistry = {};

        var factory = {
            on: on,
            emit: emit,
            removeListener: removeListener
        };
        return factory;

        function on(eventName, callback) {

            var registry = eventRegistry[eventName];

            if (!registry) {
                registry = eventRegistry[eventName] = {consumers: []};
            }

            if (!registry.consumers.length) {
                $rootScope.$emit('mc-start-event-' + eventName);
            }

            registry.consumers.push({callback: callback});
        }

        function emit(eventName, data, callback) {

            var registry = eventRegistry[eventName];

            if (registry) {
                _.forEach(registry.consumers, function (consumer) {
                    consumer.callback(data, callback);
                });
            }
        }

        function removeListener(eventName, callback) {

            var registry = eventRegistry[eventName];

            if (registry && registry.consumers.length) {
                _.remove(registry.consumers, {callback: callback});

                if (!registry.consumers.length) {
                    $rootScope.$emit('mc-stop-event-' + eventName);
                }
            }
        }
    }

}(window.angular));
