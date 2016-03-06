(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEBUG = true;

var CellsDrawer = (function () {
    function CellsDrawer(roundaboutSpecification, cellsMap, unitConverter, two) {
        _classCallCheck(this, CellsDrawer);

        this._cellsMap = cellsMap;
        this._unitConverter = unitConverter;
        this._roundaboutSpecification = roundaboutSpecification;
        this._two = two;
        this._centerPoint = {
            x: this._two.width / 2,
            y: this._two.height / 2
        };
        this._cellsMap.registerObserver(this);
        this._drawnCells = [];
        this._cellLengthPx = this._unitConverter.cellsAsPixels(1);
    }

    /**
     * Handle change in cellsMap and refresh view.
     * Implements observer Pattern.
     */

    _createClass(CellsDrawer, [{
        key: "notify",
        value: function notify() {
            this.draw();
        }
    }, {
        key: "draw",
        value: function draw() {
            this._clearDrawnElements();
            this._drawRoundaboutGrid();
        }
    }, {
        key: "_clearDrawnElements",
        value: function _clearDrawnElements() {
            this._two.remove(this._drawnCells);
        }
    }, {
        key: "_drawRoundaboutGrid",
        value: function _drawRoundaboutGrid() {
            var _this = this;

            var cellWidthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.laneWidth());

            this._roundaboutSpecification.lanesNumbers().forEach(function (laneNumber) {
                var laneRadiusPx = _this._unitConverter.metersAsPixels(_this._roundaboutSpecification.laneRadius(laneNumber));
                var cellsCount = _this._unitConverter.metersAsCells(_this._roundaboutSpecification.lengthOfLane(laneNumber));
                _this._cellsMap.cellsOnLane(laneNumber).forEach(function (cell, cellIndex) {
                    var pct = cellsCount - cellIndex / cellsCount;
                    var theta = pct * Math.PI * 2;
                    var x = laneRadiusPx * Math.cos(theta);
                    var y = laneRadiusPx * Math.sin(theta);
                    var singleCell = _this._two.makeRectangle(_this._centerPoint.x + x, _this._centerPoint.y + y, _this._cellLengthPx, cellWidthPx);
                    singleCell.rotation = Math.atan2(-y, -x) + Math.PI / 2;
                    _this._cellFillColor(cell, singleCell);
                    _this._drawStrokeIfDebug(singleCell);
                    _this._drawnCells.push(singleCell);
                });
            });
        }
    }, {
        key: "_cellFillColor",
        value: function _cellFillColor(cell, cellElement) {
            if (cell.isTaken()) {
                cellElement.fill = "#FF0000";
            } else {
                cellElement.fill = "transparent";
            }
        }
    }, {
        key: "_drawStrokeIfDebug",
        value: function _drawStrokeIfDebug(cellElement) {
            if (DEBUG) {
                cellElement.stroke = "#FF0000";
            } else {
                cellElement.noStroke();
            }
        }
    }]);

    return CellsDrawer;
})();

exports["default"] = CellsDrawer;
module.exports = exports["default"];

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DRAW_CELLS_GRID = true;
var METERS_PER_CELL = 2.5;
var CELLS_TO_DRAW = 10;
var ADHERENT_ROAD_LENGTH = METERS_PER_CELL * CELLS_TO_DRAW; // Draw 25m of adherent roads for now

var RoundaboutDrawer = (function () {
    function RoundaboutDrawer(roundaboutSpecification, unitConverter, two) {
        _classCallCheck(this, RoundaboutDrawer);

        this._roundaboutSpecification = roundaboutSpecification;
        this._unitConverter = unitConverter;
        this._two = two;
        this._centerPoint = {
            x: this._two.width / 2,
            y: this._two.height / 2
        };
        this._letRoadMeltIntoRoundabout = 7;
    }

    _createClass(RoundaboutDrawer, [{
        key: "draw",
        value: function draw() {
            this._drawAdherentRoads();
            this._drawRoundaboutRoads();
            this._drawRoundaboutBrokenLanes();
            this._drawIsland();
        }
    }, {
        key: "_drawRoundaboutRoads",
        value: function _drawRoundaboutRoads() {
            var roundaboutRadiusPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.roundaboutRadius());
            var background = this._two.makeCircle(this._centerPoint.x, this._centerPoint.y, roundaboutRadiusPx);
            background.fill = "#000000";
        }
    }, {
        key: "_drawRoundaboutBrokenLanes",
        value: function _drawRoundaboutBrokenLanes() {
            for (var i = 1; i < this._roundaboutSpecification.lanesCount(); i++) {
                var laneRadius = this._roundaboutSpecification.roundaboutRadius() - this._roundaboutSpecification.laneWidth() * i; // TODO: Change it
                var laneRadiusPx = this._unitConverter.metersAsPixels(laneRadius);
                var brokenLinesCount = laneRadius * 4; // It could be anything else but 4 looks cool

                for (var j = 0; j < brokenLinesCount; j++) {
                    var pct = j / brokenLinesCount;
                    var theta = pct * Math.PI * 2;
                    var x = laneRadiusPx * Math.cos(theta);
                    var y = laneRadiusPx * Math.sin(theta);

                    var singleLine = this._two.makeRectangle(this._centerPoint.x + x, this._centerPoint.y + y, 5, 1);
                    singleLine.noStroke();
                    singleLine.fill = "#FFFFFF";
                    singleLine.rotation = Math.atan2(-y, -x) + Math.PI / 2;
                }
            }
        }
    }, {
        key: "_drawIsland",
        value: function _drawIsland() {
            var islandRadiusPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.islandRadius());
            var island = this._two.makeCircle(this._centerPoint.x, this._centerPoint.y, islandRadiusPx);
            island.fill = "#00FF00";
        }
    }, {
        key: "_drawAdherentRoads",
        value: function _drawAdherentRoads() {
            var roadLengthPx = this._unitConverter.metersAsPixels(ADHERENT_ROAD_LENGTH);
            var roundaboutRadiusPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.roundaboutRadius());
            var pixelsFromCenterToRoadCenter = roundaboutRadiusPx + roadLengthPx / 2;

            var southRoad = this._drawRoad();
            southRoad.translation.set(this._centerPoint.x, this._centerPoint.y + pixelsFromCenterToRoadCenter);
            var westRoad = this._drawRoad();
            westRoad.translation.set(this._centerPoint.x - pixelsFromCenterToRoadCenter, this._centerPoint.y);
            westRoad.rotation += 1 * Math.PI / 2;
            var northRoad = this._drawRoad();
            northRoad.translation.set(this._centerPoint.x, this._centerPoint.y - pixelsFromCenterToRoadCenter);
            northRoad.rotation += 2 * Math.PI / 2;
            var eastRoad = this._drawRoad();
            eastRoad.translation.set(this._centerPoint.x + pixelsFromCenterToRoadCenter, this._centerPoint.y);
            eastRoad.rotation += 3 * Math.PI / 2;
        }
    }, {
        key: "_drawRoad",
        value: function _drawRoad() {
            var roadLengthPx = this._unitConverter.metersAsPixels(ADHERENT_ROAD_LENGTH) + this._letRoadMeltIntoRoundabout;
            var roadWidthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadWidth());

            // Create road element
            var road = this._two.makeRectangle(0, 0, roadWidthPx, roadLengthPx);
            road.fill = "#0F0F0F";

            var middleLine = this._drawContinuousLine(roadLengthPx);
            var leftLines = this._drawStraightBrokenLine(-roadWidthPx / 4, roadLengthPx);
            var rightLines = this._drawStraightBrokenLine(roadWidthPx / 4, roadLengthPx);
            var cellsGrid = this._drawAdherentRoadsGrid(roadWidthPx, roadLengthPx);

            var groupedElements = [road, middleLine].concat(leftLines, rightLines, cellsGrid);

            var wholeRoad = this._two.makeGroup(groupedElements);
            return wholeRoad;
        }
    }, {
        key: "_drawAdherentRoadsGrid",
        value: function _drawAdherentRoadsGrid(roadWidthPx, roadLengthPx) {
            if (!DRAW_CELLS_GRID) {
                return [];
            }
            var adherentRoadsCount = this._roundaboutSpecification.adherentRoadsCount();
            var cells = [];
            var cellLengthPx = this._unitConverter.cellsAsPixels(1);
            var cellWidthPx = this._unitConverter.metersAsPixels(this._roundaboutSpecification.adherentRoadWidth() / adherentRoadsCount);

            for (var i = 0; i < adherentRoadsCount; i++) {
                for (var j = 0; j < CELLS_TO_DRAW; j++) {
                    var cell = this._two.makeRectangle(-roadWidthPx / adherentRoadsCount + i / adherentRoadsCount * roadWidthPx - cellWidthPx / 2, roadLengthPx / 2 - cellLengthPx / 2 - j * cellLengthPx, cellWidthPx, cellLengthPx);
                    cell.stroke = "#FF0000";
                    cell.fill = "transparent";
                    cells.push(cell);
                }
            }
            return cells;
        }
    }, {
        key: "_drawStraightBrokenLine",
        value: function _drawStraightBrokenLine(xPos, lineLength) {
            var groupedElements = [];
            var linesToDraw = 16;
            var lineStartingY = -lineLength / 2;

            for (var i = 0; i < linesToDraw; i++) {
                var thisStarts = lineStartingY + i / linesToDraw * lineLength;
                var thisEnds = thisStarts + 1 / linesToDraw * lineLength;

                // Draw dotted line or continuous line on the beginning of the road
                if (i % 2 == 0 || i < 4) {
                    var brokenLine = this._two.makeLine(xPos, thisStarts, xPos, thisEnds);
                    brokenLine.stroke = "#FFFFFF";
                    groupedElements.push(brokenLine);
                }
            }
            return groupedElements;
        }
    }, {
        key: "_drawContinuousLine",
        value: function _drawContinuousLine(roadLengthPx) {
            var line = this._two.makeLine(0, 0 - roadLengthPx / 2, 0, 0 + roadLengthPx / 2);
            line.stroke = "#FFFFFF";
            return line;
        }
    }]);

    return RoundaboutDrawer;
})();

exports.RoundaboutDrawer = RoundaboutDrawer;
exports.ADHERENT_ROAD_LENGTH = ADHERENT_ROAD_LENGTH;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var METERS_PER_CELL = 2.5;

var UnitConverter = (function () {
    function UnitConverter(canvasInMeters, canvasInPixels) {
        _classCallCheck(this, UnitConverter);

        this.canvasInMeters = canvasInMeters;
        this.canvasInPixels = canvasInPixels;
    }

    _createClass(UnitConverter, [{
        key: "pixelsPerMeter",
        value: function pixelsPerMeter() {
            return Math.floor(this.canvasInPixels / this.canvasInMeters);
        }
    }, {
        key: "metersAsPixels",
        value: function metersAsPixels(meters) {
            return meters * this.pixelsPerMeter();
        }
    }, {
        key: "metersAsCells",
        value: function metersAsCells(meters) {
            return Math.floor(meters / METERS_PER_CELL);
        }
    }, {
        key: "cellsAsPixels",
        value: function cellsAsPixels(cells) {
            return this.metersAsPixels(cells * METERS_PER_CELL);
        }
    }]);

    return UnitConverter;
})();

exports["default"] = UnitConverter;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
function range(start, count) {
    return Array.apply(0, Array(count)).map(function (element, index) {
        return index + start;
    });
}

exports.range = range;

//TODO: Consider this Array.from(new Array(5), (x,i) => i)

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _JsWhyYouNoImplementJs = require('./JsWhyYouNoImplement.js');

var RoundaboutSpecification = (function () {
    function RoundaboutSpecification(laneWidth, lanesCount, islandRadius, adherentRoadSpecification) {
        _classCallCheck(this, RoundaboutSpecification);

        this._laneWidth = laneWidth;
        this._lanesCount = lanesCount;
        this._islandRadius = islandRadius;
        this._adherentRoadSpecification = adherentRoadSpecification;
    }

    _createClass(RoundaboutSpecification, [{
        key: "roundaboutDiameter",
        value: function roundaboutDiameter() {
            var islandDiameter = 2 * this._islandRadius;
            return islandDiameter + this.lanesWidth() * 2;
        }
    }, {
        key: "roundaboutRadius",
        value: function roundaboutRadius() {
            return this.roundaboutDiameter() / 2;
        }
    }, {
        key: "lanesCount",
        value: function lanesCount() {
            return this._lanesCount;
        }
    }, {
        key: "lanesWidth",
        value: function lanesWidth() {
            return this.lanesCount() * this.laneWidth();
        }
    }, {
        key: "lanesNumbers",
        value: function lanesNumbers() {
            return (0, _JsWhyYouNoImplementJs.range)(0, this.lanesCount());
        }
    }, {
        key: "laneWidth",
        value: function laneWidth() {
            return this._laneWidth;
        }
    }, {
        key: "islandRadius",
        value: function islandRadius() {
            return this._islandRadius;
        }
    }, {
        key: "adherentRoadWidth",
        value: function adherentRoadWidth() {
            return this._adherentRoadSpecification.ingoingLanes * this._adherentRoadSpecification.lanesWidth + this._adherentRoadSpecification.outgoingLanes * this._adherentRoadSpecification.lanesWidth;
        }
    }, {
        key: "adherentRoadsCount",
        value: function adherentRoadsCount() {
            return this._adherentRoadSpecification.ingoingLanes + this._adherentRoadSpecification.outgoingLanes;
        }
    }, {
        key: "lengthOfLane",
        value: function lengthOfLane(laneNumber) {
            if (laneNumber >= this.lanesCount()) {
                throw new Error("Incorrect lane number - 0 is the most inner, 1 is outer.");
            }
            return 2 * Math.PI * (this.islandRadius() + laneNumber * this.laneWidth());
        }

        /**
         * Radius is counted to center of the lane
         */
    }, {
        key: "laneRadius",
        value: function laneRadius(laneNumber) {
            if (laneNumber >= this.lanesCount()) {
                throw new Error("Incorrect lane number - 0 is the most inner, 1 is outer.");
            }

            return this.islandRadius() + this.laneWidth() * laneNumber + this.laneWidth() / 2;
        }
    }]);

    return RoundaboutSpecification;
})();

var roundaboutBukowe = new RoundaboutSpecification(4.5, 2, 56 / 2, {
    ingoingLanes: 2,
    outgoingLanes: 2,
    lanesWidth: 3.5
});

var roundaboutThreeLanes = new RoundaboutSpecification(4.5, 3, 56 / 2, {
    ingoingLanes: 2,
    outgoingLanes: 2,
    lanesWidth: 3.5
});

exports.roundaboutBukowe = roundaboutBukowe;
exports.roundaboutThreeLanes = roundaboutThreeLanes;

},{"./JsWhyYouNoImplement.js":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cell = (function () {
    function Cell(parentLane, cellId) {
        _classCallCheck(this, Cell);

        this._parentLane = parentLane;
        this._cellId = cellId;
        this._taken = false;
    }

    _createClass(Cell, [{
        key: "parentLane",
        value: function parentLane() {
            return this._parentLane;
        }
    }, {
        key: "equals",
        value: function equals(anotherCell) {
            return this._parentLane == anotherCell._parentLane && this._cellId == anotherCell._cellId;
        }
    }, {
        key: "setTaken",
        value: function setTaken(taken) {
            this._taken = taken;
        }
    }, {
        key: "isTaken",
        value: function isTaken() {
            return this._taken;
        }
    }, {
        key: "isEmpty",
        value: function isEmpty() {
            return !this._taken;
        }
    }, {
        key: "id",
        value: function id() {
            return this._cellId;
        }
    }]);

    return Cell;
})();

exports["default"] = Cell;
module.exports = exports["default"];

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CellsLane = (function () {
    function CellsLane(cells) {
        var _this = this;

        _classCallCheck(this, CellsLane);

        this._cellsIdsToCells = {};
        this._cellsIds = [];
        cells.forEach(function (cell) {
            _this._cellsIdsToCells[cell.id()] = cell;
            _this._cellsIds.push(cell.id());
        });

        this._cellsIdsReversed = this._cellsIds.slice().reverse();
    }

    _createClass(CellsLane, [{
        key: "cellsNextTo",
        value: function cellsNextTo(cell, limitTo) {
            return this._cellsNextTo(cell, limitTo, this._cellsIds);
        }
    }, {
        key: "cellsPreviousTo",
        value: function cellsPreviousTo(cell, limitTo) {
            return this._cellsNextTo(cell, limitTo, this._cellsIdsReversed);
        }
    }, {
        key: "_cellsNextTo",
        value: function _cellsNextTo(cell, limitTo, arrayFrom) {
            var _this2 = this;

            var nextCellId = arrayFrom.indexOf(cell.id()) + 1;
            var nextCellsIds = arrayFrom.slice(nextCellId, nextCellId + limitTo);
            var missingCells = limitTo - nextCellsIds.length;
            nextCellsIds = nextCellsIds.concat(arrayFrom.slice(0, missingCells));
            var nextCells = [];
            nextCellsIds.forEach(function (nextCellId) {
                nextCells.push(_this2._cellsIdsToCells[nextCellId]);
            });
            return nextCells;
        }
    }]);

    return CellsLane;
})();

exports["default"] = CellsLane;
module.exports = exports["default"];

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _JsWhyYouNoImplementJs = require('../JsWhyYouNoImplement.js');

var _CellJs = require('./Cell.js');

var _CellJs2 = _interopRequireDefault(_CellJs);

var _CellsLaneJs = require('./CellsLane.js');

var _CellsLaneJs2 = _interopRequireDefault(_CellsLaneJs);

var _VehicleJs = require('./Vehicle.js');

var _VehicleJs2 = _interopRequireDefault(_VehicleJs);

var _ObservableJs = require('./Observable.js');

var _ObservableJs2 = _interopRequireDefault(_ObservableJs);

var CellsMap = (function (_Observable) {
    _inherits(CellsMap, _Observable);

    function CellsMap(roundaboutSpecification, unitConverter) {
        _classCallCheck(this, CellsMap);

        _get(Object.getPrototypeOf(CellsMap.prototype), 'constructor', this).call(this);
        this._roundaboutSpecification = roundaboutSpecification;
        this._unitConverter = unitConverter;
        this._laneCells = {};
        this._cellsLane = {};
        this._vehiclesOnCells = {};
        this._divideLanesToCells();
    }

    _createClass(CellsMap, [{
        key: '_divideLanesToCells',
        value: function _divideLanesToCells() {
            var _this = this;

            this._roundaboutSpecification.lanesNumbers().forEach(function (laneNumber) {
                _this._laneCells[laneNumber] = [];
                var cellsCount = _this._unitConverter.metersAsCells(_this._roundaboutSpecification.lengthOfLane(laneNumber));
                (0, _JsWhyYouNoImplementJs.range)(0, cellsCount).forEach(function (cellNumber) {
                    _this._laneCells[laneNumber].push(new _CellJs2['default'](laneNumber, cellNumber));
                });
                _this._cellsLane[laneNumber] = new _CellsLaneJs2['default'](_this._laneCells[laneNumber]);
            });
        }
    }, {
        key: 'cellsOnLane',
        value: function cellsOnLane(laneNumber) {
            return this._laneCells[laneNumber];
        }
    }, {
        key: 'moveVehicleBy',
        value: function moveVehicleBy(vehicle, cellsToMove) {
            var oldVehicleCells = this._vehiclesOnCells[vehicle.id()];
            var oldVehicleFrontCell = oldVehicleCells[0];
            if (!oldVehicleFrontCell) {
                throw Error("Vehicle not added");
            }
            var newVehicleFrontCell = this._cellsLane[oldVehicleFrontCell.parentLane()].cellsNextTo(oldVehicleFrontCell, cellsToMove).slice(-1)[0];
            console.log("dupka", oldVehicleFrontCell, newVehicleFrontCell, cellsToMove);
            var newVehicleCells = this._cellsLane[newVehicleFrontCell.parentLane()].cellsPreviousTo(newVehicleFrontCell, vehicle.lengthCells());
            oldVehicleCells.forEach(function (cell) {
                cell.setTaken(false);
            });
            newVehicleCells.forEach(function (cell) {
                cell.setTaken(true);
            });

            this._vehiclesOnCells[vehicle.id()] = newVehicleCells;
        }
    }, {
        key: 'addVehicle',
        value: function addVehicle(vehicle) {
            var lane = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
            var cell = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

            var firstCell = this.cellsOnLane(lane)[cell];
            var vehicleCells = [firstCell];
            vehicleCells = vehicleCells.concat(this._cellsLane[lane].cellsPreviousTo(firstCell, vehicle.lengthCells() - 1));
            this._vehiclesOnCells[vehicle.id()] = vehicleCells;
            vehicleCells.forEach(function (cell) {
                cell.setTaken(true);
            });
        }
    }, {
        key: 'nothingInFrontOf',
        value: function nothingInFrontOf(vehicle, numberOfCellsToCheck) {
            var vehiclesFirstCell = this._vehiclesOnCells[vehicle.id()][0];
            var nextCells = this._cellsLane[vehiclesFirstCell.parentLane()].cellsNextTo(vehiclesFirstCell, numberOfCellsToCheck);
            return nextCells.every(function (cell) {
                return cell.isEmpty();
            });
        }
    }]);

    return CellsMap;
})(_ObservableJs2['default']);

exports.CellsMap = CellsMap;

},{"../JsWhyYouNoImplement.js":4,"./Cell.js":6,"./CellsLane.js":7,"./Observable.js":10,"./Vehicle.js":11}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _VehicleJs = require('./Vehicle.js');

var _VehicleJs2 = _interopRequireDefault(_VehicleJs);

var CellularAutomata = (function () {
    function CellularAutomata(cellsMap) {
        _classCallCheck(this, CellularAutomata);

        var car1 = _VehicleJs2['default'].newCar();
        var car2 = _VehicleJs2['default'].newCar();
        var car3 = _VehicleJs2['default'].newCar();
        var car4 = _VehicleJs2['default'].newCar();
        var van = _VehicleJs2['default'].newVan();
        var truck = _VehicleJs2['default'].newTruck();
        this._vehicles = [car1, car2, car3, car4, truck, van];
        this._cellsMap = cellsMap;
        this._cellsMap.addVehicle(car1, 0, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(car2, 0, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(car3, 0, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(car4, 0, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(truck, 0, Math.floor(Math.random() * 69 + 1));
        this._cellsMap.addVehicle(van, 0, Math.floor(Math.random() * 69 + 1));
    }

    _createClass(CellularAutomata, [{
        key: 'nextIteration',
        value: function nextIteration() {
            var _this = this;

            this._vehicles.forEach(function (vehicle) {
                vehicle.moveToNextIteration(_this._cellsMap);
            });
            this._cellsMap.notifyAll();
        }
    }]);

    return CellularAutomata;
})();

exports['default'] = CellularAutomata;
module.exports = exports['default'];

},{"./Vehicle.js":11}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Observable = (function () {
    function Observable() {
        _classCallCheck(this, Observable);

        this._observers = [];
    }

    _createClass(Observable, [{
        key: "registerObserver",
        value: function registerObserver(observer) {
            this._observers.push(observer);
        }
    }, {
        key: "unregisterObserver",
        value: function unregisterObserver(observer) {
            this._observers.splice(this._observers.indexOf(observer), 1);
        }
    }, {
        key: "notifyAll",
        value: function notifyAll() {
            this._observers.forEach(function (observer) {
                observer.notify();
            });
        }
    }]);

    return Observable;
})();

exports["default"] = Observable;
module.exports = exports["default"];

},{}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vehicle = (function () {
    function Vehicle(lengthCells, maxSpeed) {
        _classCallCheck(this, Vehicle);

        this._lengthCells = lengthCells;
        this._currentSpeed = 1;
        this._maxSpeed = maxSpeed;
        this._id = Math.round(Math.random() * 1000000);
    }

    _createClass(Vehicle, [{
        key: "moveToNextIteration",
        value: function moveToNextIteration(cellsMap) {
            if (cellsMap.nothingInFrontOf(this, this._currentSpeed)) {
                if (!this._isMovingWithMaxSpeed()) {
                    this._accelerate();
                }
            } else {
                var breakUpTo = this._distanceFromPrecedingVehicle(cellsMap);
                this._break(breakUpTo);
            }

            cellsMap.moveVehicleBy(this, this._currentSpeed);
        }
    }, {
        key: "lengthCells",
        value: function lengthCells() {
            return this._lengthCells;
        }
    }, {
        key: "id",
        value: function id() {
            return this._id;
        }
    }, {
        key: "_isMovingWithMaxSpeed",
        value: function _isMovingWithMaxSpeed() {
            return this._currentSpeed == this._maxSpeed;
        }
    }, {
        key: "_accelerate",
        value: function _accelerate() {
            if (this._currentSpeed < this._maxSpeed) {
                this._currentSpeed++;
            }
        }
    }, {
        key: "_break",
        value: function _break(to) {
            this._currentSpeed = to;
        }
    }, {
        key: "_distanceFromPrecedingVehicle",
        value: function _distanceFromPrecedingVehicle(cellsMap) {
            var distanceNotEmpty = this._currentSpeed;
            while (!cellsMap.nothingInFrontOf(this, distanceNotEmpty)) {
                distanceNotEmpty--;
            }
            return distanceNotEmpty;
        }
    }], [{
        key: "newCar",
        value: function newCar() {
            return new Vehicle(2, 5);
        }
    }, {
        key: "newMotorcycle",
        value: function newMotorcycle() {
            return new Vehicle(1, 5);
        }
    }, {
        key: "newVan",
        value: function newVan() {
            return new Vehicle(3, 5);
        }
    }, {
        key: "newMiniBus",
        value: function newMiniBus() {
            return new Vehicle(4, 3);
        }
    }, {
        key: "newBus",
        value: function newBus() {
            return new Vehicle(5, 2);
        }
    }, {
        key: "newTruck",
        value: function newTruck() {
            return new Vehicle(5, 2);
        }
    }]);

    return Vehicle;
})();

exports["default"] = Vehicle;
module.exports = exports["default"];

},{}],12:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _GUIRoundaboutDrawerJs = require('./GUI/RoundaboutDrawer.js');

var _GUICellsDrawerJs = require('./GUI/CellsDrawer.js');

var _GUICellsDrawerJs2 = _interopRequireDefault(_GUICellsDrawerJs);

var _GUIUnitConverterJs = require('./GUI/UnitConverter.js');

var _GUIUnitConverterJs2 = _interopRequireDefault(_GUIUnitConverterJs);

var _RoundaboutSpecificationsJs = require('./RoundaboutSpecifications.js');

var _SimulationCellsMapJs = require('./Simulation/CellsMap.js');

var _SimulationCellularAutomataJs = require('./Simulation/CellularAutomata.js');

var _SimulationCellularAutomataJs2 = _interopRequireDefault(_SimulationCellularAutomataJs);

var unitConverter = new _GUIUnitConverterJs2['default'](_RoundaboutSpecificationsJs.roundaboutBukowe.roundaboutDiameter() + _GUIRoundaboutDrawerJs.ADHERENT_ROAD_LENGTH * 2, Math.min(window.innerWidth, window.innerHeight));

var twojs = new Two({
    fullscreen: true,
    autostart: true
}).appendTo(document.body);

var roundaboutBukoweCellsMap = new _SimulationCellsMapJs.CellsMap(_RoundaboutSpecificationsJs.roundaboutBukowe, unitConverter);

var roundaboutThreeLanesCellsMap = new _SimulationCellsMapJs.CellsMap(_RoundaboutSpecificationsJs.roundaboutThreeLanes, unitConverter);

var roundaboutDrawer = new _GUIRoundaboutDrawerJs.RoundaboutDrawer(_RoundaboutSpecificationsJs.roundaboutBukowe, unitConverter, twojs);

var roundaboutCellsDrawer = new _GUICellsDrawerJs2['default'](_RoundaboutSpecificationsJs.roundaboutBukowe, roundaboutBukoweCellsMap, unitConverter, twojs);

var cellularAutomata = new _SimulationCellularAutomataJs2['default'](roundaboutBukoweCellsMap);

roundaboutDrawer.draw();
setInterval(function () {
    cellularAutomata.nextIteration();
}, 1000);

},{"./GUI/CellsDrawer.js":1,"./GUI/RoundaboutDrawer.js":2,"./GUI/UnitConverter.js":3,"./RoundaboutSpecifications.js":5,"./Simulation/CellsMap.js":8,"./Simulation/CellularAutomata.js":9}]},{},[12]);
