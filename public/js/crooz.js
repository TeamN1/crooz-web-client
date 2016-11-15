"use strict";
var socket;
var mapper;
function main() {
    socket = io();
    mapper = Mapper.init(document.getElementById('mapCard'));
    socket.on('connected', function (users) {
        socket.emit('subscribe', users[0]);
    });
    socket.on('newPacket', function (packet) {
        mapper.addPackets([packet]);
        mapper.render();
        var car = mapper.car;
        document.getElementById('songCard').innerText = car.song;
        document.getElementById('moodCard').innerText = Object.keys(car.mood).reduce(
            function(a, b) {
                return car.mood[a] > car.mood[b] ? a : b
            }
        );
    });
}
