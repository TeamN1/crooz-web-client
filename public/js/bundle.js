(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var Mapper = (function () {
    function Mapper(element, packetList) {
        if (packetList === void 0) { packetList = []; }
        this.map = new Microsoft.Maps.Map(element, {
            credentials: 'AuknkZ3WFkby8tWsY03iI9muVj4jcRdHztYdxJiOdu6PXPrX7Tm2ziXOsfz3wAPY',
            center: new Microsoft.Maps.Location(51.50632, -0.12714)
        });
        this.packets = packetList;
    }
    ;
    Mapper.prototype.render = function () {
        this.drawPolyline(this.packets);
        for (var i = this.map.entities.getLength() - 1; i >= 0; i--) {
            var previousPin = this.map.entities.get(i);
            if (previousPin instanceof Microsoft.Maps.Pushpin) {
                this.map.entities.removeAt(i);
            }
        }
        var pushPin = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(this._car.geo.lat, this._car.geo.lon), null);
        this.map.entities.push(pushPin);
    };
    Object.defineProperty(Mapper.prototype, "packets", {
        get: function () {
            return this._packets;
        },
        set: function (packetList) {
            if (packetList) {
                this._packets.concat(packetList);
                this._car = this._packets[this._packets.length - 1];
            }
            else {
                this._packets = new Array();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Mapper.prototype, "car", {
        get: function () {
            return this._car;
        },
        enumerable: true,
        configurable: true
    });
    // set car(packet: any) {
    //     this._car = packet;
    // }
    Mapper.prototype.drawPolyline = function (packetList) {
        var locationList = [];
        for (var _i = 0, packetList_1 = packetList; _i < packetList_1.length; _i++) {
            var packet_1 = packetList_1[_i];
            locationList.push(new Microsoft.Maps.Location(packet_1.geo.lat, packet_1.geo.lon));
        }
        if (this._polyline instanceof null) {
            this._polyline = new Microsoft.Maps.Polyline(locationList, null);
            this.map.entities.push(this._polyline);
        }
        else {
            this._polyline.setLocations(locationList);
        }
    };
    return Mapper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Mapper;
},{}],2:[function(require,module,exports){
"use strict";
var Mapper_1 = require('./Mapper');
// var socket_io_client_1 = require('socket.io-client');
var socket = io();
var mapper = new Mapper_1.default(document.getElementById('mapCard'));
socket.on('connected', function (users) {
    socket.emit('subscribe', users[0]);
    console.log("connected");
});
socket.on('newPacket', function (packet) {
    console.log("got a new Packet");
    mapper.packets = [packet];
    mapper.render();
    var car = mapper.car;
    document.getElementById('songCard').innerText = car.song;
    document.getElementById('moodCard').innerText = Object.keys(car.mood).reduce(
        function(a, b) {
            return car.mood[a] > car.mood[b] ? a : b
        }
    );
});
},{"./Mapper":1}]},{},[2]);
