"use strict";
var socket;
var mapper;
function main() {
    socket = io();
    mapper = Mapper.init(document.getElementById('mapCard'));
    socket.on('connected', function (users) {
        socket.emit('subscribe', users.sort(function(a,b) { 
 -          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime() 
 -      }[0]));
        console.log(users);
    });
    socket.on('newPacket', function (packet) {
        console.log(packet);
        mapper.addPackets([packet]);
        console.log(mapper._packets);
        mapper.render();
        var car = mapper.car;
        document.getElementById('songCard').innerText = car.song;
        document.getElementById('moodCard').innerText = Object.keys(car.mood).reduce(
            function(a, b) {
                return car.mood[a] > car.mood[b] ? a : b
            }
        );
    });
    
    socket.on('newPackets', function (packets) {
        console.log(packets);
        mapper.addPackets(packets);
        console.log(mapper._packets);
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
